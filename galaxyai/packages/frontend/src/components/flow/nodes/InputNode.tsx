'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { useWorkflowStore, WorkflowState } from '@/store/useWorkflowStore';

const InputNode = ({ id, data, selected }: NodeProps) => {
  const status = useWorkflowStore((state: WorkflowState) => state.executionStatus[id]);

  return (
    <Card className={`w-64 shadow-lg border-2 ${status === 'running' ? 'border-primary animate-pulse' :
      status === 'completed' ? 'border-emerald-500 shadow-emerald-500/20' :
        selected ? 'border-primary' : 'border-border'
      } overflow-hidden transition-all duration-300`}>
      <CardHeader className="p-3 bg-muted/50 flex flex-row items-center gap-2">
        <MessageSquare className="w-4 h-4 text-blue-500" />
        <CardTitle className="text-xs font-semibold">Input Source</CardTitle>
      </CardHeader>
      <CardContent className="p-3 bg-background">
        <div className="text-[10px] text-muted-foreground mb-1 font-medium">LABEL</div>
        <div className="text-sm font-medium">{data.label || 'Text Input'}</div>
      </CardContent>
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-primary border-2 border-background" />
    </Card>
  );
};

export default memo(InputNode);
