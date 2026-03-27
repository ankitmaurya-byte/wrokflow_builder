'use client';

import React, { useState, useEffect } from 'react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const NodeConfigPanel = ({ nodeId }: { nodeId: string }) => {
  const { nodes, updateNodeData } = useWorkflowStore();
  const node = nodes.find((n) => n.id === nodeId);

  if (!node) return null;

  const handleConfigChange = (key: string, value: any) => {
    updateNodeData(nodeId, {
      config: {
        ...(node.data.config || {}),
        [key]: value,
      },
    });
  };

  return (
    <Card className="w-80 h-full border-l rounded-none bg-muted/20">
      <CardHeader className="p-4 flex flex-row items-center justify-between bg-muted/40">
        <CardTitle className="text-sm font-bold truncate">Update {node.type?.toUpperCase()}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-4 space-y-6">
        {node.type === 'input' && (
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-wider">Display Label</Label>
            <Input
              value={node.data.label || ''}
              onChange={(e) => updateNodeData(nodeId, { label: e.target.value })}
              className="h-8 text-xs"
            />
          </div>
        )}

        {node.type === 'llm' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-wider">AI Model</Label>
              <Select
                onValueChange={(v) => handleConfigChange('model', v)}
                defaultValue={node.data.config?.model || 'gemini-1.5-pro'}
              >
                <SelectTrigger className="h-8 text-[11px] font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                  <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                  <SelectItem value="gemini-1.0-pro">Gemini 1.0 Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-wider">System Prompt</Label>
              <textarea
                className="w-full min-h-[120px] bg-background border rounded-md p-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                value={node.data.config?.prompt || ''}
                onChange={(e) => handleConfigChange('prompt', e.target.value)}
                placeholder="Analyze the incoming data and..."
              />
            </div>
          </div>
        )}

        <div className="pt-4">
          <div className="text-[9px] text-muted-foreground italic">
            Node ID: {node.id}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NodeConfigPanel;
