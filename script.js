/* Simple Chat Widget JS
   - Replace `N8N_WEBHOOK_URL` with your N8N webhook URL.
   - N8N should accept JSON: { message: "user message" } and reply with JSON { reply: "text" }.
*/

const chatBubble = document.getElementById('chat-bubble');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const sendBtn = document.getElementById('send-btn');
const chatInput = document.getElementById('chat-input');
const chatBody = document.getElementById('chat-body');
const typingIndicator = document.getElementById('typing-indicator');
const themeToggle = document.getElementById('theme-toggle');

// ----------- CONFIG -----------
const N8N_WEBHOOK_URL = "https://example.com/webhook/your-n8n-id"; // <-- REPLACE with your N8N webhook URL
const BOT_FALLBACK = "Sorry, I'm having trouble right now. Please try again later.";
// ------------------------------

// Open / Close
chatBubble.addEventListener('click', () => {
  chatWindow.style.display = 'flex';
  chatBubble.style.display = 'none';
  chatWindow.classList.add('show');
});

chatClose.addEventListener('click', () => {
  chatWindow.style.display = 'none';
  chatBubble.style.display = 'flex';
});

// Theme toggle
const root = document.documentElement;
let theme = localStorage.getItem('chat-theme') || 'light';
applyTheme(theme);

themeToggle.addEventListener('click', () => {
  theme = (theme === 'light') ? 'dark' : 'light';
  applyTheme(theme);
  localStorage.setItem('chat-theme', theme);
});

function applyTheme(t){
  if(t === 'dark') document.documentElement.setAttribute('data-theme','dark'), themeToggle.textContent = '☀️';
  else document.documentElement.removeAttribute('data-theme'), themeToggle.textContent = '🌙';
}

// Send message handlers
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
  if(e.key === 'Enter') sendMessage();
});

async function sendMessage(){
  const text = chatInput.value.trim();
  if(!text) return;
  appendMessage(text, 'user');
  chatInput.value = '';
  showTyping(true);

  try {
    // Call N8N webhook
    // N8N: create a Webhook node that accepts POST JSON { message: "..." } and returns { reply: "..." }
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    if(!res.ok) throw new Error('Network response not ok');

    // Expecting JSON { reply: "..." }
    const data = await res.json();
    const reply = (data && (data.reply || data.message || data.text)) ? (data.reply || data.message || data.text) : BOT_FALLBACK;

    // Simulate typing delay depending on length
    const delay = Math.min(1200 + reply.length * 10, 3000);
    await sleep(delay);
    appendMessage(reply, 'bot');

  } catch (err) {
    console.error('Chat error', err);
    await sleep(800);
    appendMessage(BOT_FALLBACK, 'bot');
  } finally {
    showTyping(false);
  }
}

// Helpers
function appendMessage(text, who){
  const el = document.createElement('div');
  el.className = who === 'user' ? 'user-message' : 'bot-message';
  el.textContent = text;
  chatBody.appendChild(el);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function showTyping(show){
  typingIndicator.style.display = show ? 'flex' : 'none';
  // optional: add a placeholder bot bubble while typing
  if(show){
    // ensure no duplicate placeholder
    if(!document.querySelector('.bot-message.placeholder')){
      const placeholder = document.createElement('div');
      placeholder.className = 'bot-message placeholder';
      placeholder.textContent = ''; // empty
      placeholder.style.opacity = '0.9';
      placeholder.style.pointerEvents = 'none';
      placeholder.id = 'typing-placeholder';
      chatBody.appendChild(placeholder);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  } else {
    const ph = document.getElementById('typing-placeholder');
    if(ph) ph.remove();
    chatBody.scrollTop = chatBody.scrollHeight;
  }
}

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }
