AI Aura — Plug & Play Chat Widget

A simple, professional, and configurable chat widget you can embed on any website with a single <script> tag. Configure entirely via data- attributes — no JavaScript editing required.

Features

Floating chat button with chat panel

Dark theme by default (customisable)

Optional assistant name & avatar

Optional footer branding text

Typing animation support

Choice / menu buttons (from webhook)

Sends user messages to your webhook and displays JSON replies

Lightweight, minimal, and easy to host

Quick Start

Host script.js on a public URL (GitHub Pages, Netlify, Vercel, S3, or your server).

Add the script tag to your website.

Set data-webhook to point at your webhook for handling messages.

Example Embed
<script
  src="https://harsh-kumar-saaniya.github.io/Chat-UI-Widget/script.js"
  async
  data-webhook="https://your-n8n-webhook.com/webhook123"
  data-assistant-name="AI Aura"
  data-assistant-avatar="https://yourdomain.com/avatar.png"
  data-footer-text="Powered by Aioraa"
  data-chat-button="#6f5cff"
  data-chat-header="#6f5cff"
  data-user-bubble="#33334d"
  data-bot-bubble="#6f5cff"
  data-footer-bg="#1e1e2f"
  data-chat-bg="#1b1b2a"
  data-input-bg="#2a2a3f"
  data-input-color="#ffffff"
  data-send-button="#6f5cff"
  data-send-hover="#5648d4"
  data-choice-bg="#5c4dff"
  data-choice-color="#ffffff"
  data-choice-hover="#4a3dcf"
  data-enable-typing="true"
  data-auto-welcome="true"
  data-chat-widget
></script>


Only data-webhook is required. Other attributes are optional — defaults are used when absent.

Attributes

data-webhook — (required) URL to POST user messages

data-assistant-name — Assistant name in header

data-assistant-avatar — Optional avatar URL

data-footer-text — Optional footer text

data-enable-typing — true/false (typing animation)

data-auto-welcome — true/false (auto welcome message on open)

Colors (hex values, optional):
data-chat-button, data-chat-header, data-user-bubble, data-bot-bubble, data-footer-bg, data-chat-bg, data-input-bg, data-input-color, data-send-button, data-send-hover, data-choice-bg, data-choice-color, data-choice-hover.

Webhook Format

Request payload (POST):

{
  "message": "User typed or clicked option text",
  "timestamp": 1690000000000,
  "chatId": "sid_xxxxxx"
}


Response format:

{
  "reply": "How can I help you?",
  "choices": ["Pricing", "Features", "Contact"]
}


choices or buttons array will show clickable buttons below bot message.

Optional Behaviours

Auto welcome: data-auto-welcome="true" triggers one-time webhook call on session start.

Choice buttons: choices or buttons returned by webhook are automatically rendered.

No webhook: If data-webhook is missing, widget still loads but shows info message on send attempt.

Tips & Recommendations

Test with a mock webhook (Postman, webhook.site, or n8n) first.

Check DevTools → Network to debug POST requests and responses.

Serve script.js via HTTPS for security.

Minify JS for production to improve loading speed.

Troubleshooting

Widget not loading: Check data-chat-widget attribute and correct script URL.

No responses: Confirm data-webhook returns valid JSON with reply.

Colors not applied: Ensure all color attributes use proper hex codes.

Next Steps (Optional)

Add analytics for opens, sends, choice clicks

Support custom CSS overrides

Implement rate-limiting / queuing on high-traffic sites

Build admin panel to generate per-client <script> tags

License & Credits

You own and can rebrand the widget.

Consider adding terms of service or license for clients.
