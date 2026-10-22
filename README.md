# 🛡️ PhishGuard AI

A browser-based cybersecurity awareness tool that helps users identify phishing messages and suspicious URLs using rule-based pattern analysis. Everything runs entirely in the browser — no server, no backend, no external API calls, and no data ever leaves the user's device.

---

## Features

### 📧 Phishing Message Analyzer
- Paste any email, SMS, or chat message for instant analysis
- 13 detection rules covering urgency language, credential harvesting, prize scams, impersonation, secrecy instructions, suspicious links, and more
- Produces a **Risk Score (0–100)** with a Low / Medium / High label
- Displays an animated score bar and individual warning cards for each matched rule, each with a plain-language explanation
- 4 built-in sample phishing messages (Bank Alert, Prize Winner, IT Support, Delivery) for demonstration

### 🔗 Suspicious URL Checker
- Inspects the **structure** of a URL without ever opening or visiting it
- 10 detection rules: high-risk TLDs (.xyz, .tk, .ml, etc.), IP-as-host, brand-in-subdomain spoofing, deceptive security keywords, excessive subdomains, URL shorteners, HTTP without HTTPS, suspicious query parameters, long URLs, hyphenated domain names
- Displays the parsed domain alongside the risk score and warning cards
- Accepts input with or without the `https://` prefix

### 🧠 Cybersecurity Awareness Quiz
- 8 multiple-choice questions covering phishing concepts, URL anatomy, homograph attacks, safe practices, and social engineering tactics
- Instant per-question feedback with correct/incorrect highlighting and a detailed explanation
- Live progress bar and running score counter
- Final result with a grade label (Cybersecurity Expert / Security Aware / Learning in Progress / Needs Improvement)
- "Retake Quiz" button to restart without page reload

### Design
- Dark navy and cyan dashboard (`#0a0f1e` background, `#00d4ff` accent)
- Fully responsive — works on desktop and mobile
- Animated hero shield with floating and pulsing ring effects
- No external fonts, no CDN, no third-party assets

---

## Technologies Used

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic elements) |
| Styling | CSS3 (custom properties, flexbox, CSS animations, media queries) |
| Logic | Vanilla JavaScript (ES6+, regex, `URL` API) |
| Runtime | Any modern web browser |
| Dependencies | **None** |

---

## Project Structure

```
PhishGuard-AI/
├── index.html        # Page markup — navbar, hero, analyzer, URL checker, quiz, footer
├── style.css         # All styles — design tokens, layout, components, animations
├── script.js         # All logic — detection rules, scoring engine, quiz state machine
├── README.md         # This file
├── requirements.txt  # Dependency manifest (none required)
└── PROJECT_REPORT.md # Full student project report
```

---

## Setup Instructions

No installation, build step, or internet connection is required.

### Option 1 — Open directly in a browser (simplest)
1. Download or clone this repository to your computer.
2. Open the `PhishGuard-AI` folder in File Explorer (Windows) or Finder (macOS).
3. Double-click `index.html`.
4. The website opens in your default browser immediately.

### Option 2 — VS Code Live Server (recommended for development)
1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Install the **Live Server** extension by Ritwick Dey.
3. Open the project folder in VS Code.
4. Right-click `index.html` → **Open with Live Server**.
5. The site opens at `http://127.0.0.1:5500` and auto-reloads on save.

### Option 3 — Python built-in HTTP server
```bash
# Python 3
python -m http.server 8080
```
Then open `http://localhost:8080` in your browser.

---

## Usage Instructions

### Testing the Message Analyzer
1. Scroll to the **Phishing Message Analyzer** section.
2. Either paste your own message into the text area, or click one of the sample buttons (🏦 Bank Alert, 🎁 Prize Winner, 💻 IT Support, 📦 Delivery).
3. Click **Analyze Message**.
4. Review the Risk Score, the coloured badge (Low / Medium / High), the animated score bar, and the individual warning cards below.
5. Click **Clear** to reset.

### Testing the URL Checker
1. Scroll to the **Suspicious URL Checker** section.
2. Type or paste a URL into the input field (e.g. `http://hdfc.secure-login.xyz/verify?token=ABC`).
3. Click **Check URL** (or press **Enter**).
4. Review the detected indicators. The parsed domain is shown for reference.
5. The URL is **never opened or fetched** — only its text is parsed.

### Testing the Quiz
1. Scroll to the **Cybersecurity Awareness Quiz** section.
2. Click **Start Quiz**.
3. Select an answer for each question; instant feedback and an explanation appear after each selection.
4. After 8 questions, a final score and grade are displayed.
5. Click **Retake Quiz** to try again.

---

## Limitations

- **Rule-based detection only.** The analyzer uses regular expressions and heuristic rules. It does not use a machine-learning model, neural network, or any external intelligence feed.
- **No real-time threat intelligence.** Domain reputation, WHOIS data, and threat databases are not consulted.
- **No file or attachment scanning.** Only text messages and URL strings can be analyzed.
- **English-language rules only.** Phishing messages in other languages will not match most rules.
- **False positives are possible.** Legitimate messages or URLs may occasionally trigger one or more rules.
- **False negatives are possible.** Sophisticated phishing attempts not matching any rule will not be flagged.
- **No persistent storage.** No history of past analyses is saved between sessions.

---

## Privacy

All analysis runs entirely client-side in the browser using JavaScript.  
No message content, URL, or any user data is transmitted to any server or third-party service.

---

## License

This project was created as a college academic submission. You may use and adapt it for educational purposes.
