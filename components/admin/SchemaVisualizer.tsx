"use client"

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
  MiniMap,
  BackgroundVariant,
  Position,
  OnConnect,
  XYPosition
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from '@dagrejs/dagre';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCcw, 
  Box,
  Layout,
  MousePointer2,
  Zap,
  Info,
  ChevronRight,
  Database,
  ArrowRight
} from 'lucide-react';
import { RelationNode } from './RelationNode';
import { ModuleGroup } from './ModuleGroup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toPng } from 'html-to-image';

const nodeTypes = {
  dbTable: RelationNode,
  moduleGroup: ModuleGroup
};

const dagreGraph = new dagre.graphlib.Graph({ compound: true });
dagreGraph.setDefaultEdgeLabel(() => ({}));

const NODE_WIDTH = 240;
const NODE_HEIGHT = 200;
const GROUP_PADDING = 80;

// BFS Algorithm for Path Finding
function findShortestPath(nodes: Node[], edges: Edge[], startId: string, endId: string): string[] | null {
    const queue: string[][] = [[startId]];
    const visited = new Set([startId]);

    while (queue.length > 0) {
        const path = queue.shift()!;
        const node = path[path.length - 1];

        if (node === endId) return path;

        const neighbors = edges
            .filter(e => e.source === node || e.target === node)
            .map(e => e.source === node ? e.target : e.source);

        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push([...path, neighbor]);
            }
        }
    }
    return null;
}

