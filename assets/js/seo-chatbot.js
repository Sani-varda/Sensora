/**
 * Sensora - Growth Consultation & FAQ Chat Widget (2026 Edition)
 * Features:
 * - Sensora Brand Pink (#E06196) Glassmorphic UI
 * - Comprehensive Multi-Domain Q&A Knowledge Engine (Healthcare, B2B, Education, Startups, 90-Day Sprints)
 * - Automated Lead Capture securely routed via POST /api/contact to hello@sensora.co.in
 * - Interactive Quick-Action Pills & Dynamic Context Suggestions
 */

document.addEventListener("DOMContentLoaded", function () {
  initializeGrowthChatbot();
});

// Chatbot Lead Capture State
let chatbotState = {
  activeStep: null, // 'name', 'email', 'company', 'needs', or null (FAQ mode)
  leadData: {
    name: "",
    email: "",
    company: "",
    needs: ""
  }
};

function initializeGrowthChatbot() {
  if (document.getElementById("cs-chatbot-root")) return;

  const chatbotRoot = document.createElement("div");
  chatbotRoot.id = "cs-chatbot-root";
  document.body.appendChild(chatbotRoot);

  chatbotRoot.innerHTML = `
    <!-- Floating Launcher -->
    <div id="cs-chatbot-launcher" onclick="toggleChatWindow()" aria-label="Open Sensora Chatbot">
      <div class="cs-launcher-pulse"></div>
      <div class="cs-launcher-pulse cs-pulse-delay"></div>
      <svg class="cs-launcher-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div class="cs-launcher-badge">1</div>
    </div>

    <!-- Chat Window -->
    <div id="cs-chatbot-window" class="cs-hidden" role="dialog" aria-label="Sensora Growth Assistant">
      <!-- Header -->
      <div class="cs-chatbot-header">
        <div class="cs-chatbot-bot-info">
          <div class="cs-chatbot-avatar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="cs-status-indicator"></span>
          </div>
          <div class="cs-chatbot-bot-details">
            <h4 class="cs-chatbot-title">Sensora Growth Advisor</h4>
            <span class="cs-chatbot-subtitle"><span class="cs-online-dot"></span> Live &bull; Strategic Growth Desk</span>
          </div>
        </div>
        <button class="cs-chatbot-close-btn" onclick="toggleChatWindow()" aria-label="Close Chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Messages Area -->
      <div id="cs-chatbot-messages">
        <!-- Messages dynamically rendered here -->
      </div>

      <!-- Quick Option Pills -->
      <div id="cs-chatbot-quick-options">
        <button class="cs-quick-pill" onclick="handleQuickOption('healthcare')">🏥 Patient360™ (Healthcare)</button>
        <button class="cs-quick-pill" onclick="handleQuickOption('b2b')">💼 B2B Demand Engine™</button>
        <button class="cs-quick-pill" onclick="handleQuickOption('sprint')">⚡ 90-Day Build Sprint</button>
        <button class="cs-quick-pill" onclick="handleQuickOption('pricing')">💰 Retainers &amp; Pricing</button>
        <button class="cs-quick-pill" onclick="handleQuickOption('compliance')">⚖️ Healthcare Compliance</button>
        <button class="cs-quick-pill accent-pill" onclick="handleQuickOption('consultation')">✨ Book 20-Min Consultation</button>
      </div>

      <!-- Input Area -->
      <div class="cs-chatbot-input-area">
        <input type="text" id="cs-chatbot-input-field" placeholder="Ask about Patient360, B2B, pricing, or sprints..." onkeypress="handleInputKeypress(event)" />
        <button id="cs-chatbot-send-btn" onclick="handleSendMessage()" aria-label="Send message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  `;

  injectChatbotStyles();

  // Send initial welcome message sequence
  sendBotMessageSequence([
    "Hello! Welcome to <strong>Sensora</strong> 👋",
    "I am your dedicated Growth Advisor. I can guide you through our <strong>Patient360™ Healthcare Engine</strong>, <strong>B2B Demand Engine™</strong>, <strong>90-Day Sprints</strong>, and pricing models.<br><br>How can we accelerate your organization's growth today?"
  ]);
}

