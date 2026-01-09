const express = require('express');
const router = express.Router();
const Tesseract = require('tesseract.js');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const xml2js = require('xml2js');
const { getDb } = require('../database/db');

// Reference ranges for medical values
const referenceRanges = {
    hemoglobin: { min: 12.0, max: 17.5, unit: 'g/dL', name: 'Hemoglobin' },
    hematocrit: { min: 36, max: 50, unit: '%', name: 'Hematocrit' },
    wbc: { min: 4000, max: 11000, unit: 'cells/mcL', name: 'White Blood Cells' },
    rbc: { min: 4.2, max: 5.9, unit: 'million/mcL', name: 'Red Blood Cells' },
    platelets: { min: 150000, max: 400000, unit: 'cells/mcL', name: 'Platelets' },
    glucose: { min: 70, max: 100, unit: 'mg/dL', name: 'Fasting Glucose' },
    cholesterol: { min: 0, max: 200, unit: 'mg/dL', name: 'Total Cholesterol' },
    creatinine: { min: 0.7, max: 1.3, unit: 'mg/dL', name: 'Creatinine' },
    sodium: { min: 136, max: 145, unit: 'mEq/L', name: 'Sodium' },
    potassium: { min: 3.5, max: 5.0, unit: 'mEq/L', name: 'Potassium' }
};

// Extract text from image using OCR
async function extractFromImage(filePath) {
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
    return text;
}

// Extract text from PDF
async function extractFromPDF(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
}

// Extract from CSV
function extractFromCSV(filePath) {
    return fs.readFileSync(filePath, 'utf-8');
}

// Extract from XML
async function extractFromXML(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(content);
    return JSON.stringify(result, null, 2);
}

// Parse extracted data
function parseExtractedData(text, reportType) {
    const extractedData = [];
    const lines = text.split('\n');

    const pattern = /(\w+[\w\s]*?)[\s:]+(\d+\.?\d*)\s*(mg\/dl|g\/dl|%|mmol\/l|u\/l|cells\/mcl|million\/mcl|meq\/l)?/gi;

    for (const line of lines) {
        const matches = [...line.matchAll(pattern)];
        for (const match of matches) {
            const testName = match[1]?.trim();
            const value = parseFloat(match[2]);
            const unit = match[3] || '';

            if (testName && !isNaN(value) && testName.length < 50) {
                const normalizedName = testName.toLowerCase().replace(/\s+/g, '');
                const reference = Object.entries(referenceRanges).find(([key]) => normalizedName.includes(key));

                let status = 'normal';
                let referenceRange = '';

                if (reference) {
                    const [, range] = reference;
                    referenceRange = `${range.min} - ${range.max} ${range.unit}`;
                    if (value < range.min) status = 'low';
                    else if (value > range.max) status = 'high';
                }

                extractedData.push({ name: testName, value, unit, status, referenceRange });
            }
        }
    }

    if (extractedData.length === 0 && text.length > 0) {
        if (['xray', 'mri', 'ctscan'].includes(reportType)) {
            const findings = text.split('\n').filter(l => l.trim()).slice(0, 20);
            return { type: 'imaging', findings, rawText: text };
        }
        return { type: 'unstructured', rawText: text };
    }

    return { type: 'structured', data: extractedData, rawText: text };
}

