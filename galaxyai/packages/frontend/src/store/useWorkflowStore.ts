import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange
} from 'reactflow';

export interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  executionStatus: Record<string, 'pending' | 'running' | 'completed' | 'failed'>;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  setNodeStatus: (nodeId: string, status: 'pending' | 'running' | 'completed' | 'failed') => void;
  resetExecution: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  executionStatus: {},
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  addNode: (node: Node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  updateNodeData: (nodeId: string, data: any) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }),
    });
  },
  setNodeStatus: (nodeId: string, status: 'pending' | 'running' | 'completed' | 'failed') => {
    set({
      executionStatus: {
        ...get().executionStatus,
        [nodeId]: status,
      },
    });
  },
  resetExecution: () => {
    set({ executionStatus: {} });
  },
}));