export default function SchemaVisualizer() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [rawModels, setRawModels] = useState<any[]>([]);
  
  // Advanced Features State
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sampleData, setSampleData] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  
  // Path Finder State
  const [isConnectMode, setIsConnectMode] = useState(false);
  const [pathStart, setPathStart] = useState<string | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);

  const applyLayout = useCallback((nodes: Node[], edges: Edge[], direction = 'LR'): Node[] => {
    const isHorizontal = direction === 'LR';
    // Clear graph before rebuild
    const nodesToRemove = dagreGraph.nodes();
    nodesToRemove.forEach(n => dagreGraph.removeNode(n));

    dagreGraph.setGraph({ rankdir: direction, ranksep: 120, nodesep: 100, compound: true });

    // 1. Add all nodes to Dagre
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { 
        width: node.type === 'moduleGroup' ? 100 : NODE_WIDTH, // Dagre will resize groups
        height: node.type === 'moduleGroup' ? 100 : NODE_HEIGHT 
      });
      if (node.parentId) {
        dagreGraph.setParent(node.id, node.parentId);
      }
    });

    // 2. Add edges
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    // 3. Translate coordinates
    return nodes.map((node) => {
      const gNode = dagreGraph.node(node.id);
      let posX = gNode.x - (node.type === 'moduleGroup' ? gNode.width / 2 : NODE_WIDTH / 2);
      let posY = gNode.y - (node.type === 'moduleGroup' ? gNode.height / 2 : NODE_HEIGHT / 2);

      // If it's a child node, React Flow expects coordinates relative to parent!
      if (node.parentId) {
        const pNode = dagreGraph.node(node.parentId);
        const pX = pNode.x - pNode.width / 2;
        const pY = pNode.y - pNode.height / 2;
        posX -= pX;
        posY -= pY;
      }

      return {
        ...node,
        targetPosition: isHorizontal ? Position.Left : Position.Top,
        sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
        position: { x: posX, y: posY } as XYPosition,
        // For module groups, set the actual size calculated by Dagre
        style: node.type === 'moduleGroup' ? { width: gNode.width, height: gNode.height } : undefined
      };
    });
  }, []);

  const generateGraph = useCallback((models: any[]) => {
    const initialNodes: Node[] = [];
    const initialEdges: Edge[] = [];
    
    // Identify unique modules
    const modules = Array.from(new Set(models.map(m => m.module || 'Common'))).filter(Boolean);

    // 1. Create Group Nodes
    modules.forEach((module: any) => {
        initialNodes.push({
            id: `group-${module}`,
            type: 'moduleGroup',
            data: { label: module },
            position: { x: 0, y: 0 },
            zIndex: -1, // Ensure backgrounds are behind tables
        });
    });

    // 2. Create Table Nodes
    models.forEach((model) => {
      const moduleId = `group-${model.module || 'Common'}`;
      initialNodes.push({
        id: model.name,
        type: 'dbTable',
        data: { 
          label: model.name, 
          fields: model.fields,
          module: model.module,
          selected: false
        },
        position: { x: 0, y: 0 },
        parentId: moduleId,
        extent: 'parent', // Constrain tables to their group box
      });

      (model.relations || []).forEach((rel: any) => {
        if (models.some(m => m.name === rel.target)) {
          initialEdges.push({
            id: `e-${model.name}-${rel.target}-${rel.field}`,
            source: model.name,
            target: rel.target,
            label: rel.field,
            animated: rel.type === 'one-to-many',
            interactionWidth: 5,
            style: { stroke: '#94a3b8', strokeWidth: 2 },
            labelStyle: { fill: '#64748b', fontWeight: 600, fontSize: 9 }
          });
        }
      });
    });

    const laidOutNodes = applyLayout(initialNodes, initialEdges);
    return { nodes: laidOutNodes, edges: initialEdges };
  }, [applyLayout]);

  useEffect(() => {
    async function fetchSchema() {
      try {
        const res = await fetch('/api/schema');
        const data = await res.json();
        setRawModels(data.models);
        const { nodes: n, edges: e } = generateGraph(data.models);
        setNodes(n);
        setEdges(e);
      } catch (err) {
        console.error('Failed to load schema', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSchema();
  }, [generateGraph, setNodes, setEdges]);

  // Update Visual States (Highlighting)
  useEffect(() => {
    setNodes((nds) => 
        nds.map((node) => ({
            ...node,
            data: { 
                ...node.data, 
                selected: node.id === selectedNode || highlightedPath.includes(node.id) || node.id === pathStart 
            },
        }))
    );

    setEdges((eds) => 
        eds.map((edge) => {
            const isHighlighted = (selectedNode && (edge.source === selectedNode || edge.target === selectedNode));
            const isInPath = highlightedPath.length > 1 && 
                             highlightedPath.some((id, idx) => 
                                id === edge.source && highlightedPath[idx + 1] === edge.target ||
                                id === edge.target && highlightedPath[idx + 1] === edge.source
                             );

            return {
                ...edge,
                animated: edge.animated || !!isHighlighted || !!isInPath,
                style: { 
                    ...edge.style, 
                    stroke: isInPath ? '#6366f1' : isHighlighted ? '#10b981' : '#94a3b8',
                    strokeWidth: (isHighlighted || isInPath) ? 4 : 2,
                    opacity: (selectedNode || highlightedPath.length > 0) ? (isHighlighted || isInPath ? 1 : 0.2) : 1
                },
            };
        })
    );
  }, [selectedNode, highlightedPath, pathStart, setNodes, setEdges]);

  const onNodeClick = useCallback(async (_: any, node: Node) => {
    if (isConnectMode) {
        if (!pathStart) {
            setPathStart(node.id);
        } else {
            const path = findShortestPath(nodes, edges, pathStart, node.id);
            if (path) {
                setHighlightedPath(path);
            }
            setPathStart(null);
            setIsConnectMode(false);
        }
        return;
    }

    setSelectedNode(node.id);
    setHighlightedPath([]);
    setLoadingData(true);
    setIsSheetOpen(true);
    
    try {
        const res = await fetch(`/api/schema/data?table=${node.id}`);
        const result = await res.json();
        setSampleData(result.data || []);
    } catch (err) {
        console.error("Failed to load sample data", err);
        setSampleData([]);
    } finally {
        setLoadingData(false);
    }
  }, [isConnectMode, pathStart, nodes, edges]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setPathStart(null);
    setHighlightedPath([]);
  }, []);

  const filteredData = useMemo(() => {
    if (!searchQuery && !selectedModule) return null;
    
    const filteredModels = rawModels.filter((m: any) => {
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesModule = !selectedModule || m.module === selectedModule;
        return matchesSearch && matchesModule;
    });

    return generateGraph(filteredModels);
  }, [searchQuery, selectedModule, rawModels, generateGraph]);

  useEffect(() => {
    if (filteredData) {
        setNodes(filteredData.nodes);
        setEdges(filteredData.edges);
    } else if (rawModels.length > 0) {
        const { nodes: n, edges: e } = generateGraph(rawModels);
        setNodes(n);
        setEdges(e);
    }
  }, [filteredData, rawModels, generateGraph, setNodes, setEdges]);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const exportAsImage = async () => {
    const flowElement = document.querySelector('.react-flow') as HTMLElement;
    if (!flowElement) return;

    try {
      const dataUrl = await toPng(flowElement, {
        backgroundColor: '#f8fafc',
        cacheBust: true,
      });
      
      const link = document.createElement('a');
      link.download = `database-schema-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  const modules_list = Array.from(new Set(rawModels.map((m: any) => m.module))).filter(Boolean);

  if (loading) return <div className="p-8 text-indigo-600 animate-pulse flex items-center gap-3 font-sans">
    <RefreshCcw className="animate-spin" size={20} />
    <span className="font-semibold tracking-tight">Загрузка архитектуры системы...</span>
  </div>;

  return (
    <div className="w-full h-[85vh] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-2xl relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#acc1d9" gap={20} variant={BackgroundVariant.Dots} />
        <Controls showInteractive={false} />
        <MiniMap position="bottom-right" style={{ height: 120, width: 180 }} />
        
        <Panel position="top-left" className="flex flex-col gap-3 max-w-[280px]">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-lg space-y-4">
            <div className="flex items-center justify-between gap-2 text-indigo-600 font-bold mb-1">
                <div className="flex items-center gap-2">
                    <Layout size={18} />
                    <span className="tracking-tight">Архитектор</span>
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] uppercase ${isConnectMode ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                    {isConnectMode ? 'Режим связи' : 'Просмотр'}
                </div>
            </div>
            
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                    placeholder="Поиск таблицы..." 
                    className="pl-9 h-9 text-[11px] bg-white/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                    <Filter size={10} />
                    <span>Фильтр модулей</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    <Button 
                        variant={selectedModule === null ? "default" : "outline"} 
                        size="sm" 
                        className="text-[10px] h-7 px-2 rounded-md"
                        onClick={() => setSelectedModule(null)}
                    >
                        Все
                    </Button>
                    {modules_list.map((m: any) => (
                        <Button 
                            key={m as string}
                            variant={selectedModule === m ? "default" : "outline"} 
                            size="sm"
                            className="text-[10px] h-7 px-2 rounded-md"
                            onClick={() => setSelectedModule(m as string)}
                        >
                            {m as string}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex gap-2">
                    <Button 
                        variant={isConnectMode ? "default" : "outline"} 
                        size="sm" 
                        className={`flex-1 gap-1.5 h-8 text-[11px] font-semibold ${isConnectMode ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                        onClick={() => {
                            setIsConnectMode(!isConnectMode);
                            setPathStart(null);
                            setHighlightedPath([]);
                        }}
                    >
                        <Zap size={14} />
                        Связи
                    </Button>
                    <Button variant="default" size="sm" className="flex-1 gap-1.5 h-8 bg-indigo-600 text-white hover:bg-indigo-700 text-[11px] font-semibold" onClick={exportAsImage}>
                        <Download size={14} />
                        PNG
                    </Button>
                </div>
                <Button variant="outline" size="sm" className="w-full gap-1.5 h-8 text-[11px] font-semibold border-slate-200" onClick={() => generateGraph(rawModels)}>
                    <RefreshCcw size={14} />
                    Сбросить вид
                </Button>
            </div>
          </div>

          {(selectedNode || highlightedPath.length > 0) && (
              <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl border-l-4 border-indigo-500 shadow-lg animate-in slide-in-from-left duration-300">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs mb-1">
                    <Info size={14} />
                    <span>Активная выборка</span>
                </div>
                <div className="text-[10px] text-slate-600 flex flex-wrap items-center gap-1">
                    {highlightedPath.length > 0 ? (
                        highlightedPath.map((id: string, idx: number) => (
                            <React.Fragment key={id}>
                                <span className={idx === 0 || idx === highlightedPath.length - 1 ? 'font-bold text-indigo-600' : ''}>{id}</span>
                                {idx < highlightedPath.length - 1 && <ChevronRight size={10} />}
                            </React.Fragment>
                        ))
                    ) : (
                        <>Таблица: <span className="font-bold text-indigo-600">{selectedNode}</span></>
                    )}
                </div>
              </div>
          )}
        </Panel>

        <Panel position="bottom-left" className="bg-white/80 backdrop-blur p-3 rounded-xl border border-slate-200 shadow-md text-[10px] text-slate-600 flex gap-4">
            <div className="flex items-center gap-1.5 font-medium"><div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" /> Планирование</div>
            <div className="flex items-center gap-1.5 font-medium"><div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" /> Аудит</div>
            <div className="flex items-center gap-1.5 font-medium"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm" /> Админ</div>
            <div className="flex items-center gap-1.5 font-medium"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" /> Справочники</div>
        </Panel>
      </ReactFlow>

      {/* Data Explorer Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-xl w-full p-0">
          <SheetHeader className="p-6 bg-slate-50 border-b">
            <SheetTitle className="flex items-center gap-3 text-indigo-600 uppercase tracking-tighter">
                <Database className="h-5 w-5" />
                {selectedNode}
            </SheetTitle>
            <SheetDescription className="text-xs">
                Предпросмотр последних 10 записей из базы данных.
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-auto p-4">
            {loadingData ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <RefreshCcw className="animate-spin text-indigo-500" size={32} />
                <span className="text-sm text-slate-500 animate-pulse">Запрос к базе данных...</span>
              </div>
            ) : sampleData.length > 0 ? (
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-[10px] text-left border-collapse bg-white">
                  <thead className="bg-slate-100 sticky top-0">
                    <tr>
                      {Object.keys(sampleData[0]).map(key => (
                        <th key={key} className="px-3 py-2 border-b font-bold text-slate-700 uppercase">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.map((row: any, idx: number) => (
                      <tr key={idx} className="border-b hover:bg-slate-50 transition-colors">
                        {Object.values(row).map((val: any, vIdx: number) => (
                          <td key={vIdx} className="px-3 py-2 text-slate-600 truncate max-w-[150px]">
                            {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-2 border-2 border-dashed rounded-xl">
                    <Database size={40} className="opacity-20" />
                    <span>Данные отсутствуют или таблица пуста</span>
                </div>
            )}
          </div>
          
          <div className="p-4 bg-slate-50 border-t text-[10px] text-slate-500 flex items-center gap-2">
            <ArrowRight size={12} />
            Это демонстрационный просмотр. Для полного анализа используйте раздел отчетов.
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