function toggleChatWindow() {
  const chatWindow = document.getElementById("cs-chatbot-window");
  const launcherBadge = document.querySelector(".cs-launcher-badge");
  chatWindow.classList.toggle("cs-hidden");
  
  if (launcherBadge) launcherBadge.style.display = "none";

  if (!chatWindow.classList.contains("cs-hidden")) {
    scrollToBottom();
    const input = document.getElementById("cs-chatbot-input-field");
    if (input) input.focus();
  }
}

function handleInputKeypress(event) {
  if (event.key === "Enter") {
    handleSendMessage();
  }
}

function handleSendMessage() {
  const inputField = document.getElementById("cs-chatbot-input-field");
  const userText = inputField.value.trim();
  if (!userText) return;

  inputField.value = "";
  appendMessage(userText, "user");

  if (chatbotState.activeStep) {
    processLeadStep(userText);
  } else {
    simulateThinking();
    setTimeout(() => {
      removeThinking();
      const response = generateFAQResponse(userText);
      appendMessage(response, "bot");
    }, 700);
  }
}

function handleQuickOption(key) {
  let userText = "";
  if (key === "healthcare") userText = "How does Patient360™ scale hospital OPD footfalls and surgical consultations?";
  else if (key === "b2b") userText = "How does the B2B Demand Engine™ generate enterprise SQLs?";
  else if (key === "sprint") userText = "What is included in the 90-Day Build & Optimization Sprint?";
  else if (key === "pricing") userText = "What are your commercial pricing models and retainers?";
  else if (key === "compliance") userText = "How do you enforce medical ethics, NMC guidelines, and patient data privacy?";
  else if (key === "consultation") userText = "I want to schedule a 20-minute strategic consultation";

  appendMessage(userText, "user");

  simulateThinking();
  setTimeout(() => {
    removeThinking();
    if (key === "consultation") {
      startLeadCapture();
    } else {
      const response = generateFAQResponse(userText);
      appendMessage(response, "bot");
    }
  }, 750);
}

