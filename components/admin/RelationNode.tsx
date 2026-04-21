import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Key, Link, Database, TableProperties } from 'lucide-react';

interface RelationNodeProps {
  data: {
    label: string,
    fields: { name: string, type: string, isId?: boolean, isOptional?: boolean }[],
    module?: string,
    selected?: boolean
  }
}

const moduleColors: Record<string, string> = {
  Planning: 'border-amber-500 bg-amber-50',
  Audit: 'border-rose-500 bg-rose-50',
  Admin: 'border-indigo-500 bg-indigo-50',
  Reference: 'border-emerald-500 bg-emerald-50',
  Common: 'border-sky-500 bg-sky-50',
};

const headerColors: Record<string, string> = {
  Planning: 'bg-amber-500',
  Audit: 'bg-rose-500',
  Admin: 'bg-indigo-500',
  Reference: 'bg-emerald-500',
  Common: 'bg-sky-500',
};

export function RelationNode({ data }: RelationNodeProps) {
  const moduleColor = moduleColors[data.module || 'Common'];
  const headerColor = headerColors[data.module || 'Common'];

  return (
    <div className={`shadow-xl rounded-lg bg-white border-2 ${moduleColor.split(' ')[0]} min-w-[240px] text-[11px] font-sans overflow-hidden transition-all duration-300 ${
        data.selected 
        ? 'ring-4 ring-indigo-500/30 scale-105 shadow-indigo-200/50' 
        : 'hover:shadow-2xl hover:scale-[1.02]'
    }`}>
      <div className={`flex items-center justify-between px-3 py-2 ${headerColor} text-white shadow-sm`}>
        <div className="flex items-center gap-2">
          {data.selected ? <Database size={14} className="animate-pulse" /> : <TableProperties size={14} className="opacity-80" />}
          <div className="font-bold uppercase tracking-tight">{data.label}</div>
        </div>
        <div className="text-[9px] opacity-70 font-mono">{data.module || 'DB'}</div>
      </div>
      
      <div className="p-3 space-y-1.5 bg-white/80 backdrop-blur-sm">
        {data.fields.map((field, idx) => (
          <div key={idx} className="flex items-center justify-between group">
            <div className={`flex items-center gap-1.5 ${field.isId ? 'text-blue-700 font-bold' : 'text-slate-700'}`}>
              {field.isId ? (
                <Key size={10} className="text-amber-500" />
              ) : (
                <div className="w-2.5" />
              )}
              <span className="group-hover:text-blue-600 transition-colors">{field.name}</span>
              {field.isOptional && <span className="text-[9px] text-slate-400">?</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 rounded border border-slate-200/50">
                {field.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="h-1 w-full opacity-20 bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>

      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-slate-400/50 border-2 border-white shadow-sm" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-slate-400/50 border-2 border-white shadow-sm" />
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-slate-400/50 border-2 border-white shadow-sm" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-slate-400/50 border-2 border-white shadow-sm" />
    </div>
  );
}
