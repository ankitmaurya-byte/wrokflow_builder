import { io } from '../index.js';
import { GeminiService } from '../services/gemini.service.js';
import { prisma } from '../services/prisma.service.js';

interface Node {
  id: string;
  type: string;
  data: any;
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

export class WorkflowEngine {
  private nodes: Node[];
  private edges: Edge[];
  private executionId: string;
  private results: Record<string, any> = {};

  constructor(executionId: string, nodes: Node[], edges: Edge[]) {
    this.executionId = executionId;
    this.nodes = nodes;
    this.edges = edges;
  }

  async execute() {
    try {
      this.emit('workflow:start', { executionId: this.executionId });

      // Basic topological sort / layer execution for simplicity
      // In a production engine, we'd use a proper DAG scheduler
      const visited = new Set<string>();
      const queue = this.nodes.filter(n => !this.edges.some(e => e.target === n.id));

      while (queue.length > 0) {
        const node = queue.shift()!;
        if (visited.has(node.id)) continue;

        await this.executeNode(node);
        visited.add(node.id);

        // Find next nodes
        const nextEdges = this.edges.filter(e => e.source === node.id);
        for (const edge of nextEdges) {
          const nextNode = this.nodes.find(n => n.id === edge.target);
          if (nextNode) queue.push(nextNode);
        }
      }

      await prisma.execution.update({
        where: { id: this.executionId },
        data: { status: 'COMPLETED', result: this.results, finishedAt: new Date() },
      });

      this.emit('workflow:completed', { executionId: this.executionId, results: this.results });
    } catch (error: any) {
      console.error('Workflow Execution Failed:', error);
      await prisma.execution.update({
        where: { id: this.executionId },
        data: { status: 'FAILED', finishedAt: new Date() },
      });
      this.emit('workflow:failed', { executionId: this.executionId, error: error.message });
    }
  }

  private async executeNode(node: Node) {
    this.emit('node:executing', { nodeId: node.id });

    let result: any;

    switch (node.type) {
      case 'input':
        result = node.data.label || 'Input Value';
        break;

      case 'llm':
        const gemini = new GeminiService(node.data.config?.model);
        // Get input from incoming edges
        const inputs = this.edges
          .filter(e => e.target === node.id)
          .map(e => this.results[e.source]);

        const prompt = `${node.data.config?.prompt}\n\nContext:\n${inputs.join('\n')}`;
        result = await gemini.generate(prompt, node.data.config);
        break;

      case 'output':
        const finalInputs = this.edges
          .filter(e => e.target === node.id)
          .map(e => this.results[e.source]);
        result = finalInputs.join('\n');
        break;

      default:
        result = `Skipped unknown node type: ${node.type}`;
    }

    this.results[node.id] = result;
    this.emit('node:completed', { nodeId: node.id, result });

    // Log to DB
    await prisma.log.create({
      data: {
        executionId: this.executionId,
        level: 'INFO',
        message: `Node ${node.id} (${node.type}) completed.`,
      }
    });
  }

  private emit(event: string, data: any) {
    io.to(`execution:${this.executionId}`).emit(event, data);
    console.log(`[Socket] ${event}:`, data);
  }
}