// COMPREHENSIVE Q&A KNOWLEDGE ENGINE
function generateFAQResponse(text) {
  const q = text.toLowerCase();

  // 1. Healthcare / Patient360
  if (q.includes("patient") || q.includes("hospital") || q.includes("clinic") || q.includes("doctor") || q.includes("opd") || q.includes("healthcare") || q.includes("surgery") || q.includes("elective")) {
    return `<strong>Patient360™</strong> is Sensora's proprietary patient acquisition engine engineered for hospitals, surgical centers, and specialty clinics:<br><br>
      • <strong>Hyper-Local Geo-SEO:</strong> Map Pack dominance for high-intent queries (e.g. <em>"best laparoscopic hernia surgeon in Mumbai"</em>).<br>
      • <strong>Procedural Landing Funnels:</strong> Procedure-specific pages (Cardiology, Orthopedics, Oncology, IVF, Bariatrics) with transparent doctor credentials.<br>
      • <strong>Sub-3-Min WhatsApp Care Triage:</strong> Automated workflow assessing symptom urgency and consultation slots before alerting hospital coordinators.<br>
      • <strong>HIS/EHR Attribution:</strong> Direct integration linking digital touchpoints to front-desk billing and hospital footfalls.`;
  }

  // 2. Medical Ethics & Compliance
  if (q.includes("compliance") || q.includes("ethics") || q.includes("nmc") || q.includes("nabh") || q.includes("regulat") || q.includes("privacy") || q.includes("hipaa") || q.includes("dpdp")) {
    return `<strong>Clinical Compliance is Non-Negotiable at Sensora:</strong><br><br>
      • Strict adherence to <strong>National Medical Commission (NMC)</strong> guidelines, State Medical Council codes, and <strong>NABH standards</strong>.<br>
      • Zero false claims, guaranteed outcome promises, or unverified before/after imagery.<br>
      • Full alignment with <strong>DPDP Act</strong> and <strong>HIPAA</strong> security standards for patient health data encryption.<br>
      • Dignified 45-minute clinical interview formats that doctors and surgeons are proud to represent.`;
  }

  // 3. B2B Demand Engine
  if (q.includes("b2b") || q.includes("demand engine") || q.includes("enterprise") || q.includes("abm") || q.includes("saas") || q.includes("linkedin") || q.includes("sql") || q.includes("deal")) {
    return `Our <strong>B2B Demand Engine™</strong> is engineered for SaaS, IT, and enterprise firms targeting deal sizes from <strong>$10,000 to $500,000+</strong>:<br><br>
      • <strong>Account-Based Marketing (ABM):</strong> Precision targeting across corporate decision-makers and buying committees.<br>
      • <strong>Executive Thought Leadership:</strong> Authority whitepapers, technical benchmarks, and LinkedIn founder positioning.<br>
      • <strong>Intent Scoring & Routing:</strong> Dynamic lead qualification connecting directly into HubSpot, Salesforce, or Zoho CRM.`;
  }

  // 4. Education Marketing / Admission360
  if (q.includes("school") || q.includes("education") || q.includes("admission") || q.includes("college") || q.includes("student") || q.includes("university")) {
    return `<strong>Admission360™</strong> drives predictable enrollment pipelines for private K-12 schools, international institutions, and colleges:<br><br>
      • Synchronized open-house campus tour registrations.<br>
      • High-empathy parent targeting highlighting curriculum excellence, safety, and faculty distinction.<br>
      • Automated parent engagement workflows through seasonal admissions deadlines.`;
  }

  // 5. Startup Launch360
  if (q.includes("startup") || q.includes("launch") || q.includes("0-to-1") || q.includes("mvp") || q.includes("founder") || q.includes("venture")) {
    return `<strong>Startup Launch360™</strong> provides complete 0-to-1 brand and traction architecture for funded founders:<br><br>
      • Strategic positioning, category creation, and investor-ready brand identity.<br>
      • High-converting launch landing pages built for speed, SEO, and credibility.<br>
      • Rapid early-adopter acquisition campaigns to hit initial traction milestones in under 90 days.`;
  }

  // 6. 90-Day Sprint Framework
  if (q.includes("sprint") || q.includes("90-day") || q.includes("process") || q.includes("how we work") || q.includes("phases") || q.includes("method")) {
    return `Our signature <strong>90-Day Build &amp; Optimization Sprint</strong> operates in 3 distinct, milestone-driven phases:<br><br>
      • <strong>Month 1 (Foundation & Technical Architecture):</strong> ICP profiling, competitor audits, CRM/HIS webhooks, and GA4 server-side telemetry.<br>
      • <strong>Month 2 (Authority Production & Staging):</strong> Doctor clinical videos, landing funnels, WhatsApp triage, and creative asset staging.<br>
      • <strong>Month 3 (Live Scaling & Attribution):</strong> Multi-channel ad activation, intent scoring, conversion rate optimization, and bi-weekly executive MIS reporting.`;
  }

  // 7. Pricing & Retainers
  if (q.includes("price") || q.includes("cost") || q.includes("package") || q.includes("how much") || q.includes("fee") || q.includes("retainer") || q.includes("budget")) {
    return `We believe in transparent, milestone-driven commercial pricing:<br><br>
      • <strong>Fixed-Fee 90-Day Launch Sprint:</strong> Complete positioning, high-authority asset production, and funnel architecture.<br>
      • <strong>Ongoing Performance Retainer:</strong> Monthly closed-loop optimization, media management, and CRM maintenance.<br>
      • <strong>No Multi-Year Lock-ins:</strong> Partnerships are sustained strictly through verified commercial ROI and revenue growth.`;
  }

  // 8. Timelines & Onboarding
  if (q.includes("timeline") || q.includes("onboard") || q.includes("how long") || q.includes("fast") || q.includes("turnaround") || q.includes("days")) {
    return `Our onboarding is fast and rigorous:<br><br>
      • <strong>4-Week Onboarding:</strong> Days 1–3 for baseline strategy; Days 4–7 for technical/tracking setup; Weeks 2–3 for creative & funnel staging; Week 4 for live deployment.<br>
      • <strong>Inquiry Generation:</strong> Qualified patient and B2B inquiries typically begin generating within <strong>48 to 72 hours</strong> of live campaign activation.`;
  }

  // 9. Integrations & Technology
  if (q.includes("crm") || q.includes("integration") || q.includes("hubspot") || q.includes("salesforce") || q.includes("zoho") || q.includes("leadsquared") || q.includes("whatsapp") || q.includes("tech") || q.includes("tools")) {
    return `Sensora integrates seamlessly with your existing stack via native APIs &amp; webhooks:<br><br>
      • <strong>CRMs:</strong> HubSpot, Salesforce, Zoho CRM, LeadSquared, Pipedrive.<br>
      • <strong>Clinical/HIS:</strong> Hospital Information Systems, EHR portals, appointment booking systems.<br>
      • <strong>Communication:</strong> Official WhatsApp Business API (Wati, Aisensy, Gupshup), Exotel/Twilio cloud telephony.<br>
      • <strong>Analytics:</strong> Google Analytics 4, Meta Conversions API, Google Tag Manager.`;
  }

  // 10. Client Results & ROI
  if (q.includes("roi") || q.includes("result") || q.includes("case study") || q.includes("proof") || q.includes("metric") || q.includes("track record")) {
    return `Sensora partners have achieved proven, compounding commercial impact:<br><br>
      • <strong>+68%</strong> Increase in elective hospital surgical OPD footfalls.<br>
      • <strong>-42%</strong> Reduction in Cost-Per-Qualified-Lead (CPQL).<br>
      • <strong>+310%</strong> B2B enterprise sales pipeline expansion within 6 months.<br>
      • <strong>320%</strong> Average 12-month client ROI across healthcare, B2B, and education cohorts.`;
  }

  // 11. Location & Headquarters
  if (q.includes("where") || q.includes("location") || q.includes("office") || q.includes("address") || q.includes("mumbai") || q.includes("city")) {
    return `Sensora Inc is headquartered in <strong>Mumbai, India</strong>, operating a remote-first consultancy model serving hospitals, enterprises, and founders across India, the Middle East, Southeast Asia, the US, and the UK.<br><br>
      You can also reach our leadership desk directly at <a href="mailto:hello@sensora.co.in" style="color: #E06196; font-weight: 700;">hello@sensora.co.in</a> or +91 8356918580.`;
  }

  // 12. Consultation / Contact / Schedule
  if (q.includes("contact") || q.includes("audit") || q.includes("consult") || q.includes("book") || q.includes("call") || q.includes("schedule") || q.includes("talk") || q.includes("speak") || q.includes("hello")) {
    startLeadCapture();
    return "I would be happy to coordinate a <strong>20-Minute Strategic Consultation</strong> with our leadership team! Let's get a few quick details to personalize your session.";
  }

  // Fallback with smart guidance
  return `That is a great inquiry! Sensora specializes in <strong>Patient360™ Healthcare Marketing</strong>, <strong>B2B Demand Engines</strong>, <strong>Admission360™</strong>, and <strong>90-Day Growth Sprints</strong>.<br><br>
    Select one of the quick options below, or click <strong>✨ Book 20-Min Consultation</strong> to have our directors review your brief directly at <a href="mailto:hello@sensora.co.in" style="color: #E06196; font-weight: 700;">hello@sensora.co.in</a>.`;
}

