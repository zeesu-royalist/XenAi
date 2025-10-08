// =======================
// Navigation Toggle
// =======================
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// =======================
// Chat Interface
// =======================
const chatbotIcon = document.getElementById('chatbot-icon');
const chatbotOverlay = document.getElementById('chatbot-overlay');
const closeBtn = document.getElementById('close-btn');
const sendBtn = document.getElementById('send-btn');
const chatInput = document.getElementById('chatbot-input');
const messagesContainer = document.getElementById('chatbot-messages');
const startChatBtn = document.getElementById('start-chat');

// Open chat
function openChat() {
    chatbotOverlay.classList.remove('hidden');
    chatbotOverlay.classList.add('active');
    chatInput.focus();
}

// Close chat
function closeChat() {
    chatbotOverlay.classList.remove('active');
    setTimeout(() => {
        chatbotOverlay.classList.add('hidden');
    }, 300);
}

// Event listeners
chatbotIcon.addEventListener('click', openChat);
startChatBtn.addEventListener('click', openChat);
closeBtn.addEventListener('click', closeChat);

// Close chat when clicking overlay
chatbotOverlay.addEventListener('click', (e) => {
    if (e.target === chatbotOverlay) {
        closeChat();
    }
});

// =======================
// Send Message
// =======================
function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';

    // Get AI response from Gemini API
    getBotResponse(message);
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${sender === 'ai' ? 'fa-robot' : 'fa-user'}"></i>
        </div>
        <div class="message-content">
            <p>${text}</p>
            <span class="message-time">${currentTime}</span>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Event listeners for sending messages
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// =======================
// Gemini API Integration
// =======================
async function getBotResponse(userMessage) {
    const API_KEY = "AIzaSyARt_GIlTpuLqZ16FJLKE3pTaJbdyXyhSI"; 
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: userMessage }],
                    },
                ],
            }),
        });

        const data = await response.json();

        if (!data.candidates || !data.candidates.length) {
            throw new Error("No response from Gemini API");
        }

        const botMessage = data.candidates[0].content.parts[0].text;
        addMessage(botMessage, 'ai');
    } catch (error) {
        console.error("Error:", error);
        addMessage("Sorry, I'm having trouble responding. Please try again.", 'ai');
    }
}

// =======================
// Smooth Scrolling for nav links
// =======================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// =======================
// Scroll effect for navbar
// =======================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});
