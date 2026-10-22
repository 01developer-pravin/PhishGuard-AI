# PROJECT REPORT

---

## PhishGuard AI: A Browser-Based Phishing Detection and Cybersecurity Awareness Tool

---

| Field | Details |
|---|---|
| **Bhil Pravin** | [Your Name] |
| **24156600010020** | [Your Roll Number] |
| **BCA** | [e.g., B.Sc. Computer Science / BCA / B.Tech CSE] |
| **Cybersecurity** | [e.g., Web Technology / Internet Security / Mini Project] |
| **Monark University** | [Your College Name] |
| **Himanshu Souda** | [Guide's Name and Designation] |
| **22/10/2026** | [DD Month YYYY] |
| **2026–2027** | [e.g., 2024–2025] |

---

## Table of Contents

1. Abstract
2. Problem Statement
3. Objectives
4. Proposed Solution
5. Technologies Used
6. System Design
7. Implementation
8. Features
9. Testing
10. Limitations
11. Future Enhancements
12. Conclusion
13. References

---

## 1. Abstract

Phishing is one of the most prevalent forms of cybercrime, targeting individuals through deceptive emails, SMS messages, and fraudulent websites. Despite widespread awareness campaigns, phishing attacks continue to succeed because they exploit urgency, impersonation, and trust rather than technical vulnerabilities.

This project, **PhishGuard AI**, is a fully client-side web application that helps users identify phishing messages and suspicious URLs before acting on them. The tool uses a rule-based pattern-matching engine implemented in vanilla JavaScript to detect common phishing indicators in text messages (13 rules) and URL structures (10 rules). It produces a numerical risk score from 0 to 100, a categorical risk level (Low, Medium, or High), and plain-language explanations for every detected warning sign. The application also includes an 8-question cybersecurity awareness quiz with instant feedback to educate users on how phishing attacks work.

The entire application runs in the browser. No data is transmitted to any server. No external APIs, libraries, or paid services are used. The total cost of development and deployment is zero.

---

## 2. Problem Statement

Phishing attacks account for a large proportion of cybersecurity incidents globally. According to publicly available reports from organisations such as the Anti-Phishing Working Group (APWG), phishing volumes have increased consistently year over year. Victims of phishing lose money, personal data, and account access.

The core challenge is not a lack of information about phishing — it is that most people cannot consistently recognise phishing attempts in the moment when they receive them. Existing tools to verify suspicious messages or URLs either require technical knowledge, rely on cloud-based APIs that compromise privacy, or are unavailable to users without internet access or financial resources.

There is a need for a free, private, offline-capable tool that can:
- Analyse a suspicious message or URL and explain specifically why it is suspicious.
- Be used by anyone, regardless of technical background.
- Not require any account, payment, backend server, or internet connection.

---

## 3. Objectives

1. Build a phishing message analyser that identifies common textual indicators of phishing attempts.
2. Build a URL structure analyser that detects structural characteristics associated with phishing domains.
3. Produce a quantitative risk score (0–100) and a categorical label (Low / Medium / High) for each analysis.
4. Display human-readable explanations for every detected warning sign, educating the user as they use the tool.
5. Provide sample phishing messages so users can test the tool without needing to find real phishing content.
6. Include a cybersecurity awareness quiz to reinforce learning.
7. Ensure complete user privacy: no data leaves the browser.
8. Use only zero-cost, zero-dependency technologies (HTML, CSS, vanilla JavaScript).

---

## 4. Proposed Solution

PhishGuard AI is a single-page web application composed of three files: `index.html`, `style.css`, and `script.js`.

The solution approach is **rule-based heuristic analysis**. A curated set of detection rules — each implemented as a JavaScript function containing a regular expression or structural check — is evaluated against the user's input. Each rule that fires contributes a weighted score to the total risk score. The total is clamped to a maximum of 100 and mapped to a risk level.

This approach was chosen because:
- It requires no training data, no model weights, and no external service.
- Rules can be read, understood, and extended by any developer.
- It runs instantly with no latency.
- It is completely transparent — every firing rule is displayed to the user with an explanation.

The term "AI" in the project name refers to the automated intelligent analysis of patterns, consistent with how the term is used in many real-world tools. There is no neural network or machine-learning model in this implementation.

---

## 5. Technologies Used

| Technology | Version / Notes | Purpose |
|---|---|---|
| HTML5 | — | Page structure and semantic markup |
| CSS3 | Custom properties, Flexbox, Animations, Media Queries | Visual design, layout, responsive behaviour |
| JavaScript (ES6+) | Vanilla (no frameworks) | Detection engine, scoring, DOM manipulation, quiz state |
| WHATWG URL API | Built into all modern browsers | Parsing URL structure (hostname, protocol, pathname, search) |
| Browser RegExp | Built into JavaScript | Pattern matching for all detection rules |

**External dependencies: none.** No npm packages, no CDN-hosted libraries, no external fonts, no paid APIs.

---

## 6. System Design

### 6.1 Architecture

The application is a **single-page static website**. There is no server, no database, and no network request made during use.

```
User Input (message text or URL string)
        │
        ▼
┌─────────────────────────────┐
│   Detection Engine (JS)     │
│                             │
│  ┌──────────────────────┐   │
│  │   13 MSG_RULES       │   │  ← regex/keyword checks on message text
│  └──────────────────────┘   │
│  ┌──────────────────────┐   │
│  │   10 URL_RULES       │   │  ← structural checks on parsed URL object
│  └──────────────────────┘   │
│                             │
│  Score = Σ(matched rule     │
│            weights),        │
│            clamped to 100   │
└────────────┬────────────────┘
             │
             ▼
    Risk Level Classification
    score ≥ 60  → HIGH
    score ≥ 25  → MEDIUM
    score  < 25 → LOW
             │
             ▼
    Result Renderer (buildResultHTML)
    → Risk badge, score bar, warning cards
    → Displayed in DOM (no page reload)
```

### 6.2 Scoring Model

Each rule carries a weight (score) reflecting the severity of that indicator:

| Indicator Type | Severity | Weight |
|---|---|---|
| Credential request (PIN, OTP, password, Aadhaar) | High | 22 |
| Urgency language | High | 20 |
| Prize / lottery scam language | High | 20 |
| Suspicious TLD in message link | High | 20 |
| Impersonation of known brands | High | 18 |
| Account suspension threat | High | 18 |
| Free email for official communication | High | 16 |
| Secrecy instruction | High | 15 |
| Personal information request | Medium | 14 |
| Payment demand | Medium | 12 |
| Excessive capitalisation | Low | 8 |
| Generic greeting | Low | 6 |
| Tracking token in URL | Low | 5 |

URL rules follow the same principle with weights from 7 (hyphenated domain) to 25 (IP-as-host, high-risk TLD).

### 6.3 File Responsibilities

| File | Responsibility |
|---|---|
| `index.html` | Semantic HTML structure — navbar, hero section, message analyser section, URL checker section, quiz section, footer |
| `style.css` | Complete visual design — CSS custom properties (design tokens), layout (Flexbox), component styles, CSS animations (shield rings, float, fade-in), responsive breakpoint at 680px |
| `script.js` | All application logic — `SAMPLES` object, `MSG_RULES` array, `URL_RULES` array, `analyzeMessage()`, `analyzeURL()`, `buildResultHTML()`, quiz data (`QUIZ_QUESTIONS`), quiz state machine (`renderQuestion`, `handleAnswer`, `showQuizResult`) |

---

## 7. Implementation

### 7.1 Message Analysis Engine

The [`analyzeMessage(text)`](script.js) function iterates over the `MSG_RULES` array. Each rule object contains:
- `id` — unique identifier
- `severity` — `'high'`, `'medium'`, or `'low'`
- `score` — integer weight (5–22)
- `label` — short display name
- `detail` — plain-English explanation for the user
- `test(t)` — a function that accepts the message text and returns `true` if the rule fires

The raw score is the sum of all matching rule weights, clamped to 100. The risk level is determined by threshold comparison.

**Example rule — Credential Request (weight 22):**
```javascript
test: t => /\b(pin|otp|password|account\s+number|card\s+number|cvv|
             aadhaar|aadhar|date\s+of\s+birth|...)\b/i.test(t)
```

### 7.2 URL Analysis Engine

The [`analyzeURL(raw)`](script.js) function first parses the input string using the browser's built-in `new URL()` constructor, which safely decomposes the URL into `protocol`, `hostname`, `pathname`, and `search` components without making any network request. The `URL_RULES` array is then evaluated against the parsed URL object.

**Example rule — Brand in Subdomain (weight 22):**
```javascript
test: u => {
  const parts = u.hostname.split('.');
  const subdomain = parts.slice(0, -2).join('.');
  return /\b(hdfc|sbi|paypal|amazon|google|...)\b/i.test(subdomain);
}
```

This rule fires for a URL like `hdfc.secure-login.xyz` because `hdfc` is in the subdomain while `secure-login.xyz` is the actual registered domain.

### 7.3 Result Renderer

The [`buildResultHTML(score, level, findings, subtitle)`](script.js) function generates the result panel HTML as a string, which is injected into the result `<div>` using `innerHTML`. The score bar width is set via an inline `style` attribute and animated by a CSS transition, creating a smooth fill effect.

### 7.4 Quiz State Machine

The quiz is managed by a `quizState` object (`{ current, score, answered }`). The [`renderQuestion()`](script.js) function reads from the `QUIZ_QUESTIONS` array and dynamically creates option buttons. [`handleAnswer(selected)`](script.js) locks the options, highlights the correct answer in green and the wrong selection in red, displays the explanation, and unhides the Next button. [`showQuizResult()`](script.js) maps the final percentage to a grade label and message.

---

## 8. Features

| Feature | Description |
|---|---|
| Message Analyzer | Analyses pasted email, SMS, or chat text against 13 phishing detection rules |
| URL Checker | Analyses URL structure against 10 heuristic rules without visiting the URL |
| Risk Score | Numerical score 0–100 based on sum of matched rule weights |
| Risk Level | Categorical label: Low (0–24), Medium (25–59), High (60–100) |
| Warning Cards | One card per matched rule, showing the rule name and a plain-English explanation |
| Animated Score Bar | Colour-coded progress bar (green / amber / red) that animates to the score value |
| Sample Messages | 4 built-in phishing message samples covering common attack types |
| Cybersecurity Quiz | 8 MCQ questions with instant per-question feedback and final grade |
| Zero Data Transmission | No network requests; all analysis is in-memory JavaScript |
| Responsive Design | Works on desktop, tablet, and mobile screens |
| Dark Theme | Dark navy (`#0a0f1e`) and cyan (`#00d4ff`) colour scheme |

---

## 9. Testing

All tests were performed manually by loading `index.html` in a browser.

### 9.1 Message Analyzer Tests

| Test Input | Expected Risk | Expected Level | Result |
|---|---|---|---|
| Bank Alert sample (HDFC, urgent, PIN, .xyz link) | High (80+) | High 🚨 | ✅ Pass |
| Prize Winner sample (won, Aadhaar, gmail, caps) | High (80+) | High 🚨 | ✅ Pass |
| IT Support sample (password, urgent, account locked) | High (70+) | High 🚨 | ✅ Pass |
| Delivery sample (customs fee, .xyz, 24 hours, final notice) | High (60+) | High 🚨 | ✅ Pass |
| Normal message ("Hi, let's meet at 5pm") | 0 | Low ✅ | ✅ Pass |
| Empty input | No crash, prompt shown | — | ✅ Pass |

### 9.2 URL Checker Tests

| Test URL | Expected Level | Notable Flags | Result |
|---|---|---|---|
| `http://hdfc.secure-login.xyz/verify?token=ABC` | High 🚨 | .xyz TLD, brand in subdomain, HTTP, `secure`+`verify` in path, token param | ✅ Pass |
| `http://192.168.1.1/login` | High 🚨 | IP as host, HTTP | ✅ Pass |
| `https://bit.ly/3xABcD` | Medium ⚠️ | URL shortener | ✅ Pass |
| `https://amazon.in.orders.verify-now.xyz/login` | High 🚨 | .xyz TLD, brand in subdomain, `verify`+`login` keywords | ✅ Pass |
| `https://www.google.com` | Low ✅ | No indicators | ✅ Pass |
| `https://www.amazon.in/order/12345` | Low ✅ | No indicators | ✅ Pass |
| Empty input | No crash, prompt shown | — | ✅ Pass |
| Invalid string (e.g. `not a url!!`) | Error message shown | — | ✅ Pass |

### 9.3 Quiz Tests

| Scenario | Expected Behaviour | Result |
|---|---|---|
| Correct answer selected | Button turns green, explanation shown, Next appears | ✅ Pass |
| Incorrect answer selected | Selected button turns red, correct turns green, explanation shown | ✅ Pass |
| All 8 questions answered | Final score and grade displayed | ✅ Pass |
| Retake Quiz clicked | Quiz resets to Question 1, score resets to 0 | ✅ Pass |
| Score 8/8 | Grade: Cybersecurity Expert 🏆 | ✅ Pass |
| Score 0/8 | Grade: Needs Improvement ⚠️ | ✅ Pass |

### 9.4 Responsive Design Tests

| Screen Width | Layout | Result |
|---|---|---|
| 1280px (desktop) | Two-column hero, full navbar | ✅ Pass |
| 768px (tablet) | Single column, readable | ✅ Pass |
| 375px (mobile) | Stacked layout, smaller shield | ✅ Pass |

---

## 10. Limitations

1. **Rule-based, not machine-learning based.** The detection engine uses regular expressions and structural checks. It does not learn from new phishing patterns automatically and cannot adapt without a developer manually updating the rule set.

2. **No threat intelligence integration.** Domain reputation services (e.g. Google Safe Browsing, VirusTotal) are not consulted. A domain not matching any structural rule will not be flagged, even if it is known to be malicious.

3. **English-language rules only.** Phishing messages written in Hindi, Bengali, Tamil, or other languages will not match most rules in `MSG_RULES`.

4. **Text input only.** The tool cannot analyse images, PDF attachments, QR codes, or voice messages.

5. **False positives.** Legitimate messages that happen to use urgent language or contain the word "verify" may receive a non-zero risk score.

6. **False negatives.** A sophisticated phishing attempt designed to avoid common patterns (e.g. one that uses a freshly registered `.com` domain with no keywords) may score Low Risk.

7. **No history or persistence.** Results are lost when the page is closed or refreshed.

8. **Client-side only.** The tool cannot block or intercept phishing attempts; it is advisory only.

---

## 11. Future Enhancements

1. **Multilingual support** — Add Hindi and other regional language rule sets to detect phishing in Indian regional languages.

2. **Domain age and WHOIS lookup** — Integrate a free WHOIS API (with user consent) to check if a domain was registered recently, which is a strong phishing indicator.

3. **Machine-learning classifier** — Train a lightweight text classification model (e.g. using TensorFlow.js) on a labelled phishing dataset and run it entirely in the browser to supplement the rule engine.

4. **QR code scanner** — Allow users to upload a QR code image; extract the encoded URL and run it through the URL checker.

5. **Browser extension** — Package the URL checker as a Chrome/Firefox extension to analyse links in real time as the user browses.

6. **Analysis history** — Use the browser's `localStorage` API to save past analyses so users can review them later.

7. **Export report** — Allow users to download a PDF summary of the analysis result for a given message or URL.

8. **Expanded rule sets** — Continuously update rules based on new phishing campaign patterns published in public threat intelligence reports.

---

## 12. Conclusion

PhishGuard AI demonstrates that meaningful cybersecurity tooling can be built without any cost, without any backend infrastructure, and without sacrificing user privacy. By implementing a rule-based detection engine entirely in vanilla JavaScript, the project achieves its core objectives: helping ordinary users identify phishing messages and suspicious URLs, and educating them about the specific techniques attackers use.

The project highlights that a well-curated set of transparent, explainable rules can provide practical value while remaining fully auditable — every detection decision is visible to the user in the form of a warning card. This transparency is often absent in black-box commercial tools.

The cybersecurity quiz adds an educational dimension, transforming the tool from a passive analyser into an active learning resource. Together, the analyser and the quiz address both the reactive problem (is this message safe?) and the proactive one (how do I learn to recognise these attacks myself?).

While the rule-based approach has inherent limitations compared to machine-learning methods, it is appropriate for the scope of this project, is fully understandable without specialised knowledge, and provides a solid foundation for the future enhancements described above.

---

## 13. References

1. Anti-Phishing Working Group (APWG). *Phishing Activity Trends Reports*. [https://apwg.org/trendsreports/](https://apwg.org/trendsreports/)
2. Google. *How Google Safe Browsing Works*. [https://safebrowsing.google.com/](https://safebrowsing.google.com/)
3. WHATWG. *URL Living Standard*. [https://url.spec.whatwg.org/](https://url.spec.whatwg.org/)
4. Mozilla Developer Network. *Regular Expressions (JavaScript)*. [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)
5. CERT-In (Indian Computer Emergency Response Team). *Phishing Advisories*. [https://www.cert-in.org.in/](https://www.cert-in.org.in/)
6. OWASP Foundation. *Phishing Prevention Cheat Sheet*. [https://cheatsheetseries.owasp.org/](https://cheatsheetseries.owasp.org/)

---

*This report was prepared as part of an academic project submission. All analysis descriptions accurately reflect the implemented code.*
