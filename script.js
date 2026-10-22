/* ═══════════════════════════════════════════════════════════════
   PhishGuard AI — script.js
   100% browser-local. No data leaves this page. Ever.
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ── SAMPLE PHISHING MESSAGES ─────────────────────────────────────
const SAMPLES = {
  bank: `URGENT: Your HDFC Bank account has been temporarily suspended due to suspicious activity.
Your account will be permanently closed within 24 hours unless you verify your details IMMEDIATELY.
Click here to verify: http://hdfcbank-secure-login.xyz/verify?token=A9X2
Enter your account number, PIN, and OTP to restore access.
Failure to act NOW will result in permanent account closure. — HDFC Security Team`,

  prize: `Congratulations! You have been SELECTED as the winner of our ₹50,00,000 Lucky Draw!
Your mobile number was randomly chosen from 10 crore participants.
To CLAIM your prize IMMEDIATELY, provide your full name, bank account number, and Aadhaar number.
Send details to: prizewin.claim2024@gmail.com
Act FAST — offer expires in 12 hours! Do NOT share this with anyone.`,

  it: `Dear Employee,
IT Department Notice: We have detected unauthorized access attempts on your company email account.
Your password will expire in 2 hours. To avoid losing access, reset your password immediately:
http://company-it-reset.net/employee-portal/reset
Use your current username and password to log in, then follow the steps.
If you do not reset NOW, your account will be locked and HR will be notified. — IT Support Desk`,

  delivery: `Your package #IND-8823-XZ could not be delivered. A customs fee of ₹149 is pending.
Pay NOW to avoid return: http://indiapost-delivery.xyz/pay?ref=8823
Failure to pay within 24 HOURS will result in your package being destroyed.
This is your FINAL notice. — India Post Delivery Services`
};

// ── MESSAGE ANALYSIS ENGINE ──────────────────────────────────────

/*
  Each rule has:
    id        — unique string
    severity  — 'high' | 'medium' | 'low'
    score     — points added to risk score (1–25)
    label     — short name shown in badge
    detail    — explanation shown to user
    test(txt) — function returning true if the rule fires
*/
const MSG_RULES = [
  {
    id: 'urgency_words',
    severity: 'high',
    score: 20,
    label: 'Extreme Urgency Language',
    detail: 'Phrases like "URGENT", "IMMEDIATELY", "act NOW", "FINAL notice", or "within 24 hours" are classic pressure tactics used to prevent victims from thinking critically.',
    test: t => /\b(urgent|immediately|act\s+now|right\s+now|final\s+notice|within\s+\d+\s+hours?|expires?\s+in|act\s+fast|hurry|time\s+is\s+running|last\s+chance)\b/i.test(t)
  },
  {
    id: 'account_closure',
    severity: 'high',
    score: 18,
    label: 'Account Suspension / Closure Threat',
    detail: 'Threatening to close, suspend, or lock your account creates fear. Legitimate companies send formal notices through official channels and give adequate time to respond.',
    test: t => /\b(account\s+(will\s+be\s+)?(closed?|suspended?|locked?|terminated?|deactivated?)|permanently\s+(closed?|blocked?))\b/i.test(t)
  },
  {
    id: 'credential_request',
    severity: 'high',
    score: 22,
    label: 'Requests Sensitive Credentials',
    detail: 'Asking for your PIN, OTP, password, Aadhaar number, bank account number, or card details is a strong phishing indicator. No legitimate service will ever ask for these via message.',
    test: t => /\b(pin|otp|password|account\s+number|card\s+number|cvv|aadhaar|aadhar|date\s+of\s+birth|mother.?s\s+maiden|social\s+security|ssn)\b/i.test(t)
  },
  {
    id: 'suspicious_link',
    severity: 'high',
    score: 20,
    label: 'Suspicious or Non-Official URL',
    detail: 'The message contains a link pointing to a non-official domain (e.g. "hdfc-secure.xyz" instead of "hdfcbank.com"). Always check that URLs belong to the official website before clicking.',
    test: t => /https?:\/\/[^\s]*(?:\.xyz|\.top|\.click|\.tk|\.ml|\.cf|\.ga|\.gq|bit\.ly|tinyurl|goo\.gl|t\.co\/[0-9a-z]{5,})[^\s]*/i.test(t)
  },
  {
    id: 'unofficial_email',
    severity: 'high',
    score: 16,
    label: 'Free Email Used for Official Communication',
    detail: 'Legitimate companies like banks, couriers, or employers communicate from official domains (e.g. @hdfcbank.com), not free services like @gmail.com or @yahoo.com.',
    test: t => /@(gmail|yahoo|hotmail|outlook|ymail|rediffmail)\.com/i.test(t)
  },
  {
    id: 'prize_lottery',
    severity: 'high',
    score: 20,
    label: 'Unsolicited Prize / Lottery Scam',
    detail: '"You have won" or "selected as winner" messages you never entered are a universally recognised scam. Real lotteries do not contact winners via random SMS or email.',
    test: t => /\b(you\s+(have\s+)?(won|been\s+selected|are\s+the\s+winner)|congratulations.{0,30}winner|lucky\s+draw|prize\s+(winner|money|claim)|claim\s+your\s+prize)\b/i.test(t)
  },
  {
    id: 'secrecy_instruction',
    severity: 'high',
    score: 15,
    label: 'Secrecy / "Do Not Share" Instruction',
    detail: 'Instructing you to keep the message secret or not share it with anyone is a major red flag — legitimate organisations never ask this.',
    test: t => /\b(do\s+not\s+share|don.?t\s+tell|keep\s+this\s+(secret|confidential)|not\s+share\s+this\s+with|confidential)\b/i.test(t)
  },
  {
    id: 'impersonation',
    severity: 'high',
    score: 18,
    label: 'Brand / Authority Impersonation',
    detail: 'The message impersonates a well-known institution (bank, government body, delivery service, IT department). Always verify through official numbers listed on the company\'s real website.',
    test: t => /\b(hdfc|sbi|icici|axis|kotak|india\s+post|ubi|pnb|rbi\s+bank|it\s+department|hr\s+department|irs|amazon|flipkart|paytm|google|microsoft\s+support)\b/i.test(t)
  },
  {
    id: 'personal_info_request',
    severity: 'medium',
    score: 14,
    label: 'Requests Personal Information',
    detail: 'The message asks for personal details such as your full name, address, date of birth, or identity documents. Phishers aggregate this data for identity theft.',
    test: t => /\b(provide\s+(your\s+)?(full\s+name|address|details?|information)|send\s+(your|us|me)\s+(your\s+)?(name|details?|info|documents?)|share\s+your\s+(details?|info))\b/i.test(t)
  },
  {
    id: 'payment_demand',
    severity: 'medium',
    score: 12,
    label: 'Unexpected Payment Demand',
    detail: 'An unexpected request to pay a fee to receive a prize, unblock an account, or release a delivery is a common fraud technique.',
    test: t => /\b(pay\s+(now|immediately|₹|rs\.?\s*\d+|a\s+fee)|customs\s+fee|processing\s+fee|release\s+fee|small\s+fee)\b/i.test(t)
  },
  {
    id: 'all_caps_words',
    severity: 'low',
    score: 8,
    label: 'Excessive Capitalisation',
    detail: 'Multiple ALL-CAPS words in a message are used to simulate urgency and alarm. It is a common manipulation technique in phishing messages.',
    test: t => (t.match(/\b[A-Z]{4,}\b/g) || []).length >= 3
  },
  {
    id: 'generic_greeting',
    severity: 'low',
    score: 6,
    label: 'Generic / No Personalisation',
    detail: 'Greetings like "Dear Customer", "Dear User", or "Dear Employee" without your actual name suggest a mass-sent phishing campaign.',
    test: t => /\b(dear\s+(customer|user|account\s+holder|client|valued|employee)|hi\s+there|hello\s+user)\b/i.test(t)
  },
  {
    id: 'unusual_characters',
    severity: 'low',
    score: 5,
    label: 'Unusual Characters / Token in URL',
    detail: 'URLs containing random-looking tokens (e.g. ?token=A9X2, ?ref=XYZ) may indicate auto-generated phishing links designed to track individual victims.',
    test: t => /https?:\/\/[^\s]*\?[^\s]*(token|ref|verify|key|id|code)=[^\s&]{4,}/i.test(t)
  }
];

