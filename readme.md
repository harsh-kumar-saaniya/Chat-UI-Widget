# Chat Widget (HTML + CSS + JavaScript)

A lightweight, fast, and fully embeddable chat widget built using **HTML, CSS, and JavaScript**. This widget is designed to connect with **N8N chatbot workflows** using simple API calls.

This README explains:

* How to use the widget
* How to install it on any website
* How to connect it to your N8N chatbot
* What files are required
* What parameters you can configure

---

## 📁 Folder Structure

```
/your-widget-folder
│── index.html
│── style.css
│── widget.js
```

* `index.html` → Main chat widget structure
* `style.css` → Widget styling (light/dark theme, animations)
* `widget.js` → Chat logic, API calls, typing animation, toggle functions

---

## ⭐ Features

* Floating chat bubble
* Expandable chat window
* Typing animation
* Dark & light theme
* Send/receive messages
* Fully compatible with N8N workflows
* Very easy to embed on any website
* No React, no framework, no installation needed

---

## 🚀 How to Use the Chat Widget

You can embed this widget into **any client website** by adding just **one script tag**.

### **Step 1 — Upload your widget files to GitHub Pages**

Make sure your widget JS & CSS files are hosted on GitHub Pages.
Example URLs:

```
https://yourname.github.io/widget/style.css
https://yourname.github.io/widget/widget.js
```

---

## 🧩 Step 2 — Add this code to client website

Add this inside the client's `index.html` (before `</body>`):

```html
<!-- Chat Widget Loader -->
<link rel="stylesheet" href="YOUR_GITHUB_CSS_URL_HERE">
<script src="YOUR_GITHUB_JS_URL_HERE" defer></script>
```

Example:

```html
<link rel="stylesheet" href="https://yourname.github.io/widget/style.css">
<script src="https://yourname.github.io/widget/widget.js" defer></script>
```

That's it.
The chat widget will automatically appear in the bottom‑right corner of the website.

---

## 🔗 Step 3 — Connect to N8N API

Edit the API URL inside `widget.js`:

```js
const API_URL = "YOUR_N8N_WEBHOOK_URL";
```

When a user sends a message, the widget sends this body:

```json
{
  "message": "User message here",
  "sessionId": "unique user session"
}
```

And expects this response from N8N:

```json
{
  "reply": "Your bot response here"
}
```

---

## ⚙️ Optional Parameters (Configure in widget.js)

You can adjust these settings:

### 1. **Widget Position**

```js
const WIDGET_POSITION = "right"; // left or right
```

### 2. **Theme**

```js
const THEME = "dark"; // light or dark
```

### 3. **Bot Name**

```js
const BOT_NAME = "AI Assistant";
```

### 4. **Typing Delay**

```js
const TYPING_DELAY = 600; // milliseconds
```

---

## 📌 How Your Clients Will Use It

You simply give them:

* 1 script tag
* 1 stylesheet link
* Your N8N API URL (optional)

Example:

```html
<link rel="stylesheet" href="https://yourname.github.io/widget/style.css">
<script src="https://yourname.github.io/widget/widget.js" defer></script>
```

They paste this into any website:

* WordPress
* Shopify
* HTML sites
* PHP sites

Widget works automatically.

---

## 🎯 Notes for Production

* Host on **GitHub Pages** (free)
* Minify CSS & JS for speed
* Use HTTPS N8N webhook URL
* Don't expose secret keys
* Add rate limiting in N8N for protection

---

## ❤️ Credits

Built for **Harish (Vithal)** for AI Automation Agency.
Perfect for embedding on multiple client websites.

---

If you need help customizing the widget or converting it to React later, you can ask anytime.
