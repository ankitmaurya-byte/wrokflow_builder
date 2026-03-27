'use client';

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useWorkflowStore, WorkflowState } from '@/store/useWorkflowStore';
import { toast } from 'sonner';

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export const useExecution = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const { setNodeStatus, updateNodeData, resetExecution } = useWorkflowStore();

  useEffect(() => {
    const s: Socket = io(SOCKET_URL);

    s.on('connect', () => console.log('Connected to backend socket'));

    s.on('workflow:start', (data: { executionId: string }) => {
      setIsRunning(true);
      resetExecution();
      toast.info('Workflow execution started');
    });

    s.on('node:executing', (data: { nodeId: string }) => {
      setNodeStatus(data.nodeId, 'running');
    });

    s.on('node:completed', (data: { nodeId: string, result: any }) => {
      setNodeStatus(data.nodeId, 'completed');
      updateNodeData(data.nodeId, { result: data.result });
    });

    s.on('workflow:completed', (data: any) => {
      setIsRunning(false);
      toast.success('Workflow completed successfully!');
    });

    s.on('workflow:failed', (data: { error: string }) => {
      setIsRunning(false);
      toast.error(`Workflow failed: ${data.error}`);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [setNodeStatus, updateNodeData, resetExecution]);

  const runWorkflow = useCallback(async (workflowId: string) => {
    try {
      if (!socket) return;

      const response = await fetch(`${SOCKET_URL}/api/workflows/${workflowId}/run`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.executionId) {
        socket.emit('join-execution', data.executionId);
      }
    } catch (error) {
      console.error('Run Error:', error);
      toast.error('Failed to start execution');
    }
  }, [socket]);

  const saveWorkflow = useCallback(async (name: string, nodes: any[], edges: any[]) => {
    try {
      const response = await fetch(`${SOCKET_URL}/api/workflows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, nodes, edges }),
      });
      const data = await response.json();
      toast.success('Workflow saved');
      return data;
    } catch (error) {
      toast.error('Failed to save workflow');
    }
  }, []);

  return { isRunning, runWorkflow, saveWorkflow };
};
