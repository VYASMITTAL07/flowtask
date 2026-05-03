const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All task routes require auth
router.use(protect);

// GET /api/tasks  - get all tasks for projects user belongs to
router.get('/', async (req, res) => {
  try {
    const { status, priority, project, assignee, overdue } = req.query;

    // Find projects user is a member of
    const userProjects = await Project.find({ members: req.user._id }).select('_id');
    const projectIds = userProjects.map(p => p._id);

    const filter = { project: { $in: projectIds } };

    if (status)   filter.status   = status;
    if (priority) filter.priority = priority;
    if (project)  filter.project  = project;
    if (assignee) filter.assignee = assignee;
    if (overdue === 'true') {
      filter.dueDate = { $lt: new Date() };
      filter.status = { $ne: 'done' };
    }

    const tasks = await Task.find(filter)
      .populate('assignee', 'name email avatar')
      .populate('project', 'name color')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email avatar')
      .populate('project', 'name color members')
      .populate('createdBy', 'name');

    if (!task) return res.status(404).json({ error: 'Task not found.' });

    res.json({ task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project, assignee, tags } = req.body;

    if (!title || !project) {
      return res.status(400).json({ error: 'Title and project are required.' });
    }

    // Check user is a member of the project
    const proj = await Project.findOne({ _id: project, members: req.user._id });
    if (!proj) return res.status(403).json({ error: 'Not a member of this project.' });

    const task = await Task.create({
      title, description, status, priority, dueDate, project, assignee, tags,
      createdBy: req.user._id
    });

    await task.populate('assignee', 'name email avatar');
    await task.populate('project', 'name color');

    res.status(201).json({ task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/tasks/:id
router.patch('/:id', async (req, res) => {
  try {
    const allowed = ['title', 'description', 'status', 'priority', 'dueDate', 'assignee', 'tags'];
    const updates = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    })
      .populate('assignee', 'name email avatar')
      .populate('project', 'name color');

    if (!task) return res.status(404).json({ error: 'Task not found.' });

    res.json({ task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found.' });

    // Only creator or admin can delete
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not allowed to delete this task.' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
