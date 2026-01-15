const University = require('../models/University');

exports.createUniversity = async (req, res) => {
    try {
        const { name, description, logoUrl } = req.body;
        const newUniversity = new University({ name, description, logoUrl });
        await newUniversity.save();
        res.status(201).json(newUniversity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUniversities = async (req, res) => {
    try {
        const universities = await University.find();
        res.status(200).json(universities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUniversity = async (req, res) => {
    try {
        const { id } = req.params;
        const university = await University.findByIdAndDelete(id);
        if (!university) return res.status(404).json({ message: 'University not found' });

        // Optional: Delete associated materials
        const Material = require('../models/Material');
        await Material.deleteMany({ university: id });

        res.status(200).json({ message: 'University and associated materials deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
