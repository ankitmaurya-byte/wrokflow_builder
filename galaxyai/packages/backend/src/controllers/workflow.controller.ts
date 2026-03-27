import { Request, Response } from 'express';
import { prisma } from '../services/prisma.service.js';

export const listWorkflows = async (req: Request, res: Response) => {
  try {
    const workflows = await prisma.workflow.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    res.json(workflows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workflows' });
  }
};

export const saveWorkflow = async (req: Request, res: Response) => {
  try {
    const { name, nodes, edges } = req.body;
    const workflow = await prisma.workflow.create({
      data: { name, nodes, edges },
    });
    res.json(workflow);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save workflow' });
  }
};

export const getWorkflow = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const workflow = await prisma.workflow.findUnique({
      where: { id },
    });
    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });
    res.json(workflow);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workflow' });
  }
};

import { WorkflowEngine } from '../engine/WorkflowEngine.js';

export const runWorkflow = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const workflow = await prisma.workflow.findUnique({
      where: { id },
    });

    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });

    // Create execution record
    const execution = await prisma.execution.create({
      data: {
        workflowId: id,
        status: 'RUNNING',
      },
    });

    // Start engine asynchronously
    const engine = new WorkflowEngine(
      execution.id,
      workflow.nodes as any,
      workflow.edges as any
    );

    // Don't await - run in background
    engine.execute().catch(err => console.error('Engine error:', err));

    res.json({
      message: 'Workflow execution started',
      executionId: execution.id
    });
  } catch (error) {
    console.error('Run Error:', error);
    res.status(500).json({ error: 'Failed to start execution' });
  }
};