function analyzeMessage(text) {
  const findings = [];
  let rawScore = 0;

  for (const rule of MSG_RULES) {
    if (rule.test(text)) {
      findings.push(rule);
      rawScore += rule.score;
    }
  }

  const score = Math.min(100, rawScore);
  const level = score >= 60 ? 'high' : score >= 25 ? 'medium' : 'low';
  return { score, level, findings };
}

// ── URL ANALYSIS ENGINE ──────────────────────────────────────────

const URL_RULES = [
  {
    id: 'suspicious_tld',
    severity: 'high',
    score: 25,
    label: 'High-Risk Top-Level Domain',
    detail: 'Domains ending in .xyz, .top, .click, .tk, .ml, .cf, .ga, or .gq are overwhelmingly used in phishing campaigns due to their low cost or free availability.',
    test: u => /\.(xyz|top|click|tk|ml|cf|ga|gq|buzz|rest|icu|vip|win|loan|work|live)\b/i.test(u.hostname || u)
  },
  {
    id: 'ip_as_host',
    severity: 'high',
    score: 25,
    label: 'IP Address Used Instead of Domain',
    detail: 'Using a raw IP address (e.g. http://192.168.1.1/login) instead of a domain name is a major phishing indicator. Legitimate services always use named domains.',
    test: u => /^(\d{1,3}\.){3}\d{1,3}$/.test(u.hostname || '')
  },
  {
    id: 'brand_in_subdomain',
    severity: 'high',
    score: 22,
    label: 'Brand Name Used in Subdomain (Spoofing)',
    detail: 'Placing a trusted brand\'s name in the subdomain (e.g. hdfc.evil.com) tricks users into thinking they\'re on an official site. The real domain is what appears before the final extension.',
    test: u => {
      const host = u.hostname || '';
      const parts = host.split('.');
      if (parts.length < 3) return false;
      const subdomain = parts.slice(0, -2).join('.');
      return /\b(hdfc|sbi|icici|paypal|amazon|google|microsoft|apple|facebook|instagram|netflix|flipkart|paytm|uber|swiggy|zomato|ola|cred)\b/i.test(subdomain);
    }
  },
  {
    id: 'misleading_keyword',
    severity: 'high',
    score: 20,
    label: 'Deceptive Security Keywords in URL',
    detail: 'Words like "secure", "login", "verify", "update", "account", or "confirm" in a non-official domain are placed there deliberately to look trustworthy.',
    test: u => {
      const full = (u.hostname || '') + (u.pathname || '');
      return /\b(secure|login|verify|update|confirm|account|banking|signin|password|reset|auth)\b/i.test(full);
    }
  },
  {
    id: 'too_many_subdomains',
    severity: 'medium',
    score: 15,
    label: 'Excessive Subdomains',
    detail: 'A URL with 3 or more subdomain levels (e.g. login.secure.bank.evil.com) is a common obfuscation tactic to make the URL appear legitimate at a glance.',
    test: u => (u.hostname || '').split('.').length >= 5
  },
  {
    id: 'url_shortener',
    severity: 'medium',
    score: 15,
    label: 'URL Shortener Used',
    detail: 'Shortened URLs (bit.ly, tinyurl.com, t.co, etc.) hide the real destination. This is frequently exploited in phishing to mask the true malicious URL.',
    test: u => /\b(bit\.ly|tinyurl\.com|goo\.gl|t\.co|ow\.ly|short\.link|rebrand\.ly|cutt\.ly|buff\.ly)\b/i.test(u.hostname || '')
  },
  {
    id: 'http_not_https',
    severity: 'medium',
    score: 12,
    label: 'Insecure HTTP (Not HTTPS)',
    detail: 'Legitimate login or payment pages always use HTTPS. An HTTP URL for any sensitive operation is a significant security warning.',
    test: u => u.protocol === 'http:'
  },
  {
    id: 'suspicious_path_params',
    severity: 'medium',
    score: 10,
    label: 'Suspicious Query Parameters',
    detail: 'Query strings containing "verify", "token", "confirm", or "key" may indicate a targeted phishing link designed to pre-fill victim details.',
    test: u => /[?&](verify|token|confirm|key|code|ref|track|id)=/i.test(u.search || '')
  },
  {
    id: 'long_url',
    severity: 'low',
    score: 8,
    label: 'Unusually Long URL',
    detail: 'Excessively long URLs (over 100 characters) are sometimes crafted to obscure the true domain or confuse URL-preview tools.',
    test: u => (u.href || '').length > 100
  },
  {
    id: 'hyphen_in_domain',
    severity: 'low',
    score: 7,
    label: 'Multiple Hyphens in Domain Name',
    detail: 'Domains like "hdfc-bank-secure-login.com" use hyphens to pack in trustworthy-sounding words. Legitimate institutions rarely use hyphenated domains.',
    test: u => (u.hostname || '').split('.')[0].includes('-')
  }
];

