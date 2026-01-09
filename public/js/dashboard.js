// Dashboard JavaScript - Upload & Analysis with Multiple File Support
class DashboardManager {
    constructor() {
        this.selectedFiles = []; // Array to hold multiple files
        this.selectedReportType = null;
        this.currentReportIds = []; // Array of report IDs for multiple files
        this.maxFiles = 10;
        this.maxFileSize = 10 * 1024 * 1024; // 10MB

        this.init();
    }

    init() {
        this.bindDropzone();
        this.bindReportTypeSelection();
        this.bindAnalyzeButton();
        this.bindFileActions();
    }

    bindDropzone() {
        const dropzone = document.getElementById('upload-dropzone');
        const fileInput = document.getElementById('file-input');
        const fileInputAdditional = document.getElementById('file-input-additional');

        if (!dropzone || !fileInput) return;

        // Click to open file browser
        dropzone.addEventListener('click', () => fileInput.click());

        // Drag and drop events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
            dropzone.addEventListener(event, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(event => {
            dropzone.addEventListener(event, () => dropzone.classList.add('dragover'));
        });

        ['dragleave', 'drop'].forEach(event => {
            dropzone.addEventListener(event, () => dropzone.classList.remove('dragover'));
        });

        dropzone.addEventListener('drop', (e) => {
            const files = Array.from(e.dataTransfer.files);
            this.handleMultipleFiles(files);
        });

        // File input change - primary input
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                this.handleMultipleFiles(files);
            }
        });

        // Additional file input (for Add More button)
        if (fileInputAdditional) {
            fileInputAdditional.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                if (files.length > 0) {
                    this.handleMultipleFiles(files, true); // true = append mode
                }
            });
        }
    }

    bindFileActions() {
        // Add More button
        document.getElementById('add-more-btn')?.addEventListener('click', () => {
            document.getElementById('file-input-additional')?.click();
        });

        // Clear All button
        document.getElementById('clear-all-btn')?.addEventListener('click', () => {
            this.clearAllFiles();
        });
    }

    handleMultipleFiles(files, append = false) {
        const allowedTypes = ['application/pdf', 'text/csv', 'application/xml', 'text/xml',
            'image/jpeg', 'image/png', 'image/jpg'];
        const allowedExtensions = ['.pdf', '.csv', '.xml', '.jpg', '.jpeg', '.png'];

        // If not appending, clear existing files
        if (!append) {
            this.selectedFiles = [];
        }

        let addedCount = 0;
        let skippedCount = 0;

        for (const file of files) {
            // Check max files limit
            if (this.selectedFiles.length >= this.maxFiles) {
                skippedCount++;
                continue;
            }

            // Check file type
            const ext = '.' + file.name.split('.').pop().toLowerCase();
            if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
                app.showToast(`Skipped "${file.name}" - Invalid file type`, 'warning');
                skippedCount++;
                continue;
            }

            // Check file size
            if (file.size > this.maxFileSize) {
                app.showToast(`Skipped "${file.name}" - File too large (max 10MB)`, 'warning');
                skippedCount++;
                continue;
            }

            // Check for duplicates
            const isDuplicate = this.selectedFiles.some(f =>
                f.name === file.name && f.size === file.size
            );
            if (isDuplicate) {
                skippedCount++;
                continue;
            }

            this.selectedFiles.push(file);
            addedCount++;
        }

        if (addedCount > 0) {
            this.showFilesPreview();
            app.showToast(`${addedCount} file(s) added successfully`, 'success');
        }

        if (skippedCount > 0 && this.selectedFiles.length >= this.maxFiles) {
            app.showToast(`Maximum ${this.maxFiles} files allowed`, 'warning');
        }

        this.updateAnalyzeButton();
    }

    showFilesPreview() {
        const dropzone = document.getElementById('upload-dropzone');
        const preview = document.getElementById('files-preview');
        const filesGrid = document.getElementById('files-grid');
        const filesCount = document.getElementById('files-count');

        if (!dropzone || !preview || !filesGrid) return;

        dropzone.classList.add('hidden');
        preview.classList.remove('hidden');

        filesCount.textContent = this.selectedFiles.length;

        // Clear existing grid
        filesGrid.innerHTML = '';

        // Create file cards
        this.selectedFiles.forEach((file, index) => {
            const card = this.createFileCard(file, index);
            filesGrid.appendChild(card);
        });
    }

    createFileCard(file, index) {
        const ext = file.name.split('.').pop().toLowerCase();
        const icons = {
            pdf: '📄',
            csv: '📊',
            xml: '📝',
            jpg: '🖼️',
            jpeg: '🖼️',
            png: '🖼️'
        };

        const card = document.createElement('div');
        card.className = 'file-card';
        card.dataset.index = index;

        // Check if it's an image to show thumbnail
        const isImage = ['jpg', 'jpeg', 'png'].includes(ext);

        if (isImage) {
            const reader = new FileReader();
            reader.onload = (e) => {
                card.innerHTML = `
                    <div class="file-card-thumbnail">
                        <img src="${e.target.result}" alt="${file.name}">
                    </div>
                    <div class="file-card-info">
                        <span class="file-card-name" title="${file.name}">${this.truncateFileName(file.name)}</span>
                        <span class="file-card-size">${this.formatFileSize(file.size)}</span>
                    </div>
                    <button class="file-card-remove" data-index="${index}" title="Remove file">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                `;
                this.bindRemoveButton(card.querySelector('.file-card-remove'));
            };
            reader.readAsDataURL(file);
        } else {
            card.innerHTML = `
                <div class="file-card-icon">${icons[ext] || '📁'}</div>
                <div class="file-card-info">
                    <span class="file-card-name" title="${file.name}">${this.truncateFileName(file.name)}</span>
                    <span class="file-card-size">${this.formatFileSize(file.size)}</span>
                </div>
                <button class="file-card-remove" data-index="${index}" title="Remove file">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `;
            this.bindRemoveButton(card.querySelector('.file-card-remove'));
        }

        return card;
    }

    bindRemoveButton(button) {
        if (!button) return;
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(button.dataset.index);
            this.removeFile(index);
        });
    }

    removeFile(index) {
        this.selectedFiles.splice(index, 1);

        if (this.selectedFiles.length === 0) {
            this.clearAllFiles();
        } else {
            this.showFilesPreview();
        }

        this.updateAnalyzeButton();
        app.showToast('File removed', 'info');
    }

    clearAllFiles() {
        this.selectedFiles = [];

        const dropzone = document.getElementById('upload-dropzone');
        const preview = document.getElementById('files-preview');
        const fileInput = document.getElementById('file-input');
        const fileInputAdditional = document.getElementById('file-input-additional');

        dropzone?.classList.remove('hidden');
        preview?.classList.add('hidden');

        if (fileInput) fileInput.value = '';
        if (fileInputAdditional) fileInputAdditional.value = '';

        this.updateAnalyzeButton();
    }

    truncateFileName(name, maxLength = 20) {
        if (name.length <= maxLength) return name;
        const ext = name.split('.').pop();
        const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
        const truncated = nameWithoutExt.substring(0, maxLength - ext.length - 4) + '...';
        return truncated + '.' + ext;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    bindReportTypeSelection() {
        document.querySelectorAll('input[name="reportType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.selectedReportType = e.target.value;
                this.updateAnalyzeButton();
            });
        });
    }

    updateAnalyzeButton() {
        const btn = document.getElementById('analyze-btn');
        if (btn) {
            btn.disabled = !(this.selectedFiles.length > 0 && this.selectedReportType);
        }
    }

    bindAnalyzeButton() {
        document.getElementById('analyze-btn')?.addEventListener('click', () => {
            this.uploadAndAnalyzeAll();
        });
    }

    async uploadAndAnalyzeAll() {
        if (this.selectedFiles.length === 0 || !this.selectedReportType) {
            app.showToast('Please select files and report type', 'warning');
            return;
        }

        app.showLoading(`Uploading ${this.selectedFiles.length} file(s)...`);
        this.currentReportIds = [];

        try {
            // Upload all files
            const uploadPromises = this.selectedFiles.map((file, index) =>
                this.uploadSingleFile(file, index)
            );

            const uploadResults = await Promise.all(uploadPromises);

            // Filter successful uploads
            const successfulUploads = uploadResults.filter(r => r.success);
            const failedCount = uploadResults.length - successfulUploads.length;

            if (successfulUploads.length === 0) {
                throw new Error('All uploads failed');
            }

            if (failedCount > 0) {
                app.showToast(`${failedCount} file(s) failed to upload`, 'warning');
            }

            app.showToast(`${successfulUploads.length} file(s) uploaded successfully!`, 'success');

            // Analyze all uploaded files
            app.showLoading(`Analyzing ${successfulUploads.length} report(s) with AI...`);

            const mode = document.querySelector('.mode-btn.active')?.dataset.mode || 'patient';

            const analysisPromises = successfulUploads.map(upload =>
                this.analyzeSingleReport(upload.reportId, mode)
            );

            const analysisResults = await Promise.all(analysisPromises);
            const successfulAnalyses = analysisResults.filter(r => r.success);

            app.showToast(`${successfulAnalyses.length} report(s) analyzed!`, 'success');

            // Display results of the first successful analysis
            if (successfulAnalyses.length > 0) {
                this.displayResults(successfulAnalyses[0].data);

                // Store all report IDs for potential multi-report features
                this.currentReportIds = successfulAnalyses.map(a => a.reportId);

                // Enable chat with the first report
                if (window.chatManager && this.currentReportIds.length > 0) {
                    chatManager.enableChat(this.currentReportIds[0]);
                }
            }

            // Show multi-report navigation if multiple analyses succeeded
            if (successfulAnalyses.length > 1) {
                this.showMultiReportNav(successfulAnalyses);
            }

            // Refresh reports list
            this.loadReports();

        } catch (error) {
            console.error('Upload/Analysis error:', error);
            app.showToast(error.message || 'Upload/Analysis failed', 'error');
        } finally {
            app.hideLoading();
        }
    }

    async uploadSingleFile(file, index) {
        try {
            const formData = new FormData();
            formData.append('report', file);
            formData.append('reportType', this.selectedReportType);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!data.success) {
                return { success: false, error: data.message };
            }

            return {
                success: true,
                reportId: data.reportId,
                fileName: data.fileName,
                fileIndex: index
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async analyzeSingleReport(reportId, mode) {
        try {
            const response = await fetch(`/api/analysis/analyze/${reportId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: mode,
                    language: app.currentLanguage
                })
            });

            const data = await response.json();

            if (!data.success) {
                return { success: false, error: data.message };
            }

            return {
                success: true,
                reportId: reportId,
                data: data.data
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    showMultiReportNav(analysisResults) {
        // Create navigation for multiple reports
        const resultsSection = document.getElementById('results-section');
        if (!resultsSection) return;

        // Remove existing nav if any
        const existingNav = resultsSection.querySelector('.multi-report-nav');
        if (existingNav) existingNav.remove();

        const nav = document.createElement('div');
        nav.className = 'multi-report-nav';
        const lang = app.currentLanguage || 'english';
        const navLabel = t('reportsAnalyzed', lang);
        const reportText = t('reportNumber', lang);

        nav.innerHTML = `
            <div class="nav-label">📁 ${analysisResults.length} ${navLabel}:</div>
            <div class="nav-buttons">
                ${analysisResults.map((result, index) => `
                    <button class="report-nav-btn ${index === 0 ? 'active' : ''}" 
                            data-report-id="${result.reportId}" 
                            data-index="${index}">
                        ${reportText} ${index + 1}
                    </button>
                `).join('')}
            </div>
        `;

        resultsSection.insertBefore(nav, resultsSection.firstChild.nextSibling);

        // Bind click events
        nav.querySelectorAll('.report-nav-btn').forEach((btn, idx) => {
            btn.addEventListener('click', () => {
                nav.querySelectorAll('.report-nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.displayResults(analysisResults[idx].data);

                // Update chat context
                if (window.chatManager) {
                    chatManager.enableChat(analysisResults[idx].reportId);
                }
            });
        });
    }

    displayResults(data) {
        const resultsSection = document.getElementById('results-section');
        if (!resultsSection) return;

        resultsSection.classList.remove('hidden');

        // Display extracted data table
        this.displayDataTable(data.extractedData);

        // Display short explanation
        this.displayExplanation('short-explanation-content', data.shortExplanation);

        // Display long explanation
        this.displayExplanation('long-explanation-content', data.longExplanation);

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    displayDataTable(extractedData) {
        const container = document.getElementById('data-table-container');
        const noteContainer = document.getElementById('data-note');

        if (!container) return;

        if (extractedData.type === 'structured' && extractedData.data?.length > 0) {
            let tableHtml = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Parameter</th>
                            <th>Value</th>
                            <th>Unit</th>
                            <th>Status</th>
                            <th>Reference Range</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            extractedData.data.forEach(item => {
                const statusClass = item.status === 'normal' ? 'status-normal' :
                    item.status === 'high' ? 'status-high' : 'status-low';
                tableHtml += `
                    <tr>
                        <td><strong>${item.name}</strong></td>
                        <td>${item.value}</td>
                        <td>${item.unit || '-'}</td>
                        <td class="${statusClass}">${item.status.toUpperCase()}</td>
                        <td>${item.referenceRange || '-'}</td>
                    </tr>
                `;
            });

            tableHtml += '</tbody></table>';
            container.innerHTML = tableHtml;

        } else if (extractedData.type === 'imaging' && extractedData.findings?.length > 0) {
            let html = '<div class="imaging-findings"><h4>📷 Imaging Findings</h4><ul>';
            extractedData.findings.forEach(finding => {
                html += `<li>${finding}</li>`;
            });
            html += '</ul></div>';
            container.innerHTML = html;

        } else {
            container.innerHTML = `
                <div class="raw-text-preview">
                    <h4>📝 Extracted Text</h4>
                    <pre>${extractedData.rawText?.substring(0, 1000) || 'No text extracted'}${extractedData.rawText?.length > 1000 ? '...' : ''}</pre>
                </div>
            `;
        }

        // Show note if applicable
        if (noteContainer && extractedData.rawText) {
            noteContainer.innerHTML = '⚠️ Some information may be unclear or unreadable. Please verify with the original document.';
        }
    }

    displayExplanation(containerId, explanation) {
        const container = document.getElementById(containerId);
        if (!container || !explanation) return;

        // Split into lines for proper processing
        const lines = explanation.split('\n');
        let result = [];
        let inList = false;

        // Helper to process bold text
        const processBold = (text) => {
            return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        };

        for (let line of lines) {
            // Trim the line
            line = line.trim();

            // Headers
            if (line.startsWith('### ')) {
                if (inList) { result.push('</ul>'); inList = false; }
                result.push(`<h4 class="explanation-heading">${processBold(line.substring(4))}</h4>`);
            } else if (line.startsWith('## ')) {
                if (inList) { result.push('</ul>'); inList = false; }
                result.push(`<h3 class="explanation-heading">${processBold(line.substring(3))}</h3>`);
            }
            // List items (bullet points)
            else if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ') || line.match(/^\d+\.\s/)) {
                if (!inList) { result.push('<ul class="explanation-list">'); inList = true; }
                const listContent = line.replace(/^[•\-\*]\s/, '').replace(/^\d+\.\s/, '');
                result.push(`<li>${processBold(listContent)}</li>`);
            }
            // Table rows (markdown tables)
            else if (line.startsWith('|') && line.endsWith('|')) {
                if (inList) { result.push('</ul>'); inList = false; }
                // Skip table separator rows
                if (!line.includes('---')) {
                    const cells = line.split('|').filter(c => c.trim());
                    if (cells.length > 0) {
                        result.push('<div class="table-row">' + cells.map(c => `<span class="table-cell">${processBold(c.trim())}</span>`).join('') + '</div>');
                    }
                }
            }
            // Regular paragraphs with content
            else if (line.length > 0) {
                if (inList) { result.push('</ul>'); inList = false; }
                result.push(`<p>${processBold(line)}</p>`);
            }
        }

        // Close any open list
        if (inList) result.push('</ul>');

        container.innerHTML = result.join('');
    }

    async loadReports() {
        try {
            const response = await fetch('/api/upload/reports');
            const data = await response.json();

            if (data.success) {
                this.displayReportsList(data.reports);
            }
        } catch (error) {
            console.error('Load reports error:', error);
        }
    }

    displayReportsList(reports) {
        const container = document.getElementById('reports-list');
        if (!container) return;

        if (reports.length === 0) {
            container.innerHTML = '<p class="no-reports">No reports uploaded yet.</p>';
            return;
        }

        const icons = {
            xray: '🦴',
            mri: '🧲',
            ctscan: '📡',
            bloodtest: '🩸',
            labtest: '🔬',
            handwritten: '✍️'
        };

        container.innerHTML = reports.slice(0, 10).map(report => `
            <div class="report-item" data-id="${report.id}">
                <span class="report-item-icon">${icons[report.report_type] || '📄'}</span>
                <div class="report-item-info">
                    <span class="report-item-name">${report.file_name}</span>
                    <span class="report-item-date">${new Date(report.created_at).toLocaleDateString()}</span>
                </div>
                <span class="report-item-status ${report.status}">${report.status}</span>
            </div>
        `).join('');

        // Bind click events
        container.querySelectorAll('.report-item').forEach(item => {
            item.addEventListener('click', () => {
                this.loadReportResults(item.dataset.id);
            });
        });
    }

    async loadReportResults(reportId) {
        app.showLoading('Loading report...');

        try {
            const response = await fetch(`/api/analysis/results/${reportId}`);
            const data = await response.json();

            if (data.success && data.report.status === 'analyzed') {
                this.currentReportIds = [reportId];

                this.displayResults({
                    extractedData: data.report.extractedData,
                    shortExplanation: data.report.short_explanation,
                    longExplanation: data.report.long_explanation
                });

                // Enable chat
                if (window.chatManager) {
                    chatManager.enableChat(reportId);
                }
            } else {
                app.showToast('Report has not been analyzed yet', 'warning');
            }
        } catch (error) {
            console.error('Load report error:', error);
            app.showToast('Failed to load report', 'error');
        } finally {
            app.hideLoading();
        }
    }
}

// Initialize dashboard
const dashboard = new DashboardManager();
window.dashboard = dashboard;
