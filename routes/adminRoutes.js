const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/project');
const Skill = require('../models/skill');
const PortfolioContent = require('../models/portfolio-content');
const Resume = require('../models/resume');
const CoverLetter = require('../models/cover-letter');

// --- GENERIC GET/UPDATE HELPERS ---

async function getOrCreate(Model, defaultData = {}) {
    let doc = await Model.findOne();
    if (!doc) {
        doc = new Model(defaultData);
        await doc.save();
    }
    return doc;
}

// --- PORTFOLIO CONTENT ---

router.get('/portfolio-content', async (req, res) => {
    try {
        const content = await getOrCreate(PortfolioContent);
        res.json(content);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/portfolio-content', auth, async (req, res) => {
    try {
        let content = await PortfolioContent.findOne();
        if (content) {
            content = await PortfolioContent.findOneAndUpdate({}, { $set: req.body }, { new: true });
        } else {
            content = new PortfolioContent(req.body);
            await content.save();
        }
        res.json(content);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- COVER LETTER ---

router.get('/cover-letter', async (req, res) => {
    try {
        const doc = await getOrCreate(CoverLetter, { content: 'Default cover letter content...' });
        res.json(doc);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/cover-letter', auth, async (req, res) => {
    try {
        let doc = await CoverLetter.findOne();
        if (doc) {
            doc = await CoverLetter.findOneAndUpdate({}, { $set: req.body }, { new: true });
        } else {
            doc = new CoverLetter(req.body);
            await doc.save();
        }
        res.json(doc);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- RESUME ---

router.get('/resume', async (req, res) => {
    try {
        const doc = await getOrCreate(Resume);
        res.json(doc);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/resume', auth, async (req, res) => {
    try {
        let doc = await Resume.findOne();
        if (doc) {
            doc = await Resume.findOneAndUpdate({}, { $set: req.body }, { new: true });
        } else {
            doc = new Resume(req.body);
            await doc.save();
        }
        res.json(doc);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- PROJECTS ---

router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/projects', auth, async (req, res) => {
    try {
        const newProject = new Project(req.body);
        const project = await newProject.save();
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

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

router.delete('/projects/:id', auth, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- SKILLS ---

router.get('/skills', async (req, res) => {
    try {
        const skills = await Skill.find();
        res.json(skills);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/skills', auth, async (req, res) => {
    try {
        const newSkill = new Skill(req.body);
        const skill = await newSkill.save();
        res.json(skill);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

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

router.delete('/skills/:id', auth, async (req, res) => {
    try {
        await Skill.findByIdAndDelete(req.params.id);
        res.json({ message: 'Skill removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