function analyzeURL(raw) {
  // Clean and parse
  let url;
  const trimmed = raw.trim();
  try {
    url = new URL(trimmed.startsWith('http') ? trimmed : 'https://' + trimmed);
  } catch {
    return { error: 'Could not parse that as a URL. Make sure it starts with http:// or https://' };
  }

  const findings = [];
  let rawScore = 0;

  for (const rule of URL_RULES) {
    if (rule.test(url)) {
      findings.push(rule);
      rawScore += rule.score;
    }
  }

  const score = Math.min(100, rawScore);
  const level = score >= 55 ? 'high' : score >= 20 ? 'medium' : 'low';
  return { score, level, findings, parsedHost: url.hostname };
}

// ── RESULT RENDERER ──────────────────────────────────────────────

function buildResultHTML(score, level, findings, subtitle) {
  const levelEmoji = { low: '✅', medium: '⚠️', high: '🚨' };
  const levelLabel = { low: 'Low Risk', medium: 'Medium Risk', high: 'High Risk' };
  const scoreColor = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };

  let html = `
    <div class="risk-header">
      <div class="risk-label-wrap">
        <span class="risk-badge ${level}">${levelEmoji[level]} ${levelLabel[level]}</span>
        ${subtitle ? `<span style="font-size:0.82rem;color:var(--text-muted)">${subtitle}</span>` : ''}
      </div>
      <div class="risk-score-wrap">
        <div class="risk-score-num" style="color:${scoreColor[level]}">${score}</div>
        <div class="risk-score-label">Risk Score / 100</div>
      </div>
    </div>
    <div class="score-bar-track">
      <div class="score-bar-fill ${level}" style="width:${score}%"></div>
    </div>`;

  if (findings.length === 0) {
    html += `<div class="no-threats">✅ No significant phishing indicators detected. Always stay cautious.</div>`;
  } else {
    html += `<div class="warnings-title">⚠️ Detected Warning Signs (${findings.length})</div>
             <div class="warnings-list">`;
    for (const f of findings) {
      const icons = { high: '🔴', medium: '🟡', low: '🔵' };
      html += `
        <div class="warning-card severity-${f.severity}">
          <span class="warning-icon">${icons[f.severity]}</span>
          <div class="warning-text">
            ${f.label}
            <strong>${f.detail}</strong>
          </div>
        </div>`;
    }
    html += `</div>`;
  }

  return html;
}

