'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Bot, Terminal, GitBranch, Plus } from 'lucide-react';

const nodeTypes = [
  { type: 'input', label: 'Input Prompt', icon: MessageSquare, color: 'text-blue-500' },
  { type: 'llm', label: 'Gemini LLM', icon: Bot, color: 'text-purple-500' },
  { type: 'condition', label: 'Condition', icon: GitBranch, color: 'text-orange-500' },
  { type: 'output', label: 'Final Output', icon: Terminal, color: 'text-emerald-500' },
];

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 border-r bg-muted/30 p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wider opacity-60">Nodes Library</h2>
        <Plus className="w-4 h-4 opacity-40" />
      </div>
      <div className="grid gap-3">
        {nodeTypes.map((node) => (
          <Card
            key={node.type}
            className="cursor-grab hover:ring-2 hover:ring-primary/30 transition-all border-dashed"
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
          >
            <CardContent className="p-3 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-background border ${node.color}`}>
                <node.icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold">{node.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
