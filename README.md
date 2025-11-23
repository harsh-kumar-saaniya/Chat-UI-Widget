# AI Aura — Plug & Play Chat Widget Simple, professional, configurable chat widget you can embed with a single <script> tag. Configure entirely via data- attributes on the script tag — no JS editing required. --- ## What this widget does * Floating chat button + chat panel * Dark theme by default (fully customisable) * Optional assistant name & avatar * Optional footer branding text * Typing animation (optional) * Choice / menu buttons support (buttons returned by webhook) * Sends user messages to your webhook (n8n, serverless function, etc.) and displays JSON replies * Minimal, lightweight, easy to host --- ## Quick start (3 steps) 1. **Host chat-widget.js** on a public URL (GitHub Pages, Netlify, Vercel, S3, your server). 2. **Add one <script> tag** to the client website (example below). 3. **Set data-webhook** to point at your webhook that will process messages and return JSON responses. ### Example embed (copy to client site)
html
<script
  src="https://yourserver.com/chat-widget.js"
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
> Only data-webhook is required for full functionality — other attributes are optional and default values will be used when absent. --- ## Attributes (all optional except webhook) * data-webhook — **(required)** URL to which the widget POSTs user messages. * data-assistant-name — Display name in the header (default: AI Assistant). * data-assistant-avatar — URL of avatar image (optional). If omitted, avatar is hidden. * data-footer-text — Footer / branding text (optional). Leave empty to hide. * data-enable-typing — true / false — enable or disable typing animation (default true). * data-auto-welcome — true / false — when true, the widget calls the webhook on open with event: 'session_start' and displays the response as a welcome message. **Theme / colors** * data-chat-button — floating button color * data-chat-header — header color * data-user-bubble — user message bubble * data-bot-bubble — bot message bubble * data-footer-bg — footer background * data-chat-bg — chat background * data-input-bg — input background * data-input-color — input text color * data-send-button — send button color * data-send-hover — send button hover color * data-choice-bg — choice button background * data-choice-color — choice button text color * data-choice-hover — choice button hover All colors accept hex values (e.g. #ff6600). --- ## Webhook payload (what the widget sends) The widget sends a POST request with JSON. Default payload structure:
json
{
  "message": "User typed or clicked option text",
  "timestamp": 1690000000000,
  "chatId": "sid_xxxxxx"
}
* chatId is stored in sessionStorage to keep messages in the same session. --- ## Webhook response (recommended format) Return JSON. The widget looks for these fields (in order): reply, message, output for the main text; choices or buttons for menu options. Example response:
json
{
  "reply": "How can I help you?",
  "choices": ["Pricing", "Features", "Contact"]
}
* If choices is present (array of strings), the widget renders clickable buttons below the bot message. Clicking a button sends that text as a user message to the webhook. --- ## Optional behaviours * **Auto welcome**: data-auto-welcome="true" triggers a one-time webhook call with { event: 'session_start', chatId, timestamp }. Use this to return a welcome message and initial choices. * **Choice buttons**: The webhook can return choices (array) or buttons (array). The widget supports both. * **No webhook**: If data-webhook is missing, the widget still loads and shows a small informational message when a send is attempted. --- ## Testing tips * Use a mock webhook (Postman mock, webhook.site, or n8n) that returns the sample JSON to test UI. * Open DevTools → Network to inspect POST requests and responses. * Test data-auto-welcome to confirm welcome behaviour. --- ## Hosting recommendations * Serve chat-widget.js from a fast static host or CDN. * GitHub Pages / Netlify / Vercel / S3 + CloudFront are good options. * Use HTTPS for both the widget and the webhook. * Keep the file minified for production. --- ## Security & privacy notes * The widget sends user-provided messages to whatever data-webhook URL is configured — ensure your webhook sanitizes, logs, and protects user data appropriately. * Use HTTPS endpoints only. * Do not store sensitive personal data in plain text unless necessary and compliant with local laws. --- ## Troubleshooting * **Widget not loading**: Confirm the <script> tag has the data-chat-widget attribute and src is correct. * **No responses**: Check data-webhook is correct and returns valid JSON with reply field. * **Colors not applied**: Ensure color attributes are valid hex codes. --- ## Next steps (suggestions) * Add analytics hooks (track opens, sends, choice clicks) for billing or metrics. * Add support for custom CSS override for advanced clients. * Add rate-limiting / queuing on the backend for high-traffic sites. * Build a small admin panel to generate per-client <script> tags automatically. --- ## License & credits * You own the widget and can rebrand or white-label it. Consider adding a simple license or terms of service for clients. ---
