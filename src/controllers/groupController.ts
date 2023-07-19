// groupController.ts

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

interface Group {
  id: string;
  name: string;
}

let groups: Group[] = [];

// Create a new group
export const createGroup = (req: Request, res: Response) => {
  
  const { name } = req.body;
  const group: Group = { id: uuidv4(), name };
  groups.push(group);
  res.status(201).json({ message: 'Group created successfully', group });
};

// Get all groups
export const getGroups = (req: Request, res: Response) => {
  res.status(200).json({ groups });
};