function showResult(panelEl, html) {
  panelEl.innerHTML = html;
  panelEl.classList.remove('hidden');
  panelEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── MESSAGE ANALYZER DOM ─────────────────────────────────────────

const msgInput      = document.getElementById('msg-input');
const msgAnalyzeBtn = document.getElementById('msg-analyze-btn');
const msgClearBtn   = document.getElementById('msg-clear-btn');
const msgResult     = document.getElementById('msg-result');

document.querySelectorAll('.sample-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.sample;
    if (SAMPLES[key]) {
      msgInput.value = SAMPLES[key];
      msgResult.classList.add('hidden');
    }
  });
});

msgAnalyzeBtn.addEventListener('click', () => {
  const text = msgInput.value.trim();
  if (!text) {
    msgResult.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem">Please enter a message to analyze.</p>';
    msgResult.classList.remove('hidden');
    return;
  }
  const { score, level, findings } = analyzeMessage(text);
  showResult(msgResult, buildResultHTML(score, level, findings));
});

msgClearBtn.addEventListener('click', () => {
  msgInput.value = '';
  msgResult.classList.add('hidden');
});

// ── URL CHECKER DOM ──────────────────────────────────────────────

const urlInput      = document.getElementById('url-input');
const urlAnalyzeBtn = document.getElementById('url-analyze-btn');
const urlClearBtn   = document.getElementById('url-clear-btn');
const urlResult     = document.getElementById('url-result');

urlAnalyzeBtn.addEventListener('click', () => {
  const raw = urlInput.value.trim();
  if (!raw) {
    urlResult.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem">Please enter a URL to check.</p>';
    urlResult.classList.remove('hidden');
    return;
  }

  const result = analyzeURL(raw);

  if (result.error) {
    urlResult.innerHTML = `<p style="color:var(--red);font-size:0.9rem">❌ ${result.error}</p>`;
    urlResult.classList.remove('hidden');
    return;
  }

  const subtitle = result.parsedHost ? `Domain: <code style="color:var(--cyan)">${result.parsedHost}</code>` : '';
  showResult(urlResult, buildResultHTML(result.score, result.level, result.findings, subtitle));
});

urlClearBtn.addEventListener('click', () => {
  urlInput.value = '';
  urlResult.classList.add('hidden');
});

