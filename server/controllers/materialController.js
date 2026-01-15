const Material = require('../models/Material');

exports.createMaterial = async (req, res) => {
    try {
        console.log('Received Body:', req.body);

        const { title, type, university, course, year, semester, subject, link } = req.body;

        if (!link) {
            return res.status(400).json({ message: 'Resource link is required' });
        }

        const newMaterial = new Material({
            title,
            type,
            link,
            university,
            course,
            year,
            semester,
            subject
        });

        await newMaterial.save();
        console.log('Material Saved:', newMaterial);
        res.status(201).json(newMaterial);
    } catch (error) {
        console.error('Create Material Error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getMaterials = async (req, res) => {
    try {
        const { universityId, course, year, semester, subject } = req.query;
        let query = {};
        if (universityId) query.university = universityId;
        if (course) query.course = course;
        if (year) query.year = year;
        if (semester) query.semester = semester;
        if (subject) query.subject = subject;

        const materials = await Material.find(query).populate('university');
        res.status(200).json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Material.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Material not found' });
        res.status(200).json({ message: 'Material deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
