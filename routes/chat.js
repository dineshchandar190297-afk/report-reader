const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/db');

// Generate chat response based on report context
function generateResponse(message, reportContext, language) {
    const msgLower = message.toLowerCase();
    const extractedData = reportContext.extractedData ? JSON.parse(reportContext.extractedData) : null;
    const extractedText = reportContext.extractedText || '';

    const disclaimer = '\n\n⚠️ *This is based only on your uploaded report. Consult a healthcare professional for advice.*';

    // Greeting
    if (msgLower.includes('hello') || msgLower.includes('hi') || msgLower.includes('hey')) {
        return "Hello! I'm ready to help you understand your report. Ask me about any values, findings, or terms!" + disclaimer;
    }

    // Questions about specific values
    if (extractedData?.type === 'structured' && extractedData.data) {
        for (const item of extractedData.data) {
            if (msgLower.includes(item.name.toLowerCase())) {
                const statusText = item.status === 'normal' ? 'within normal range' :
                    item.status === 'high' ? 'higher than normal' : 'lower than normal';
                return `**${item.name}** shows a value of **${item.value} ${item.unit}**. This is ${statusText}. Reference range: ${item.referenceRange || 'Not specified'}.` + disclaimer;
            }
        }
    }

    // General report questions
    if (msgLower.includes('report') || msgLower.includes('result') || msgLower.includes('finding')) {
        let response = '📋 **Your Report Summary:**\n\n';
        if (extractedData?.type === 'structured' && extractedData.data) {
            extractedData.data.forEach(item => {
                response += `• **${item.name}**: ${item.value} ${item.unit} (${item.status})\n`;
            });
        } else if (extractedData?.type === 'imaging' && extractedData.findings) {
            extractedData.findings.slice(0, 5).forEach(f => { response += `• ${f}\n`; });
        } else {
            response += extractedText.substring(0, 400) + '...';
        }
        return response + disclaimer;
    }

    // Abnormal values
    if (msgLower.includes('abnormal') || msgLower.includes('concern') || msgLower.includes('worry') || msgLower.includes('high') || msgLower.includes('low')) {
        if (extractedData?.type === 'structured' && extractedData.data) {
            const abnormal = extractedData.data.filter(d => d.status !== 'normal');
            if (abnormal.length > 0) {
                let response = '⚠️ **Values outside normal range:**\n\n';
                abnormal.forEach(item => {
                    response += `• **${item.name}**: ${item.value} ${item.unit} (${item.status})\n`;
                });
                return response + '\nPlease discuss these with your doctor.' + disclaimer;
            }
            return '✅ All values in your report appear to be within normal ranges.' + disclaimer;
        }
    }

    // Search in report text
    const words = msgLower.split(' ').filter(w => w.length > 3);
    if (words.some(w => extractedText.toLowerCase().includes(w))) {
        const idx = extractedText.toLowerCase().indexOf(words.find(w => extractedText.toLowerCase().includes(w)));
        const snippet = extractedText.substring(Math.max(0, idx - 50), idx + 150);
        return `Found in your report:\n\n"${snippet.trim()}"\n\nWould you like more details?` + disclaimer;
    }

    return "I couldn't find specific information about that in your report. Please ask about values or terms from your uploaded report." + disclaimer;
}

// Chat endpoint
router.post('/:reportId', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        const { reportId } = req.params;
        const { message, language = 'english' } = req.body;

        if (!message?.trim()) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        const db = getDb();
        const report = db.prepare(`SELECT extracted_text, extracted_data FROM reports WHERE id = ? AND user_id = ?`).get(reportId, req.session.userId);

        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        if (!report.extracted_text) {
            return res.status(400).json({ success: false, message: 'Report has not been analyzed yet' });
        }

        const response = generateResponse(message, { extractedText: report.extracted_text, extractedData: report.extracted_data }, language);

        db.prepare(`INSERT INTO chat_messages (id, report_id, user_id, message, response) VALUES (?, ?, ?, ?, ?)`).run(uuidv4(), reportId, req.session.userId, message, response);

        res.json({ success: true, response });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ success: false, message: 'Failed to process message' });
    }
});

// Get chat history
router.get('/history/:reportId', (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        const db = getDb();
        const messages = db.prepare(`SELECT id, message, response, created_at FROM chat_messages WHERE report_id = ? AND user_id = ? ORDER BY created_at ASC`).all(req.params.reportId, req.session.userId);
        res.json({ success: true, messages });
    } catch (error) {
        console.error('Get chat history error:', error);
        res.status(500).json({ success: false, message: 'Failed to get chat history' });
    }
});

module.exports = router;
