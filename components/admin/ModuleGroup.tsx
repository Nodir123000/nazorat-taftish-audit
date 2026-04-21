import React from 'react';
import { NodeProps } from '@xyflow/react';

const groupStyles: Record<string, string> = {
  Planning: 'bg-amber-500/5 border-amber-200 text-amber-700',
  Audit: 'bg-rose-500/5 border-rose-200 text-rose-700',
  Admin: 'bg-indigo-500/5 border-indigo-200 text-indigo-700',
  Reference: 'bg-emerald-500/5 border-emerald-200 text-emerald-700',
  Common: 'bg-slate-500/5 border-slate-200 text-slate-700',
};

export function ModuleGroup({ data }: NodeProps) {
  const style = groupStyles[data.label as string] || groupStyles.Common;

  return (
    <div className={`p-4 rounded-3xl border-2 border-dashed ${style} h-full w-full pointer-events-none relative transition-all duration-500`}>
      <div className="absolute -top-3 left-6 px-3 py-0.5 bg-white border border-inherit rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
        {data.label as string}
      </div>
    </div>
  );
}
