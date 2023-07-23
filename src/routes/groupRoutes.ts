// groupRoutes.ts

import express from 'express';
import { createGroup, deleteGroup, getGroups } from '../controllers/groupController';

const router = express.Router();

// Create a new group
router.post('/groups', createGroup);

// Get all groups
router.get('/groups', getGroups);
router.delete('/groups/:groupId',deleteGroup)

export default router;
