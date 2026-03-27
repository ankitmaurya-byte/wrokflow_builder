'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Bot } from 'lucide-react';
import { useWorkflowStore, WorkflowState } from '@/store/useWorkflowStore';

const LLMNode = ({ id, data, selected }: NodeProps) => {
  const status = useWorkflowStore((state: WorkflowState) => state.executionStatus[id]);

  return (
    <Card className={`w-80 shadow-xl border-2 ${status === 'running' ? 'border-purple-500 animate-pulse bg-purple-500/5' :
      status === 'completed' ? 'border-emerald-500 shadow-emerald-500/20' :
        selected ? 'border-primary' : 'border-border'
      } overflow-hidden transition-all duration-300`}>
      <CardHeader className="p-3 bg-muted/50 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-purple-500" />
          <CardTitle className="text-xs font-semibold">Gemini LLM</CardTitle>
        </div>
        <Sparkles className="w-3 h-3 text-yellow-500 animate-pulse" />
      </CardHeader>
      <CardContent className="p-4 bg-background space-y-3">
        <div>
          <div className="text-[10px] text-muted-foreground mb-1 font-medium uppercase tracking-wider">Model</div>
          <div className="text-xs font-mono bg-muted p-1 rounded border overflow-hidden truncate">
            {data.config?.model || 'gemini-pro-1.5'}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground mb-1 font-medium uppercase tracking-wider">Prompt</div>
          <div className="text-[11px] text-foreground line-clamp-3 italic opacity-80">
            {data.config?.prompt || 'Ready to analyze...'}
          </div>
        </div>
      </CardContent>
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-primary border-2 border-background -left-1.5" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-primary border-2 border-background -right-1.5" />
    </Card>
  );
};

export default memo(LLMNode);
