(function () {
  // --- find the <script> element that loaded this file ---
  const thisScript = document.currentScript || (function () {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  // --- helper: read data-attribute with fallback ---
  function ds(name, fallback) {
    if (!thisScript) return fallback;
    const v = thisScript.getAttribute('data-' + name);
    return v != null ? v : fallback;
  }

  // --- config read from data- attributes ---
  const cfg = {
    webhookUrl: ds('webhook', '').trim(), // REQUIRED ideally
    assistantName: ds('assistant-name', 'Chat'),
    assistantAvatar: ds('assistant-avatar', '').trim(),
    footerText: ds('footer-text', '').trim(), // custom text from client
    footerTextColor: ds('footer-text-color', 'inherit'), // optional color
    enableTyping: ds('enable-typing', 'true') !== 'false',
    branding: thisScript.getAttribute('branding'), // true/false

    // theme colors - optional
    theme: {
      chatButton: ds('chat-button', '#6f5cff'),
      chatHeader: ds('chat-header', '#6f5cff'),
      userBubble: ds('user-bubble', '#33334d'),
      botBubble: ds('bot-bubble', '#6f5cff'),
      footerBg: ds('footer-bg', '#1e1e2f'),
      chatBg: ds('chat-bg', '#1b1b2a'),
      inputBg: ds('input-bg', '#2a2a3f'),
      inputColor: ds('input-color', '#ffffff'),
      sendButton: ds('send-button', '#6f5cff'),
      sendHover: ds('send-hover', '#5648d4'),
      choiceBg: ds('choice-bg', '#5c4dff'),
      choiceColor: ds('choice-color', '#ffffff'),
      choiceHover: ds('choice-hover', '#4a3dcf')
    },

    // small behaviors
    maxMessages: parseInt(ds('max-messages', '200'), 10) || 200
  };

  const hasWebhook = !!cfg.webhookUrl;

  // --- create styles (namespaced) ---
  const style = document.createElement('style');
  style.innerHTML = `
    /* Chat widget (namespaced with aiw-) */
    #aiw-chat-btn {
      position: fixed; right: 20px; bottom: 20px;
      width: 60px; height: 60px; border-radius: 50%;
      background: ${cfg.theme.chatButton}; color: white; border: none;
      font-size: 26px; cursor: pointer; display: flex;
      align-items: center; justify-content: center;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3); transition: transform .14s;
      z-index: 999999;
    }
    #aiw-chat-btn:hover { transform: scale(1.06); }

    #aiw-chat-box {
      position: fixed; right: 20px; bottom: 100px;
      width: 360px; max-height: 70vh; min-height: 120px;
      background: ${cfg.theme.chatBg}; border-radius: 14px;
      box-shadow: 0 18px 40px rgba(0,0,0,0.45);
      display: none; flex-direction: column; overflow: hidden;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      color: #fff;
    }

    /* header */
    #aiw-chat-header {
      background: ${cfg.theme.chatHeader}; color: #fff; padding: 12px 14px;
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
      font-weight: 600; font-size: 15px;
    }
    #aiw-chat-header .aiw-left { display:flex; align-items:center; gap:10px; }
    #aiw-chat-header img.aiw-avatar-small { width:34px;height:34px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,0.14); }
    #aiw-chat-header button.aiw-close {
      background:transparent;border:none;color:white;font-size:18px;cursor:pointer;padding:6px 8px;border-radius:8px;
    }

    /* body */
    #aiw-chat-body {
      padding: 14px; overflow-y: auto; display:flex; flex-direction:column; gap:10px;
      background: ${cfg.theme.chatBg};
    }

    .aiw-msg { max-width: 84%; padding:10px 12px; border-radius:12px; font-size:14px; line-height:1.35; display:flex; gap:8px; align-items:flex-end; }
    .aiw-msg.aiw-user { margin-left:auto; background: ${cfg.theme.userBubble}; color:#fff; align-self:flex-end; }
    .aiw-msg.aiw-bot { margin-right:auto; background: ${cfg.theme.botBubble}; color:#fff; align-self:flex-start; }
    .aiw-msg img.aiw-avatar-msg { width:28px;height:28px;border-radius:50%;object-fit:cover;flex:0 0 28px; }

    /* choices container */
    .aiw-choices { display:flex; flex-wrap:wrap; gap:8px; margin-top:6px; }
    .aiw-choice-btn {
      background: ${cfg.theme.choiceBg}; color: ${cfg.theme.choiceColor}; border:none; padding:8px 10px; border-radius:10px;
      cursor:pointer; font-size:13px; box-shadow: 0 6px 18px rgba(0,0,0,0.18);
    }
    .aiw-choice-btn:hover { background: ${cfg.theme.choiceHover}; }

    /* typing dots */
    .aiw-typing { display:flex; gap:6px; align-items:center; padding:8px 10px; border-radius:12px; }
    .aiw-dot { width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.9);opacity:0; animation: aiw-blink 1.2s infinite; }
    .aiw-dot:nth-child(2) { animation-delay: 0.12s; } .aiw-dot:nth-child(3) { animation-delay: 0.24s; }
    @keyframes aiw-blink { 0%,80%,100% { opacity:0; } 40% { opacity:1; } }

    /* footer + input */
    #aiw-chat-footer { padding: 10px; display:flex; flex-direction:column; gap:8px; background:${cfg.theme.footerBg}; }
    #aiw-chat-input-row { display:flex; gap:8px; align-items:center; }
    #aiw-chat-input { flex:1; padding:9px 12px; border-radius:10px; border:none; outline:none; font-size:14px; background:${cfg.theme.inputBg}; color:${cfg.theme.inputColor}; }
    #aiw-send-btn { background:${cfg.theme.sendButton}; color:#fff; border:none; padding:9px 12px; border-radius:10px; cursor:pointer; }
    #aiw-send-btn:hover { background:${cfg.theme.sendHover}; }

    #aiw-footer-text { text-align:center; font-size:12px; color:#cfcfcf; padding:6px 4px; }
    /* responsive */
    @media (max-width:480px) {
      #aiw-chat-box { width: 92%; right: 4%; bottom: 84px; max-height: 78vh; }
      #aiw-chat-btn { right: 16px; bottom: 16px; }
    }
  `;
  document.head.appendChild(style);

  // --- insert widget HTML ---
  const widgetHtml = `
    <button id="aiw-chat-btn" aria-label="Open chat">💬</button>
    <div id="aiw-chat-box" role="dialog" aria-hidden="true" aria-label="Chat widget">
      <div id="aiw-chat-header">
        <div class="aiw-left">
          ${cfg.assistantAvatar ? `<img class="aiw-avatar-small" src="${escapeHtml(cfg.assistantAvatar)}" alt="assistant">` : ''}
          <div class="aiw-title">${escapeHtml(cfg.assistantName)}</div>
        </div>
        <button class="aiw-close" aria-label="Close chat">✖</button>
      </div>
      <div id="aiw-chat-body" aria-live="polite"></div>
      <div id="aiw-chat-footer">
        <div id="aiw-chat-input-row">
          <input id="aiw-chat-input" type="text" placeholder="Type your message..." aria-label="Type message">
          <button id="aiw-send-btn" aria-label="Send message">Send</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', widgetHtml);

  // --- element refs ---
  const btn = document.getElementById('aiw-chat-btn');
  const box = document.getElementById('aiw-chat-box');
  const closeBtn = box.querySelector('.aiw-close');
  const bodyEl = document.getElementById('aiw-chat-body');
  const inputEl = document.getElementById('aiw-chat-input');
  const sendBtn = document.getElementById('aiw-send-btn');
  const footerContainer = box.querySelector('#aiw-chat-footer');

  // --- open/close handlers ---
  btn.addEventListener('click', () => { box.style.display = 'flex'; btn.style.display = 'none'; box.setAttribute('aria-hidden', 'false'); inputEl.focus(); });
  closeBtn.addEventListener('click', () => { box.style.display = 'none'; btn.style.display = 'flex'; box.setAttribute('aria-hidden', 'true'); });

  // --- small utilities ---
  function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
  function el(tag, className) { const e = document.createElement(tag); if (className) e.className = className; return e; }
  function scrollToBottom() { bodyEl.scrollTop = bodyEl.scrollHeight; }

  // --- message management (limit messages to avoid huge DOM) ---
  function trimMessages() {
    const msgs = bodyEl.querySelectorAll('.aiw-msg');
    if (msgs.length > cfg.maxMessages) {
      const removeCount = msgs.length - cfg.maxMessages;
      for (let i = 0; i < removeCount; i++) msgs[i].remove();
    }
  }

  // --- add message to UI ---
  function addMessage(text, who, options = {}) {
    const m = el('div', `aiw-msg aiw-${who}`);
    if (who === 'bot' && cfg.assistantAvatar) {
      const img = el('img', 'aiw-avatar-msg'); img.src = cfg.assistantAvatar; img.alt = 'A';
      m.appendChild(img);
    }
    const span = el('div'); span.innerHTML = escapeHtml(text);
    m.appendChild(span);
    bodyEl.appendChild(m);
    trimMessages();
    scrollToBottom();
    return m;
  }

  // --- add bot typing indicator ---
  function addTyping() {
    if (!cfg.enableTyping) return null;
    const m = el('div', 'aiw-msg aiw-bot');
    const wrap = el('div', 'aiw-typing');
    wrap.innerHTML = `<div class="aiw-dot"></div><div class="aiw-dot"></div><div class="aiw-dot"></div>`;
    m.appendChild(wrap);
    bodyEl.appendChild(m);
    scrollToBottom();
    return m;
  }

  // --- render choices below a bot message ---
  function renderChoices(container, choices) {
    if (!choices || !choices.length) return;
    const cwrap = el('div', 'aiw-choices');
    choices.forEach(choiceText => {
      const btn = el('button', 'aiw-choice-btn');
      btn.type = 'button';
      btn.textContent = choiceText;
      btn.addEventListener('click', () => {
        addMessage(choiceText, 'user');
        sendToWebhook(choiceText);
        cwrap.remove();
      });
      cwrap.appendChild(btn);
    });
    container.appendChild(cwrap);
    scrollToBottom();
  }

  // --- fetch wrapper to send messages to webhook ---
  function sendToWebhook(message) {
    if (!hasWebhook) {
      addMessage("No webhook configured for this widget. Please set data-webhook on the script.", 'bot');
      return Promise.resolve({ reply: "No webhook", choices: [] });
    }
    const payload = { message: message, timestamp: Date.now() };
    try {
      let sid = sessionStorage.getItem('aiw_chat_sid');
      if (!sid) { sid = 'sid_' + Math.random().toString(36).slice(2, 10); sessionStorage.setItem('aiw_chat_sid', sid); }
      payload.chatId = sid;
    } catch (e) { }
    return fetch(cfg.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => { if (!r.ok) throw new Error('Network response not ok'); return r.json().catch(() => ({})); })
      .catch(err => ({ error: true, message: err.message }));
  }

  // --- handle send (input / enter) ---
  function handleSendText() {
    const text = inputEl.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    inputEl.value = '';
    inputEl.focus();

    const typingEl = addTyping();
    sendToWebhook(text).then(resp => {
      if (typingEl) typingEl.remove();
      if (!resp) { addMessage("No response from server.", 'bot'); return; }
      if (resp.error) { addMessage("Error: " + (resp.message || 'Request failed'), 'bot'); return; }
      const reply = (resp.reply || resp.message || resp.output || '');
      if (reply) {
        const botMsg = addMessage(reply, 'bot');
        if (Array.isArray(resp.choices) && resp.choices.length) renderChoices(botMsg, resp.choices);
        else if (Array.isArray(resp.buttons) && resp.buttons.length) renderChoices(botMsg, resp.buttons);
      } else { addMessage("No reply provided by webhook.", 'bot'); }
    });
  }

  sendBtn.addEventListener('click', handleSendText);
  inputEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') handleSendText(); });

  // --- initial welcome ---
  (function maybeWelcome() {
    const autoWelcome = ds('auto-welcome', 'false') === 'true';
    if (autoWelcome && hasWebhook) {
      const payload = { event: 'session_start', timestamp: Date.now(), chatId: (sessionStorage.getItem('aiw_chat_sid') || '') };
      fetch(cfg.webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(r => r.json().catch(() => ({})))
        .then(resp => {
          if (!resp) return;
          if (resp.reply) { const botMsg = addMessage(resp.reply, 'bot'); if (Array.isArray(resp.choices)) renderChoices(botMsg, resp.choices); }
        })
        .catch(() => { });
    }
  })();

  // --- render footer branding dynamically ---
  (function renderFooterBranding() {
    // hide footer if branding=false
    if (cfg.branding === 'false') return;

    // determine what text to show
    let footerTextToShow = (cfg.footerText && cfg.footerText.trim()) ? cfg.footerText.trim() : 'Powered by Aioraa';

    const footerEl = document.createElement('div');
    footerEl.id = 'aiw-footer-text';

    // if default branding, make it clickable
    if (footerTextToShow === 'Powered by Aioraa') {
      footerEl.innerHTML = `<a href="https://www.aioraa.com" target="_blank" rel="noopener noreferrer" style="color:${cfg.footerTextColor}; text-decoration:none;">Powered by Aioraa</a>`;
    } else {
      footerEl.textContent = footerTextToShow;
      footerEl.style.color = cfg.footerTextColor || 'inherit';
    }

    footerContainer.appendChild(footerEl);
  })();

})();
