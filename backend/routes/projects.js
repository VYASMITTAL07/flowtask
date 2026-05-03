const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user._id })
      .populate('members', 'name email avatar')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    // Attach task stats per project
    const projectsWithStats = await Promise.all(projects.map(async (p) => {
      const tasks = await Task.find({ project: p._id });
      const done = tasks.filter(t => t.status === 'done').length;
      const total = tasks.length;
      const progress = total > 0 ? Math.round((done / total) * 100) : 0;
      return { ...p.toJSON(), progress, taskCount: total, completedCount: done };
    }));

    res.json({ projects: projectsWithStats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email avatar role')
      .populate('owner', 'name email');

    if (!project) return res.status(404).json({ error: 'Project not found.' });

    const isMember = project.members.some(m => m._id.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ error: 'Not a member of this project.' });

    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects
router.post('/', async (req, res) => {
  try {
    const { name, description, color } = req.body;

    if (!name) return res.status(400).json({ error: 'Project name is required.' });

    const project = await Project.create({
      name, description, color,
      owner: req.user._id,
      members: [req.user._id]
    });

    await project.populate('members', 'name email avatar');
    res.status(201).json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/projects/:id
router.patch('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found.' });

    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only project owner can update it.' });
    }

    const allowed = ['name', 'description', 'color', 'status'];
    allowed.forEach(f => { if (req.body[f] !== undefined) project[f] = req.body[f]; });

    await project.save();
    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects/:id/members  - add member
router.post('/:id/members', async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ error: 'Project not found.' });
    if (req.user.role !== 'admin' && project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only owner or admin can add members.' });
    }

    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }

    await project.populate('members', 'name email avatar');
    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found.' });

    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only owner or admin can delete this project.' });
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ message: 'Project and its tasks deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
