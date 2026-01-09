// Chat JavaScript - AI Chatbot
class ChatManager {
    constructor() {
        this.currentReportId = null;
        this.isEnabled = false;

        this.init();
    }

    init() {
        this.bindChatToggle();
        this.bindChatInput();
    }

    bindChatToggle() {
        const toggle = document.getElementById('chatbot-toggle');
        const panel = document.getElementById('chatbot-panel');
        const closeBtn = document.getElementById('chatbot-close');

        toggle?.addEventListener('click', () => {
            panel?.classList.toggle('hidden');
        });

        closeBtn?.addEventListener('click', () => {
            panel?.classList.add('hidden');
        });
    }

    bindChatInput() {
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send-btn');

        sendBtn?.addEventListener('click', () => {
            this.sendMessage();
        });

        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    enableChat(reportId) {
        this.currentReportId = reportId;
        this.isEnabled = true;

        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send-btn');

        if (input) input.disabled = false;
        if (sendBtn) sendBtn.disabled = false;

        // Clear previous messages except greeting
        const messagesContainer = document.getElementById('chatbot-messages');
        if (messagesContainer) {
            const greeting = messagesContainer.querySelector('.chat-message.bot');
            messagesContainer.innerHTML = '';
            if (greeting) messagesContainer.appendChild(greeting);
        }

        // Update greeting
        this.updateGreeting();
    }

    disableChat() {
        this.currentReportId = null;
        this.isEnabled = false;

        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('chat-send-btn');

        if (input) input.disabled = true;
        if (sendBtn) sendBtn.disabled = true;
    }

    updateGreeting() {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;

        const lang = app.currentLanguage;
        const greetings = {
            english: "Hello! I'm ready to help you understand your uploaded report. Ask me anything about the values, findings, or medical terms in your report!",
            tamil: "வணக்கம்! பதிவேற்றிய அறிக்கையைப் புரிந்துகொள்ள உங்களுக்கு உதவ தயாராக இருக்கிறேன். உங்கள் அறிக்கையில் உள்ள மதிப்புகள், கண்டுபிடிப்புகள் அல்லது மருத்துவ சொற்களைப் பற்றி எதையும் கேளுங்கள்!",
            hindi: "नमस्ते! मैं आपकी अपलोड की गई रिपोर्ट को समझने में मदद करने के लिए तैयार हूं। अपनी रिपोर्ट में मूल्यों, निष्कर्षों या चिकित्सा शब्दों के बारे में कुछ भी पूछें!"
        };

        const firstMessage = messagesContainer.querySelector('.chat-message.bot .message-content p');
        if (firstMessage) {
            firstMessage.textContent = greetings[lang] || greetings.english;
        }
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input?.value.trim();

        if (!message) return;

        if (!this.isEnabled || !this.currentReportId) {
            app.showToast('Please upload and analyze a report first', 'warning');
            return;
        }

        // Clear input
        input.value = '';

        // Add user message to chat
        this.addMessage(message, 'user');

        // Show typing indicator
        this.showTyping();

        try {
            const response = await fetch(`/api/chat/${this.currentReportId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    language: app.currentLanguage
                })
            });

            const data = await response.json();

            // Remove typing indicator
            this.hideTyping();

            if (data.success) {
                this.addMessage(data.response, 'bot');
            } else {
                this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
            }
        } catch (error) {
            console.error('Chat error:', error);
            this.hideTyping();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    }

    addMessage(content, type) {
        const container = document.getElementById('chatbot-messages');
        if (!container) return;

        const avatar = type === 'bot' ? '🤖' : '👤';

        // Convert markdown-like formatting
        let formattedContent = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');

        const messageHtml = `
            <div class="chat-message ${type}">
                <div class="message-avatar">${avatar}</div>
                <div class="message-content">
                    <p>${formattedContent}</p>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', messageHtml);

        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }

    showTyping() {
        const container = document.getElementById('chatbot-messages');
        if (!container) return;

        const typingHtml = `
            <div class="chat-message bot typing-indicator">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', typingHtml);
        container.scrollTop = container.scrollHeight;
    }

    hideTyping() {
        const typingIndicator = document.querySelector('.typing-indicator');
        typingIndicator?.remove();
    }

    async loadHistory() {
        if (!this.currentReportId) return;

        try {
            const response = await fetch(`/api/chat/history/${this.currentReportId}`);
            const data = await response.json();

            if (data.success && data.messages.length > 0) {
                data.messages.forEach(msg => {
                    this.addMessage(msg.message, 'user');
                    if (msg.response) {
                        this.addMessage(msg.response, 'bot');
                    }
                });
            }
        } catch (error) {
            console.error('Load chat history error:', error);
        }
    }
}

// Add typing animation styles
const typingStyles = document.createElement('style');
typingStyles.textContent = `
    .typing-dots {
        display: flex;
        gap: 4px;
        padding: 8px 0;
    }
    
    .typing-dots span {
        width: 8px;
        height: 8px;
        background: #94a3b8;
        border-radius: 50%;
        animation: typingBounce 1.4s ease-in-out infinite;
    }
    
    .typing-dots span:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-dots span:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes typingBounce {
        0%, 100% {
            transform: translateY(0);
            opacity: 0.5;
        }
        50% {
            transform: translateY(-5px);
            opacity: 1;
        }
    }
`;
document.head.appendChild(typingStyles);

// Initialize chat manager
const chatManager = new ChatManager();
window.chatManager = chatManager;