// Allow Enter key in URL input
urlInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') urlAnalyzeBtn.click();
});

// ── QUIZ ENGINE ──────────────────────────────────────────────────

const QUIZ_QUESTIONS = [
  {
    q: 'You receive an SMS: "Your bank account is suspended. Click http://sbi-secure.xyz/login to restore access." What do you do?',
    options: [
      'Click the link and log in immediately to avoid suspension',
      'Call the number in the SMS to verify',
      'Ignore the SMS and call the bank\'s official number printed on your card',
      'Forward the SMS to your friends as a warning'
    ],
    answer: 2,
    explanation: 'Always verify account issues by calling the official number on the back of your card or the bank\'s official website — never through links or numbers in suspicious messages.'
  },
  {
    q: 'What is the most reliable way to identify the real owner of a website like "hdfc.secure-login.net"?',
    options: [
      'Look for a padlock icon — any HTTPS site is safe',
      'Check if the word "HDFC" appears in the URL',
      'Look at the domain just before the last dot + extension: "secure-login.net" is the real owner',
      'Call the number on the webpage'
    ],
    answer: 2,
    explanation: 'The registrable domain — the part just before the TLD (.net, .com) — is the true owner. "hdfc" here is just a subdomain. "secure-login.net" owns this URL, not HDFC bank.'
  },
  {
    q: 'A message says "Congratulations! You\'ve won ₹10,00,000. Send your Aadhaar and bank account number to claim." This is:',
    options: [
      'Likely real — the government runs many such schemes',
      'Definitely a phishing/fraud attempt — no legitimate lottery asks for bank details via message',
      'Probably real if it came via SMS',
      'Real if it mentions your full name'
    ],
    answer: 1,
    explanation: 'Legitimate prize schemes never ask winners to provide sensitive financial details via SMS, email, or chat. This is a classic advance-fee or identity theft scam.'
  },
  {
    q: 'Which URL is MOST suspicious?',
    options: [
      'https://www.amazon.in/order/12345',
      'https://amazon.in.orders.verify-now.xyz/login',
      'https://seller.amazon.in/dashboard',
      'https://pay.amazon.in/checkout'
    ],
    answer: 1,
    explanation: '"amazon.in" here is a subdomain of "verify-now.xyz" — an attacker-controlled domain. The real Amazon would only use URLs that end in amazon.in or amazon.com.'
  },
  {
    q: 'What does "phishing" mean in cybersecurity?',
    options: [
      'A type of malware that encrypts your files and demands a ransom',
      'An attempt to trick you into revealing sensitive information by pretending to be a trusted entity',
      'A technique to crack Wi-Fi passwords',
      'Flooding a server with requests to take it offline'
    ],
    answer: 1,
    explanation: 'Phishing is social engineering — attackers impersonate trusted organisations (banks, couriers, employers) to steal credentials, money, or identity documents.'
  },
  {
    q: 'You get an email from "support@paypa1.com" asking you to confirm your PayPal password. What is the red flag?',
    options: [
      'Support emails are always suspicious',
      'The domain is "paypa1.com" — a "1" is used instead of the letter "l" (homograph attack)',
      'PayPal never sends emails',
      'The word "confirm" is suspicious'
    ],
    answer: 1,
    explanation: 'Homograph attacks replace characters with visually similar ones (l → 1, o → 0, rn → m). Always read email domains character by character before clicking any link.'
  },
  {
    q: 'Which of these is a SAFE practice when you receive a suspicious link?',
    options: [
      'Open it in Incognito mode — it can\'t track you there',
      'Copy the link and paste it into Google Translate to open it safely',
      'Do not open it at all; report it and check the official website directly',
      'Open it on your phone instead of your computer'
    ],
    answer: 2,
    explanation: 'None of the alternatives (Incognito, Translate, phone) protect against phishing or malware. The only safe action is to not open the link and navigate to the official site manually.'
  },
  {
    q: 'An IT department email says "Your password expires in 2 hours. Reset it here or HR will be notified." This is suspicious because:',
    options: [
      'IT departments never send emails',
      'Legitimate password policies give advance notice (days/weeks) and use the official intranet — urgent threats and HR pressure are manipulation tactics',
      'Passwords don\'t expire in real companies',
      'The email mentions HR'
    ],
    answer: 1,
    explanation: 'Legitimate IT systems give adequate notice (typically 14+ days) for password resets. Artificial urgency, punishment threats, and external links are hallmarks of spear-phishing attacks.'
  }
];

