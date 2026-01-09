const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/db');

// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.csv', '.xml', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowedExtensions.includes(ext));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// Upload report
router.post('/', upload.single('report'), async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const { reportType } = req.body;
        if (!reportType || !['xray', 'mri', 'ctscan', 'bloodtest', 'labtest', 'handwritten'].includes(reportType)) {
            return res.status(400).json({ success: false, message: 'Valid report type is required' });
        }

        const db = getDb();
        const reportId = uuidv4();
        const fileType = path.extname(req.file.originalname).toLowerCase().replace('.', '');

        db.prepare(`INSERT INTO reports (id, user_id, file_name, file_type, report_type, file_path, status) VALUES (?, ?, ?, ?, ?, ?, 'uploaded')`).run(reportId, req.session.userId, req.file.originalname, fileType, reportType, req.file.path);

        res.json({ success: true, message: 'File uploaded successfully', reportId, fileName: req.file.originalname, fileType, reportType });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: 'File upload failed' });
    }
});

// Get user's reports
router.get('/reports', (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        const db = getDb();
        const reports = db.prepare(`SELECT id, file_name, file_type, report_type, status, created_at FROM reports WHERE user_id = ? ORDER BY created_at DESC`).all(req.session.userId);
        res.json({ success: true, reports });
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ success: false, message: 'Failed to get reports' });
    }
});

// Get single report
router.get('/reports/:id', (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        const db = getDb();
        const report = db.prepare(`SELECT * FROM reports WHERE id = ? AND user_id = ?`).get(req.params.id, req.session.userId);
        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }
        res.json({ success: true, report });
    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({ success: false, message: 'Failed to get report' });
    }
});

// Delete report
router.delete('/reports/:id', (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        const db = getDb();
        const report = db.prepare('SELECT file_path FROM reports WHERE id = ? AND user_id = ?').get(req.params.id, req.session.userId);
        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }
        if (fs.existsSync(report.file_path)) fs.unlinkSync(report.file_path);
        db.prepare('DELETE FROM reports WHERE id = ?').run(req.params.id);
        res.json({ success: true, message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Delete report error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete report' });
    }
});

module.exports = router;
