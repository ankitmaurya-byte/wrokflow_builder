import { Router } from 'express';
import * as workflowController from '../controllers/workflow.controller.js';

const router = Router();

router.get('/', workflowController.listWorkflows);
router.post('/', workflowController.saveWorkflow);
router.get('/:id', workflowController.getWorkflow);
router.post('/:id/run', workflowController.runWorkflow);

export { router as workflowRouter };