// Generate explanations
function generateExplanation(extractedData, reportType, mode, language) {
    const isPatient = mode === 'patient';
    const disclaimer = language === 'tamil' ?
        '⚠️ மருத்துவ மறுப்பு: இது கல்வி நோக்கங்களுக்காக மட்டுமே. மருத்துவரை அணுகவும்.' :
        language === 'hindi' ?
            '⚠️ चिकित्सा अस्वीकरण: यह केवल शैक्षिक उद्देश्यों के लिए है। डॉक्टर से परामर्श करें।' :
            '⚠️ MEDICAL DISCLAIMER: This is for educational purposes only. Always consult a healthcare professional.';

    let shortExplanation = disclaimer + '\n\n';
    let longExplanation = disclaimer + '\n\n';

    if (extractedData.type === 'structured' && extractedData.data?.length > 0) {
        const abnormal = extractedData.data.filter(d => d.status !== 'normal');

        if (isPatient) {
            shortExplanation += '📋 **Your Test Results Summary**\n\n';
            if (abnormal.length === 0) {
                shortExplanation += '✅ Good news! All values are within normal range.\n';
            } else {
                shortExplanation += '⚠️ Some values need attention:\n\n';
                abnormal.forEach(item => {
                    shortExplanation += `• **${item.name}**: ${item.status === 'high' ? 'Higher' : 'Lower'} than normal\n`;
                });
                shortExplanation += '\n💡 Please discuss these with your doctor.';
            }

            longExplanation += '📋 **Detailed Analysis**\n\n';
            extractedData.data.forEach(item => {
                const statusText = item.status === 'normal' ? '✅ Normal' : item.status === 'high' ? '⚠️ High' : '⚠️ Low';
                longExplanation += `**${item.name}**: ${item.value} ${item.unit}\n- Status: ${statusText}\n- Reference: ${item.referenceRange || 'N/A'}\n\n`;
            });
            longExplanation += '\n### Questions for Your Doctor:\n• What do these results mean?\n• Do I need follow-up tests?\n• Should I make lifestyle changes?';
        } else {
            shortExplanation += '📊 **Clinical Summary**\n\n';
            if (abnormal.length === 0) {
                shortExplanation += 'All parameters within reference ranges.\n';
            } else {
                shortExplanation += '🔴 **Abnormal Values:**\n';
                abnormal.forEach(item => {
                    shortExplanation += `• ${item.name}: ${item.value} ${item.unit} (${item.status.toUpperCase()}) - Ref: ${item.referenceRange}\n`;
                });
            }

            longExplanation += '📊 **Complete Panel Analysis**\n\n| Parameter | Value | Unit | Status | Reference |\n|---|---|---|---|---|\n';
            extractedData.data.forEach(item => {
                longExplanation += `| ${item.name} | ${item.value} | ${item.unit} | ${item.status.toUpperCase()} | ${item.referenceRange} |\n`;
            });
            longExplanation += '\n**Note**: Clinical correlation required. This automated analysis is based solely on extracted data.';
        }
    } else if (extractedData.type === 'imaging') {
        shortExplanation += `📷 **Imaging Report Summary**\n\nKey findings:\n${extractedData.findings.slice(0, 5).map(f => `• ${f}`).join('\n')}\n\n💡 Discuss with your doctor.`;
        longExplanation += `📷 **Detailed Imaging Findings**\n\n${extractedData.findings.map(f => `• ${f}`).join('\n')}\n\n**Note**: Full interpretation requires radiologist review.`;
    } else {
        shortExplanation += `📄 **Report Summary**\n\nExtracted content preview:\n${extractedData.rawText?.substring(0, 300)}...`;
        longExplanation += `📄 **Full Extracted Content**\n\n${extractedData.rawText}`;
    }

    return { shortExplanation, longExplanation };
}

// Analyze report endpoint
router.post('/analyze/:reportId', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        const { reportId } = req.params;
        const { mode = 'patient', language = 'english' } = req.body;
        const db = getDb();

        const report = db.prepare('SELECT * FROM reports WHERE id = ? AND user_id = ?').get(reportId, req.session.userId);
        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        let extractedText = '';
        const fileType = report.file_type.toLowerCase();

        try {
            if (['jpg', 'jpeg', 'png'].includes(fileType)) {
                extractedText = await extractFromImage(report.file_path);
            } else if (fileType === 'pdf') {
                extractedText = await extractFromPDF(report.file_path);
            } else if (fileType === 'csv') {
                extractedText = extractFromCSV(report.file_path);
            } else if (fileType === 'xml') {
                extractedText = await extractFromXML(report.file_path);
            }
        } catch (err) {
            console.error('Extraction error:', err);
        }

        if (!extractedText?.trim()) {
            return res.status(400).json({ success: false, message: 'Unable to extract text from file' });
        }

        const extractedData = parseExtractedData(extractedText, report.report_type);
        const { shortExplanation, longExplanation } = generateExplanation(extractedData, report.report_type, mode, language);

        db.prepare(`UPDATE reports SET extracted_text = ?, extracted_data = ?, short_explanation = ?, long_explanation = ?, status = 'analyzed' WHERE id = ?`).run(extractedText, JSON.stringify(extractedData), shortExplanation, longExplanation, reportId);

        res.json({ success: true, message: 'Analysis complete', data: { extractedData, shortExplanation, longExplanation, rawText: extractedText } });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ success: false, message: 'Failed to analyze report' });
    }
});

// Get analysis results
router.get('/results/:reportId', (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        const db = getDb();
        const report = db.prepare(`SELECT id, file_name, report_type, extracted_text, extracted_data, short_explanation, long_explanation, status, created_at FROM reports WHERE id = ? AND user_id = ?`).get(req.params.reportId, req.session.userId);
        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }
        res.json({ success: true, report: { ...report, extractedData: report.extracted_data ? JSON.parse(report.extracted_data) : null } });
    } catch (error) {
        console.error('Get results error:', error);
        res.status(500).json({ success: false, message: 'Failed to get results' });
    }
});

module.exports = router;
