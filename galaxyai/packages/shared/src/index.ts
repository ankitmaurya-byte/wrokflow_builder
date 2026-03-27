export type NodeType = 'input' | 'llm' | 'condition' | 'output';

export interface WorkflowNodeData {
  label: string;
  type: NodeType;
  config: Record<string, any>;
}

export interface ExecutionStatus {
  id: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  currentStep?: string;
  result?: any;
}

export interface LogEntry {
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  timestamp: string;
}
