const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/project');
const Skill = require('../models/skill');


// --- PROJECTS ---

// Get all projects (Public)
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add a project (Protected)
router.post('/projects', auth, async (req, res) => {
    try {
        const newProject = new Project(req.body);
        const project = await newProject.save();
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update a project (Protected)
router.put('/projects/:id', auth, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete a project (Protected)
router.delete('/projects/:id', auth, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- SKILLS ---

// Get all skills (Public)
router.get('/skills', async (req, res) => {
    try {
        const skills = await Skill.find();
        res.json(skills);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add a skill (Protected)
router.post('/skills', auth, async (req, res) => {
    try {
        const newSkill = new Skill(req.body);
        const skill = await newSkill.save();
        res.json(skill);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update a skill (Protected)
router.put('/skills/:id', auth, async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(skill);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete a skill (Protected)
router.delete('/skills/:id', auth, async (req, res) => {
    try {
        await Skill.findByIdAndDelete(req.params.id);
        res.json({ message: 'Skill removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
