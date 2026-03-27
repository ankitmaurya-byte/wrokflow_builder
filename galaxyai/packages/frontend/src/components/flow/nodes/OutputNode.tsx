'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal } from 'lucide-react';
import { useWorkflowStore, WorkflowState } from '@/store/useWorkflowStore';

const OutputNode = ({ id, data, selected }: NodeProps) => {
  const status = useWorkflowStore((state: WorkflowState) => state.executionStatus[id]);

  return (
    <Card className={`w-64 shadow-lg border-2 ${status === 'running' ? 'border-emerald-400 animate-pulse' :
      status === 'completed' ? 'border-emerald-500 shadow-emerald-500/20' :
        selected ? 'border-primary' : 'border-border'
      } overflow-hidden transition-all duration-300`}>
      <CardHeader className="p-2 bg-muted/50 flex flex-row items-center gap-2 border-b">
        <Terminal className="w-4 h-4 text-emerald-500" />
        <CardTitle className="text-[11px] font-semibold uppercase tracking-tight">Final Output</CardTitle>
      </CardHeader>
      <CardContent className="p-3 bg-zinc-950 font-mono text-[11px] min-h-20 text-emerald-400">
        {data.result || '> Waiting for execution...'}
      </CardContent>
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-primary border-2 border-background" />
    </Card>
  );
};

export default memo(OutputNode);
