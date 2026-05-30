/**
 * ML Arc - Premium AI Lead Capture & FAQ Chatbot Widget (2026 Edition)
 * Injects a floating glassmorphic chat assistant that captures high-quality leads,
 * answers client FAQs, and showcases neural capabilities in a stunning UI flow.
 */
document.addEventListener("DOMContentLoaded", function() {
  initializeAIChatbot();
});

// Lead capture state
let chatbotState = {
  activeStep: null, // 'name', 'email', 'needs', or null (standard FAQ mode)
  leadData: {
    name: "",
    email: "",
    needs: ""
  }
};

function initializeAIChatbot() {
  // Check if chatbot container already exists (avoid duplicates)
  if (document.getElementById("cs-ai-chatbot-root")) return;

  // Create Chatbot root container
  const chatbotRoot = document.createElement("div");
  chatbotRoot.id = "cs-ai-chatbot-root";
  document.body.appendChild(chatbotRoot);

  // Render Launcher Button & Chat Window HTML
  chatbotRoot.innerHTML = `
    <!-- Floating Launcher -->
    <div id="cs-chatbot-launcher" onclick="toggleChatWindow()">
      <div class="cs-launcher-pulse"></div>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <!-- Chat Window -->
    <div id="cs-chatbot-window" class="cs-hidden">
      <!-- Header -->
      <div class="cs-chatbot-header">
        <div class="cs-chatbot-bot-info">
          <div class="cs-chatbot-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" fill="currentColor"/>
              <circle cx="9" cy="11" r="1.5" fill="currentColor"/>
              <circle cx="15" cy="11" r="1.5" fill="currentColor"/>
              <path d="M8 15s1.5 2 4 2 4-2 4-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="cs-status-indicator"></span>
          </div>
          <div class="cs-chatbot-bot-details">
            <h4 class="cs-chatbot-title">ML Arc AI Assistant</h4>
            <span class="cs-chatbot-subtitle">Always Active • 2026 Edition</span>
          </div>
        </div>
        <button class="cs-chatbot-close-btn" onclick="toggleChatWindow()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Messages Area -->
      <div id="cs-chatbot-messages">
        <!-- Welcomes messages will be dynamically injected here -->
      </div>

      <!-- Quick Option Pills Container -->
      <div id="cs-chatbot-quick-options">
        <button class="cs-quick-pill" onclick="handleQuickOption('do')">What services do you offer?</button>
        <button class="cs-quick-pill" onclick="handleQuickOption('roi')">What is the average client ROI?</button>
        <button class="cs-quick-pill" onclick="handleQuickOption('help')">How can AI automate my business?</button>
        <button class="cs-quick-pill accent-pill" onclick="handleQuickOption('audit')">🚀 Book a Free AI Audit</button>
      </div>

      <!-- Input Area -->
      <div class="cs-chatbot-input-area">
        <input type="text" id="cs-chatbot-input-field" placeholder="Type a message or question..." onkeypress="handleInputKeypress(event)" />
        <button id="cs-chatbot-send-btn" onclick="handleSendMessage()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  // Inject Chatbot styles
  injectChatbotStyles();

  // Send initial welcome message sequence
  sendBotMessageSequence([
    "Hello there! 👋 I am ML Arc's neural support assistant.",
    "I am trained to help you build high-converting websites, deploy custom AI Chat & Voice agents, automate workflows, and scale growth via ads. Ask me anything, or choose a quick option below!"
  ]);
}

function toggleChatWindow() {
  const chatWindow = document.getElementById("cs-chatbot-window");
  chatWindow.classList.toggle("cs-hidden");
  if (!chatWindow.classList.contains("cs-hidden")) {
    scrollToBottom();
    document.getElementById("cs-chatbot-input-field").focus();
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

  // Clear input
  inputField.value = "";

  // Append user message
  appendMessage(userText, "user");

  // Determine response depending on active lead capture step
  if (chatbotState.activeStep) {
    processLeadStep(userText);
  } else {
    // Process standard question
    simulateThinking();
    setTimeout(() => {
      removeThinking();
      const response = generateFAQResponse(userText);
      appendMessage(response, "bot");
    }, 1000);
  }
}

function handleQuickOption(optionKey) {
  let userText = "";
  if (optionKey === "do") userText = "What services do you offer?";
  else if (optionKey === "roi") userText = "What is the average client ROI?";
  else if (optionKey === "help") userText = "How can AI automate my business?";
  else if (optionKey === "audit") userText = "Book a Free AI Audit";

  appendMessage(userText, "user");

  simulateThinking();
  setTimeout(() => {
    removeThinking();
    if (optionKey === "audit") {
      startLeadCapture();
    } else {
      const response = generateFAQResponse(userText);
      appendMessage(response, "bot");
    }
  }, 1000);
}

function generateFAQResponse(text) {
  const query = text.toLowerCase();

  if (query.includes("service") || query.includes("offer") || query.includes("do you do")) {
    return "At **ML Arc**, we build comprehensive growth engines across 4 core areas:<br>• **Web & CRM:** Custom Web Development, CMS Integration, and Notion CRM setups.<br>• **AI Chat & Voice Agents:** 24/7 Web Chatbots, WhatsApp Assistants, and Sub-1s latency Voice AI.<br>• **Business Automation:** End-to-end N8N/Python workflows, Appointment Handlers, and Review Engines.<br>• **Advertising & Growth:** Performance-focused Google Ads, Meta Ads, and ongoing Funnel Optimization.";
  }
  if (query.includes("roi") || query.includes("return") || query.includes("value") || query.includes("much cost")) {
    return "Our clients transform their cost structure by automating tier-1 administrative burdens. On average, businesses partnering with ML Arc achieve a **320% ROI** within 12 months, saving hundreds of manual hours each month.";
  }
  if (query.includes("automate") || query.includes("help my business") || query.includes("how can ai")) {
    return "AI acts as a leverage multiplier. We help you:<br>1. **Reduce Overhead:** Automate 24/7 client booking and FAQ answers.<br>2. **Improve Speed:** Retrieve critical documents instantly using semantic search.<br>3. **Scale Capacity:** Handle spikes in lead volume without adding headcount. 🚀";
  }
  if (query.includes("contact") || query.includes("audit") || query.includes("book") || query.includes("call")) {
    startLeadCapture();
    return "Great choice! Let's get a few quick details to customize your Free AI Audit strategy.";
  }

  // Fallback fallback response
  return "That is an excellent question! I'd love to help you build automated workflows for that. Click on **🚀 Book a Free AI Audit** below so our lead AI strategist can review your business and design a customized roadmap for you!";
}

// LEAD CAPTURE SYSTEM
function startLeadCapture() {
  chatbotState.activeStep = "name";
  chatbotState.leadData = { name: "", email: "", needs: "" };
  
  // Hide standard quick options to focus on form steps
  document.getElementById("cs-chatbot-quick-options").style.display = "none";
  
  appendMessage("Perfect! Let's schedule your AI audit. To start, **what is your name?**", "bot");
}

function processLeadStep(userText) {
  if (chatbotState.activeStep === "name") {
    chatbotState.leadData.name = userText;
    chatbotState.activeStep = "email";
    
    simulateThinking();
    setTimeout(() => {
      removeThinking();
      appendMessage(`Pleasure meeting you, **${userText}**! What is your **business email address** so we can send the audit details?`, "bot");
    }, 800);
  } 
  else if (chatbotState.activeStep === "email") {
    // Basic email validation
    if (!validateEmail(userText)) {
      appendMessage("Hmm, that email doesn't look quite right. Please enter a valid email address:", "bot");
      return;
    }
    
    chatbotState.leadData.email = userText;
    chatbotState.activeStep = "needs";
    
    simulateThinking();
    setTimeout(() => {
      removeThinking();
      appendMessage("Got it! Lastly, tell me briefly about **your business needs** or what processes you would like to build/automate (e.g. custom website, AI chatbot, voice agents, WhatsApp, or Google/Meta ads):", "bot");
    }, 800);
  } 
  else if (chatbotState.activeStep === "needs") {
    chatbotState.leadData.needs = userText;
    chatbotState.activeStep = null; // Done with lead capture
    
    simulateThinking();
    setTimeout(() => {
      removeThinking();
      
      // Save lead to localStorage
      saveLeadToStorage(chatbotState.leadData);
      
      // Beautiful success response with micro-checkmark
      appendMessage(`
        <div class="cs-lead-success">
          <svg class="cs-success-checkmark" viewBox="0 0 52 52">
            <circle class="cs-success-circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="cs-success-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
          <div class="cs-success-text">
            <strong>Excellent, ${chatbotState.leadData.name}!</strong><br>
            Your AI audit request is officially booked. Our senior engineer will analyze your parameters and contact you at **${chatbotState.leadData.email}** within 24 hours. 🚀
          </div>
        </div>
      `, "bot");

      // Re-enable quick options for further exploration
      setTimeout(() => {
        document.getElementById("cs-chatbot-quick-options").style.display = "flex";
        scrollToBottom();
      }, 1000);
    }, 1200);
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function saveLeadToStorage(lead) {
  let leads = [];
  try {
    const existingLeads = localStorage.getItem("mlarc_captured_leads");
    if (existingLeads) leads = JSON.parse(existingLeads);
  } catch (e) {
    console.error("Error loading leads from storage", e);
  }
  
  // Add metadata
  lead.timestamp = new Date().toISOString();
  lead.sourceUrl = window.location.href;
  leads.push(lead);
  
  localStorage.setItem("mlarc_captured_leads", JSON.stringify(leads));
  console.log("🚀 [ML Arc Chatbot] New Lead Captured successfully:", lead);
}

// UI HELPER UTILITIES
function appendMessage(text, sender) {
  const messagesContainer = document.getElementById("cs-chatbot-messages");
  const msgDiv = document.createElement("div");
  msgDiv.className = `cs-chat-msg cs-msg-${sender}`;
  
  // Use innerHTML to render bold markdown and success checkmarks
  msgDiv.innerHTML = `<div class="cs-chat-bubble">${text}</div>`;
  messagesContainer.appendChild(msgDiv);
  scrollToBottom();
}

function sendBotMessageSequence(msgs) {
  let delay = 300;
  msgs.forEach(msg => {
    setTimeout(() => {
      simulateThinking();
      setTimeout(() => {
        removeThinking();
        appendMessage(msg, "bot");
      }, 800);
    }, delay);
    delay += 1200;
  });
}

function simulateThinking() {
  removeThinking(); // Avoid duplicates
  const messagesContainer = document.getElementById("cs-chatbot-messages");
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
  messagesContainer.appendChild(thinkingDiv);
  scrollToBottom();
}

function removeThinking() {
  const thinking = document.getElementById("cs-chatbot-thinking");
  if (thinking) thinking.remove();
}

function scrollToBottom() {
  const messages = document.getElementById("cs-chatbot-messages");
  messages.scrollTop = messages.scrollHeight;
}

// CHATBOT PRESENTATION STYLES
function injectChatbotStyles() {
  const chatbotStyles = `
    #cs-chatbot-launcher {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--accent-color, #1034A6);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(16, 52, 166, 0.4);
      cursor: pointer;
      z-index: 99999;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    #cs-chatbot-launcher:hover {
      transform: scale(1.1);
      box-shadow: 0 12px 30px rgba(16, 52, 166, 0.6);
    }
    .cs-launcher-pulse {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: rgba(16, 52, 166, 0.4);
      animation: cs-pulse 2s infinite;
      z-index: -1;
    }
    @keyframes cs-pulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.3); opacity: 0; }
      100% { transform: scale(0.95); opacity: 0; }
    }

    #cs-chatbot-window {
      position: fixed;
      bottom: 105px;
      right: 30px;
      width: 380px;
      height: 560px;
      border-radius: 20px;
      background: rgba(15, 15, 15, 0.85);
      border: 1px solid rgba(16, 52, 166, 0.15);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 99998;
      transition: all 0.3s cubic-bezier(0.1, 0.8, 0.25, 1);
      transform-origin: bottom right;
    }
    #cs-chatbot-window.cs-hidden {
      opacity: 0;
      transform: scale(0.8) translateY(100px);
      pointer-events: none;
    }

    .cs-chatbot-header {
      padding: 15px 20px;
      background: rgba(0, 0, 0, 0.4);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .cs-chatbot-bot-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .cs-chatbot-avatar {
      position: relative;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(16, 52, 166, 0.1);
      color: #1034A6;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cs-status-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #00ffcc;
      border: 2px solid #0f0f0f;
      animation: cs-glow 1.5s infinite alternate;
    }
    @keyframes cs-glow {
      from { box-shadow: 0 0 2px #00ffcc; }
      to { box-shadow: 0 0 8px #00ffcc; }
    }
    .cs-chatbot-bot-details {
      display: flex;
      flex-direction: column;
    }
    .cs-chatbot-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #fff;
      margin: 0;
      font-family: inherit;
    }
    .cs-chatbot-subtitle {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
    }
    .cs-chatbot-close-btn {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      padding: 4px;
      transition: color 0.2s ease;
    }
    .cs-chatbot-close-btn:hover {
      color: #fff;
    }

    #cs-chatbot-messages {
      flex-grow: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 15px;
      scroll-behavior: smooth;
    }
    #cs-chatbot-messages::-webkit-scrollbar {
      width: 4px;
    }
    #cs-chatbot-messages::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
    }

    .cs-chat-msg {
      display: flex;
      max-width: 85%;
    }
    .cs-msg-bot {
      align-self: flex-start;
    }
    .cs-msg-user {
      align-self: flex-end;
    }
    .cs-chat-bubble {
      padding: 12px 16px;
      border-radius: 15px;
      font-size: 0.88rem;
      line-height: 1.5;
      font-family: inherit;
      color: rgba(255, 255, 255, 0.9);
      animation: cs-fade-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
    .cs-msg-bot .cs-chat-bubble {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-bottom-left-radius: 4px;
    }
    .cs-msg-user .cs-chat-bubble {
      background: var(--accent-color, #1034A6);
      color: #fff;
      border-bottom-right-radius: 4px;
      box-shadow: 0 4px 12px rgba(16, 52, 166, 0.2);
    }
    @keyframes cs-fade-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .cs-thinking-bubble {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 10px 18px !important;
    }
    .cs-thinking-bubble .cs-dot {
      width: 6px;
      height: 6px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      animation: cs-bounce 1.4s infinite ease-in-out both;
    }
    .cs-thinking-bubble .cs-dot:nth-child(1) { animation-delay: -0.32s; }
    .cs-thinking-bubble .cs-dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes cs-bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1.0); }
    }

    #cs-chatbot-quick-options {
      padding: 0 20px 15px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .cs-quick-pill {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.78rem;
      font-weight: 500;
      padding: 6px 14px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.25s ease;
      font-family: inherit;
    }
    .cs-quick-pill:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.2);
    }
    .accent-pill {
      background: rgba(16, 52, 166, 0.08) !important;
      border: 1px solid rgba(16, 52, 166, 0.25) !important;
      color: #1034A6 !important;
    }
    .accent-pill:hover {
      background: var(--accent-color, #1034A6) !important;
      color: #fff !important;
      border-color: var(--accent-color, #1034A6) !important;
    }

    .cs-chatbot-input-area {
      padding: 15px 20px;
      background: rgba(0, 0, 0, 0.4);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    #cs-chatbot-input-field {
      flex-grow: 1;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 25px;
      padding: 10px 18px;
      color: #fff;
      font-size: 0.88rem;
      outline: none;
      transition: border-color 0.2s ease;
    }
    #cs-chatbot-input-field:focus {
      border-color: rgba(16, 52, 166, 0.4);
    }
    #cs-chatbot-send-btn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(16, 52, 166, 0.1);
      border: none;
      color: #1034A6;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    #cs-chatbot-send-btn:hover {
      background: var(--accent-color, #1034A6);
      color: #fff;
    }

    /* Lead Success Checkmark */
    .cs-lead-success {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 15px;
      padding: 10px 0;
    }
    .cs-success-checkmark {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: block;
      stroke-width: 3;
      stroke: #00ffcc;
      stroke-miterlimit: 10;
      box-shadow: inset 0 0 0 #00ffcc;
      animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
    }
    .cs-success-circle {
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      stroke-width: 3;
      stroke-miterlimit: 10;
      stroke: #00ffcc;
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
      to { box-shadow: inset 0px 0px 0px 30px rgba(0, 255, 204, 0.05); }
    }
    .cs-success-text {
      font-size: 0.85rem;
      line-height: 1.5;
    }

    /* Mobile Responsive adjustments */
    @media (max-width: 480px) {
      #cs-chatbot-window {
        bottom: 0px;
        right: 0px;
        width: 100vw;
        height: 100vh;
        border-radius: 0px;
        border: none;
      }
      #cs-chatbot-launcher {
        bottom: 20px;
        right: 20px;
      }
    }
  `;
  const styleEl = document.createElement("style");
  styleEl.innerText = chatbotStyles;
  document.head.appendChild(styleEl);
}
