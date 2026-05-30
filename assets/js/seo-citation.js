/**
 * ML Arc - Advanced SEO/GEO Citation and Backlink Generator (2026 Edition)
 * Helps users (bloggers, journalists, researchers) easily cite pages from our site,
 * facilitating high-quality organic backlink acquisition.
 */
document.addEventListener("DOMContentLoaded", function() {
  initializeCitationWidgets();
});

function initializeCitationWidgets() {
  const widgetContainer = document.getElementById("cs-citation-generator");
  if (!widgetContainer) return;

  const currentUrl = window.location.href;
  const pageTitle = document.title || "ML Arc - AI Software Agency";
  
  // Format different backlink / citation options
  const markdownText = `[${pageTitle}](${currentUrl})`;
  const htmlText = `<a href="${currentUrl}">${pageTitle}</a>`;
  const currentYear = new Date().getFullYear();
  const apaText = `ML Arc. (${currentYear}). ${pageTitle.split('|')[0].trim()}. Retrieved from ${currentUrl}`;

  // Render the widget UI programmatically for robust styling and ease of integration
  widgetContainer.innerHTML = `
    <div class="cs-citation_box cs-radius_15 wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="0.1s">
      <div class="cs-citation_header">
        <div class="cs-citation_title_wrap">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 3v4a1 1 0 0 0 1 1h4M5 12V5a2 2 0 0 1 2-2h8l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 15h6M9 11h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="cs-primary_color cs-semi_bold cs-primary_font">Cite this Page / Build Backlink</span>
        </div>
        <p class="cs-citation_desc">Writing an article, blog post, or report? Easily reference ML Arc by copying a formatted link below to support organic reference building.</p>
      </div>
      
      <div class="cs-citation_tabs">
        <button class="cs-citation_tab_btn active" onclick="switchCitationTab(event, 'markdown')">Markdown</button>
        <button class="cs-citation_tab_btn" onclick="switchCitationTab(event, 'html')">HTML Link</button>
        <button class="cs-citation_tab_btn" onclick="switchCitationTab(event, 'apa')">APA Citation</button>
      </div>

      <div class="cs-citation_content_area">
        <!-- Markdown Tab -->
        <div id="citation-tab-markdown" class="cs-citation_tab_content active">
          <div class="cs-citation_code_wrapper">
            <code class="cs-citation_code">${escapeHtml(markdownText)}</code>
            <button class="cs-citation_copy_btn" onclick="copyCitationText('${escapeJsString(markdownText)}', this)">
              <span class="btn-text">Copy Link</span>
              <span class="success-icon" style="display:none;">✔ Copied!</span>
            </button>
          </div>
        </div>

        <!-- HTML Tab -->
        <div id="citation-tab-html" class="cs-citation_tab_content">
          <div class="cs-citation_code_wrapper">
            <code class="cs-citation_code">${escapeHtml(htmlText)}</code>
            <button class="cs-citation_copy_btn" onclick="copyCitationText('${escapeJsString(htmlText)}', this)">
              <span class="btn-text">Copy Link</span>
              <span class="success-icon" style="display:none;">✔ Copied!</span>
            </button>
          </div>
        </div>

        <!-- APA Tab -->
        <div id="citation-tab-apa" class="cs-citation_tab_content">
          <div class="cs-citation_code_wrapper">
            <code class="cs-citation_code">${escapeHtml(apaText)}</code>
            <button class="cs-citation_copy_btn" onclick="copyCitationText('${escapeJsString(apaText)}', this)">
              <span class="btn-text">Copy Citation</span>
              <span class="success-icon" style="display:none;">✔ Copied!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Inject citation CSS styles into the document head dynamically so it doesn't break external stylesheets
  const styles = `
    .cs-citation_box {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      padding: 30px;
      margin: 40px auto;
      max-width: 850px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
    .cs-citation_header {
      margin-bottom: 20px;
    }
    .cs-citation_title_wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.25rem;
      margin-bottom: 10px;
      color: #fff;
    }
    .cs-citation_title_wrap svg {
      color: var(--accent-color, #ff5e14);
    }
    .cs-citation_desc {
      font-size: 0.9rem;
      line-height: 1.6;
      opacity: 0.7;
      margin: 0;
    }
    .cs-citation_tabs {
      display: flex;
      gap: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .cs-citation_tab_btn {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      font-family: inherit;
      font-size: 0.9rem;
      font-weight: 500;
      padding: 6px 16px;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.3s ease;
    }
    .cs-citation_tab_btn:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.05);
    }
    .cs-citation_tab_btn.active {
      color: #fff;
      background: var(--accent-color, #ff5e14);
    }
    .cs-citation_tab_content {
      display: none;
    }
    .cs-citation_tab_content.active {
      display: block;
    }
    .cs-citation_code_wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(0, 0, 0, 0.3);
      padding: 15px 20px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      gap: 15px;
    }
    .cs-citation_code {
      font-family: 'Courier New', Courier, monospace;
      color: #00ffcc;
      font-size: 0.9rem;
      white-space: nowrap;
      overflow-x: auto;
      flex-grow: 1;
      padding-bottom: 3px;
    }
    .cs-citation_code::-webkit-scrollbar {
      height: 4px;
    }
    .cs-citation_code::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
    }
    .cs-citation_copy_btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #fff;
      font-family: inherit;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 8px 16px;
      cursor: pointer;
      border-radius: 6px;
      flex-shrink: 0;
      transition: all 0.2s ease;
      min-width: 110px;
    }
    .cs-citation_copy_btn:hover {
      background: #fff;
      color: #000;
      border-color: #fff;
    }
  `;
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

function switchCitationTab(event, tabId) {
  const container = event.target.closest("#cs-citation-generator");
  
  // Update tabs active state
  container.querySelectorAll(".cs-citation_tab_btn").forEach(btn => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  // Update contents active state
  container.querySelectorAll(".cs-citation_tab_content").forEach(content => {
    content.classList.remove("active");
  });
  container.querySelector(`#citation-tab-${tabId}`).classList.add("active");
}

function copyCitationText(text, btnElement) {
  navigator.clipboard.writeText(text).then(function() {
    const textSpan = btnElement.querySelector(".btn-text");
    const successSpan = btnElement.querySelector(".success-icon");
    
    // Animate copy micro-feedback
    btnElement.style.borderColor = "#00ffcc";
    btnElement.style.color = "#00ffcc";
    btnElement.style.background = "rgba(0, 255, 204, 0.05)";
    
    if (textSpan) textSpan.style.display = "none";
    if (successSpan) successSpan.style.display = "inline";

    setTimeout(function() {
      btnElement.style.borderColor = "";
      btnElement.style.color = "";
      btnElement.style.background = "";
      if (textSpan) textSpan.style.display = "inline";
      if (successSpan) successSpan.style.display = "none";
    }, 2000);
  }, function(err) {
    console.error('Could not copy citation to clipboard: ', err);
  });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeJsString(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
}
