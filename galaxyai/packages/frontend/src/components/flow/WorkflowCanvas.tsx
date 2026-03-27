'use client';

import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import InputNode from './nodes/InputNode';
import LLMNode from './nodes/LLMNode';
import OutputNode from './nodes/OutputNode';
import Sidebar from './Sidebar';
import NodeConfigPanel from './NodeConfigPanel';
import { Button } from '@/components/ui/button';
import { Play, Save, Download } from 'lucide-react';

const nodeTypes = {
  input: InputNode,
  llm: LLMNode,
  output: OutputNode,
};

import { useExecution } from '@/hooks/useExecution';

const Flow = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode
  } = useWorkflowStore();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const reactFlowInstance = useReactFlow();
  const { isRunning, runWorkflow, saveWorkflow } = useExecution();

  const handleSave = async () => {
    const data = await saveWorkflow('My Workflow', nodes, edges);
    if (data?.id) setWorkflowId(data.id);
  };

  const handleRun = async () => {
    if (!workflowId) {
      const data = await saveWorkflow('My Workflow', nodes, edges);
      if (data?.id) {
        setWorkflowId(data.id);
        runWorkflow(data.id);
      }
    } else {
      runWorkflow(workflowId);
    }
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type} Node`, config: {} },
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 relative h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
          snapToGrid
          className="bg-dot-pattern"
        >
          <Background color="#333" gap={20} />
          <Controls />
          <MiniMap
            style={{ backgroundColor: 'hsl(var(--background))' }}
            maskColor="hsla(var(--background), 0.7)"
          />
          <Panel position="top-right" className="flex gap-2 p-2 bg-background/50 backdrop-blur rounded-lg border shadow-xl">
            <Button variant="outline" size="sm" className="gap-2 border-zinc-800 hover:bg-zinc-800">
              <Download className="w-4 h-4" /> Export
            </Button>
            <Button onClick={handleSave} variant="outline" size="sm" className="gap-2 border-zinc-800 hover:bg-zinc-800">
              <Save className="w-4 h-4" /> Save
            </Button>
            <Button onClick={handleRun} disabled={isRunning} size="sm" className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Running...' : 'Run Workflow'}
            </Button>
          </Panel>
        </ReactFlow>
      </div>
      {selectedNodeId && <NodeConfigPanel nodeId={selectedNodeId} />}
    </div>
  );
};

const WorkflowCanvas = () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);

export default WorkflowCanvas;