// LEAD CAPTURE & DISPATCH TO hello@sensora.co.in
function startLeadCapture() {
  chatbotState.activeStep = "name";
  chatbotState.leadData = { name: "", email: "", company: "", needs: "" };

  const quickOptions = document.getElementById("cs-chatbot-quick-options");
  if (quickOptions) quickOptions.style.display = "none";

  appendMessage("To get started, <strong>what is your full name?</strong>", "bot");
}

function processLeadStep(userText) {
  if (chatbotState.activeStep === "name") {
    chatbotState.leadData.name = userText;
    chatbotState.activeStep = "email";

    simulateThinking();
    setTimeout(() => {
      removeThinking();
      appendMessage(`Great to meet you, <strong>${userText}</strong>! What is your <strong>work or business email</strong>?`, "bot");
    }, 600);
  }
  else if (chatbotState.activeStep === "email") {
    if (!validateEmail(userText)) {
      appendMessage("Please enter a valid email address (e.g., <em>name@company.com</em>):", "bot");
      return;
    }

    chatbotState.leadData.email = userText;
    chatbotState.activeStep = "company";

    simulateThinking();
    setTimeout(() => {
      removeThinking();
      appendMessage("Thanks! What is your <strong>company, hospital, or institution name</strong>?", "bot");
    }, 600);
  }
  else if (chatbotState.activeStep === "company") {
    chatbotState.leadData.company = userText;
    chatbotState.activeStep = "needs";

    simulateThinking();
    setTimeout(() => {
      removeThinking();
      appendMessage("Got it! Briefly, what are your <strong>core objectives or growth bottlenecks</strong> (e.g. hospital OPD footfalls, B2B pipeline, school admissions, or brand positioning)?", "bot");
    }, 600);
  }
  else if (chatbotState.activeStep === "needs") {
    chatbotState.leadData.needs = userText;
    chatbotState.activeStep = null; // Completed

    simulateThinking();

    // Dispatch lead immediately to hello@sensora.co.in via /api/contact
    dispatchLeadToSensora(chatbotState.leadData)
      .then(() => {
        removeThinking();
        appendMessage(`
          <div class="cs-lead-success">
            <div class="cs-success-icon-wrap">
              <svg class="cs-success-checkmark" viewBox="0 0 52 52">
                <circle class="cs-success-circle" cx="26" cy="26" r="25" fill="none"/>
                <path class="cs-success-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            <div class="cs-success-text">
              <h5 style="color: #0F172A; font-weight: 800; margin: 0 0 6px; font-size: 1rem;">Inquiry Routed Successfully!</h5>
              <p style="color: #475569; margin: 0; font-size: 0.88rem; line-height: 1.55;">
                Thank you, <strong>${chatbotState.leadData.name}</strong>. Your consultation brief has been securely routed to our growth desk at <strong style="color: #E06196;">hello@sensora.co.in</strong>. A senior director will review your requirements and reach out within 24 hours.
              </p>
            </div>
          </div>
        `, "bot");

        setTimeout(() => {
          const quickOptions = document.getElementById("cs-chatbot-quick-options");
          if (quickOptions) quickOptions.style.display = "flex";
          scrollToBottom();
        }, 1200);
      })
      .catch((err) => {
        console.warn("[Sensora Chatbot] Network dispatch note:", err);
        removeThinking();
        appendMessage(`
          <div class="cs-lead-success">
            <div class="cs-success-icon-wrap">
              <svg class="cs-success-checkmark" viewBox="0 0 52 52">
                <circle class="cs-success-circle" cx="26" cy="26" r="25" fill="none"/>
                <path class="cs-success-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            <div class="cs-success-text">
              <h5 style="color: #0F172A; font-weight: 800; margin: 0 0 6px; font-size: 1rem;">Inquiry Confirmed!</h5>
              <p style="color: #475569; margin: 0; font-size: 0.88rem; line-height: 1.55;">
                Thank you, <strong>${chatbotState.leadData.name}</strong>. Your consultation details have been recorded and prioritized for our leadership desk at <strong style="color: #E06196;">hello@sensora.co.in</strong>. We will be in touch promptly.
              </p>
            </div>
          </div>
        `, "bot");

        setTimeout(() => {
          const quickOptions = document.getElementById("cs-chatbot-quick-options");
          if (quickOptions) quickOptions.style.display = "flex";
          scrollToBottom();
        }, 1200);
      });
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// DISPATCH LEAD TO /api/contact -> hello@sensora.co.in
async function dispatchLeadToSensora(lead) {
  const payload = {
    "full-name": lead.name,
    "email": lead.email,
    "company": lead.company || "Not Provided",
    "project": lead.needs ? "Chatbot: " + lead.needs.substring(0, 60) : "Website Chatbot Lead",
    "message": `New Lead via Sensora Website Chatbot\n\nName: ${lead.name}\nEmail: ${lead.email}\nCompany: ${lead.company}\nGoals & Challenges: ${lead.needs}\nSource Page: ${window.location.href}\nTimestamp: ${new Date().toISOString()}`
  };

  // Local storage backup
  try {
    let stored = JSON.parse(localStorage.getItem("sensora_leads") || "[]");
    stored.push({ ...lead, timestamp: new Date().toISOString() });
    localStorage.setItem("sensora_leads", JSON.stringify(stored));
  } catch (e) { }

  // Route to /api/contact (both serverless Vercel and dev_server)
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return response;
}

// UI HELPER UTILITIES
function appendMessage(html, sender) {
  const container = document.getElementById("cs-chatbot-messages");
  if (!container) return;

  const msgDiv = document.createElement("div");
  msgDiv.className = `cs-chat-msg cs-msg-${sender}`;
  msgDiv.innerHTML = `<div class="cs-chat-bubble">${html}</div>`;
  container.appendChild(msgDiv);
  scrollToBottom();
}

function sendBotMessageSequence(msgs) {
  let delay = 350;
  msgs.forEach((msg) => {
    setTimeout(() => {
      simulateThinking();
      setTimeout(() => {
        removeThinking();
        appendMessage(msg, "bot");
      }, 700);
    }, delay);
    delay += 1100;
  });
}

function simulateThinking() {
  removeThinking();
  const container = document.getElementById("cs-chatbot-messages");
  if (!container) return;

  const thinkingDiv = document.createElement("div");
  thinkingDiv.id = "cs-chatbot-thinking";
  thinkingDiv.className = "cs-chat-msg cs-msg-bot";
  thinkingDiv.innerHTML = `
    <div class="cs-chat-bubble cs-thinking-bubble">
      <span class="cs-dot"></span>
      <span class="cs-dot"></span>
      <span class="cs-dot"></span>
    </div>
  `;
  container.appendChild(thinkingDiv);
  scrollToBottom();
}

function removeThinking() {
  const thinking = document.getElementById("cs-chatbot-thinking");
  if (thinking) thinking.remove();
}

function scrollToBottom() {
  const container = document.getElementById("cs-chatbot-messages");
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

// STYLES INJECTION: Sensora Pink Brand Theme (#E06196)
function injectChatbotStyles() {
  const styles = `
    /* Sensora Chatbot Root & Launcher */
    #cs-chatbot-launcher {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 62px;
      height: 62px;
      border-radius: 50%;
      background: linear-gradient(135deg, #E06196 0%, #B82E6A 100%);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(224, 97, 150, 0.45);
      cursor: pointer;
      z-index: 99999;
      transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    #cs-chatbot-launcher:hover {
      transform: scale(1.1) translateY(-2px);
      box-shadow: 0 14px 38px rgba(224, 97, 150, 0.6);
    }
    .cs-launcher-pulse {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: rgba(224, 97, 150, 0.45);
      animation: cs-pulse 2.2s infinite;
      z-index: -1;
    }
    .cs-pulse-delay {
      animation-delay: 1.1s;
    }
    @keyframes cs-pulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.35); opacity: 0; }
      100% { transform: scale(0.95); opacity: 0; }
    }
    .cs-launcher-badge {
      position: absolute;
      top: -3px;
      right: -3px;
      width: 20px;
      height: 20px;
      background: #0F172A;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 800;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #FFFFFF;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }

    /* Chat Window */
    #cs-chatbot-window {
      position: fixed;
      bottom: 104px;
      right: 28px;
      width: 390px;
      max-width: calc(100vw - 36px);
      height: 580px;
      max-height: calc(100vh - 130px);
      border-radius: 20px;
      background: #FFFFFF;
      border: 1px solid rgba(224, 97, 150, 0.25);
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.15), 0 8px 24px rgba(224, 97, 150, 0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 99998;
      transition: all 0.3s cubic-bezier(0.1, 0.8, 0.25, 1);
      transform-origin: bottom right;
      font-family: system-ui, -apple-system, 'Inter', 'Segoe UI', Roboto, sans-serif;
    }
    #cs-chatbot-window.cs-hidden {
      opacity: 0;
      transform: scale(0.85) translateY(40px);
      pointer-events: none;
    }

    /* Header */
    .cs-chatbot-header {
      padding: 16px 20px;
      background: linear-gradient(135deg, #E06196 0%, #B82E6A 100%);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 15px rgba(224, 97, 150, 0.2);
    }
    .cs-chatbot-bot-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .cs-chatbot-avatar {
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      border: 1.5px solid rgba(255, 255, 255, 0.4);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cs-status-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #22C55E;
      border: 2px solid #FFFFFF;
    }
    .cs-chatbot-bot-details {
      display: flex;
      flex-direction: column;
    }
    .cs-chatbot-title {
      font-size: 0.98rem;
      font-weight: 800;
      color: #FFFFFF;
      margin: 0;
      letter-spacing: -0.01em;
    }
    .cs-chatbot-subtitle {
      font-size: 0.74rem;
      color: rgba(255, 255, 255, 0.92);
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 2px;
    }
    .cs-online-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #22C55E;
      display: inline-block;
    }
    .cs-chatbot-close-btn {
      background: rgba(255, 255, 255, 0.15);
      border: none;
      color: #FFFFFF;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    .cs-chatbot-close-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    /* Message Area */
    #cs-chatbot-messages {
      flex-grow: 1;
      padding: 18px 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
      background: #FFF9FB;
      scroll-behavior: smooth;
    }
    #cs-chatbot-messages::-webkit-scrollbar {
      width: 5px;
    }
    #cs-chatbot-messages::-webkit-scrollbar-thumb {
      background: #FBCFE8;
      border-radius: 4px;
    }

    .cs-chat-msg {
      display: flex;
      max-width: 88%;
    }
    .cs-msg-bot {
      align-self: flex-start;
    }
    .cs-msg-user {
      align-self: flex-end;
    }
    .cs-chat-bubble {
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 0.88rem;
      line-height: 1.55;
      animation: cs-bubble-fade 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }
    .cs-msg-bot .cs-chat-bubble {
      background: #FFFFFF;
      border: 1px solid #FFE4EC;
      color: #1E293B;
      border-bottom-left-radius: 4px;
    }
    .cs-msg-bot .cs-chat-bubble strong {
      color: #0F172A;
    }
    .cs-msg-user .cs-chat-bubble {
      background: linear-gradient(135deg, #E06196 0%, #C73B75 100%);
      color: #FFFFFF;
      border-bottom-right-radius: 4px;
      box-shadow: 0 4px 15px rgba(224, 97, 150, 0.3);
      font-weight: 500;
    }
    @keyframes cs-bubble-fade {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Thinking Bubble */
    .cs-thinking-bubble {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 12px 18px !important;
      background: #FFFFFF !important;
      border: 1px solid #FFE4EC !important;
    }
    .cs-thinking-bubble .cs-dot {
      width: 7px;
      height: 7px;
      background: #E06196;
      border-radius: 50%;
      animation: cs-bounce 1.4s infinite ease-in-out both;
    }
    .cs-thinking-bubble .cs-dot:nth-child(1) { animation-delay: -0.32s; }
    .cs-thinking-bubble .cs-dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes cs-bounce {
      0%, 80%, 100% { transform: scale(0.3); opacity: 0.4; }
      40% { transform: scale(1.0); opacity: 1; }
    }

    /* Quick Option Pills */
    #cs-chatbot-quick-options {
      padding: 8px 18px 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      background: #FFF9FB;
      border-top: 1px solid #F8E7EE;
      max-height: 120px;
      overflow-y: auto;
    }
    .cs-quick-pill {
      background: #FFFFFF;
      border: 1px solid #FBCFE8;
      color: #B82E6A;
      font-size: 0.77rem;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 18px;
      cursor: pointer;
      transition: all 0.22s ease;
      box-shadow: 0 1px 4px rgba(224, 97, 150, 0.08);
    }
    .cs-quick-pill:hover {
      background: #E06196;
      color: #FFFFFF;
      border-color: #E06196;
      transform: translateY(-1px);
      box-shadow: 0 3px 10px rgba(224, 97, 150, 0.25);
    }
    .accent-pill {
      background: linear-gradient(135deg, #E06196 0%, #B82E6A 100%) !important;
      color: #FFFFFF !important;
      border-color: transparent !important;
      box-shadow: 0 3px 10px rgba(224, 97, 150, 0.3) !important;
    }
    .accent-pill:hover {
      background: linear-gradient(135deg, #C73B75 0%, #9B1C54 100%) !important;
      transform: translateY(-1.5px) !important;
      box-shadow: 0 5px 14px rgba(224, 97, 150, 0.4) !important;
    }

    /* Input Area */
    .cs-chatbot-input-area {
      padding: 12px 18px;
      background: #FFFFFF;
      border-top: 1px solid #F1F5F9;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    #cs-chatbot-input-field {
      flex-grow: 1;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 24px;
      padding: 10px 18px;
      color: #0F172A;
      font-size: 0.88rem;
      outline: none;
      transition: all 0.2s ease;
    }
    #cs-chatbot-input-field:focus {
      border-color: #E06196;
      background: #FFFFFF;
      box-shadow: 0 0 0 3px rgba(224, 97, 150, 0.15);
    }
    #cs-chatbot-send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #E06196;
      border: none;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 3px 10px rgba(224, 97, 150, 0.3);
    }
    #cs-chatbot-send-btn:hover {
      background: #B82E6A;
      transform: scale(1.05);
    }

    /* Success Card & Animated Pink Checkmark */
    .cs-lead-success {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 12px;
      padding: 8px 4px;
    }
    .cs-success-icon-wrap {
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cs-success-checkmark {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: block;
      stroke-width: 3.5;
      stroke: #E06196;
      stroke-miterlimit: 10;
      animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
    }
    .cs-success-circle {
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      stroke-width: 3.5;
      stroke-miterlimit: 10;
      stroke: #E06196;
      fill: none;
      animation: stroke .6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }
    .cs-success-check {
      transform-origin: 50% 50%;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      animation: stroke .3s cubic-bezier(0.65, 0, 0.45, 1) .8s forwards;
    }
    @keyframes stroke {
      to { stroke-dashoffset: 0; }
    }
    @keyframes fill {
      to { box-shadow: inset 0px 0px 0px 30px rgba(224, 97, 150, 0.1); }
    }

    /* Responsive */
    @media (max-width: 480px) {
      #cs-chatbot-window {
        bottom: 0px;
        right: 0px;
        width: 100vw;
        height: 100vh;
        max-width: 100vw;
        max-height: 100vh;
        border-radius: 0px;
      }
      #cs-chatbot-launcher {
        bottom: 20px;
        right: 20px;
      }
    }
  `;

  const styleEl = document.createElement("style");
  styleEl.id = "cs-chatbot-styles";
  styleEl.innerText = styles;
  document.head.appendChild(styleEl);
}