// Quiz state
let quizState = {
  current: 0,
  score: 0,
  answered: false
};

const quizIntro      = document.getElementById('quiz-intro');
const quizArea       = document.getElementById('quiz-area');
const quizResult     = document.getElementById('quiz-result');
const quizQNum       = document.getElementById('quiz-q-num');
const quizScoreLive  = document.getElementById('quiz-score-live');
const quizQuestion   = document.getElementById('quiz-question');
const quizOptions    = document.getElementById('quiz-options');
const quizFeedback   = document.getElementById('quiz-feedback');
const quizNextBtn    = document.getElementById('quiz-next-btn');
const quizProgressFill = document.getElementById('quiz-progress-fill');
const TOTAL_Q        = QUIZ_QUESTIONS.length;

document.getElementById('quiz-start-btn').addEventListener('click', () => {
  quizState = { current: 0, score: 0, answered: false };
  quizIntro.classList.add('hidden');
  quizResult.classList.add('hidden');
  quizArea.classList.remove('hidden');
  renderQuestion();
});

function renderQuestion() {
  const qi = quizState.current;
  const q  = QUIZ_QUESTIONS[qi];

  quizQNum.textContent      = `Question ${qi + 1} of ${TOTAL_Q}`;
  quizScoreLive.textContent = `Score: ${quizState.score}`;
  quizProgressFill.style.width = `${(qi / TOTAL_Q) * 100}%`;

  quizQuestion.textContent = q.q;
  quizFeedback.classList.add('hidden');
  quizNextBtn.classList.add('hidden');
  quizState.answered = false;

  quizOptions.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleAnswer(i));
    quizOptions.appendChild(btn);
  });
}

function handleAnswer(selected) {
  if (quizState.answered) return;
  quizState.answered = true;

  const q       = QUIZ_QUESTIONS[quizState.current];
  const correct = selected === q.answer;
  if (correct) quizState.score++;

  const buttons = quizOptions.querySelectorAll('.quiz-option');
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer)   btn.classList.add('correct');
    if (i === selected && !correct) btn.classList.add('wrong');
  });

  quizFeedback.innerHTML  = correct
    ? `✅ <strong>Correct!</strong> ${q.explanation}`
    : `❌ <strong>Incorrect.</strong> ${q.explanation}`;
  quizFeedback.className  = `quiz-feedback ${correct ? 'correct-fb' : 'wrong-fb'}`;
  quizFeedback.classList.remove('hidden');

  quizNextBtn.textContent = quizState.current < TOTAL_Q - 1 ? 'Next Question →' : 'See Results';
  quizNextBtn.classList.remove('hidden');
}

quizNextBtn.addEventListener('click', () => {
  quizState.current++;
  if (quizState.current < TOTAL_Q) {
    renderQuestion();
  } else {
    showQuizResult();
  }
});

function showQuizResult() {
  quizArea.classList.add('hidden');
  quizResult.classList.remove('hidden');

  const pct = Math.round((quizState.score / TOTAL_Q) * 100);
  let grade, msg, color;

  if (pct >= 88) {
    grade = 'Cybersecurity Expert 🏆';
    msg   = 'Outstanding! You can identify phishing attempts with confidence. Keep your knowledge fresh.';
    color = '#22c55e';
  } else if (pct >= 63) {
    grade = 'Security Aware 🎯';
    msg   = 'Good job! You know the basics. Review the questions you missed to sharpen your skills.';
    color = '#00d4ff';
  } else if (pct >= 38) {
    grade = 'Learning in Progress 📚';
    msg   = 'You\'re building awareness. Study the explanations above to improve your detection skills.';
    color = '#f59e0b';
  } else {
    grade = 'Needs Improvement ⚠️';
    msg   = 'Phishing attacks are dangerous — reading through this page and retaking the quiz is highly recommended.';
    color = '#ef4444';
  }

  quizResult.innerHTML = `
    <div class="quiz-final-score" style="color:${color}">${quizState.score}/${TOTAL_Q}</div>
    <div class="quiz-final-label">${grade}</div>
    <div class="quiz-final-msg">${msg}</div>
    <button class="btn-primary" id="quiz-retry-btn">Retake Quiz</button>`;

  quizProgressFill.style.width = '100%';

  document.getElementById('quiz-retry-btn').addEventListener('click', () => {
    quizState = { current: 0, score: 0, answered: false };
    quizResult.classList.add('hidden');
    quizArea.classList.remove('hidden');
    renderQuestion();
  });
}
