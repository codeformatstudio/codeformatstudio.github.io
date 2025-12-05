window.addEventListener("beforeunload", function (event) {
    // Most browsers ignore the custom message, but you can set it
    const message = "Are you sure you want to leave this page?";
    
    event.preventDefault(); // Some browsers require this
    event.returnValue = message; // Legacy method for older browsers
    
    return message?true:false; // For some older browsers
});

// Helper Function \\
function cyberPrompt(message, callback) {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,10,0.95)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "10000";
  overlay.style.color = "#00ffff";
  overlay.style.fontFamily =
    '"Orbitron", "Segoe UI", Tahoma, Roboto, sans-serif';
  overlay.style.textAlign = "center";

  // Message
  const msg = document.createElement("div");
  msg.textContent = message;
  msg.style.marginBottom = "20px";
  msg.style.fontSize = "20px";
  msg.style.textShadow = "0 0 10px #00ffff";
  overlay.appendChild(msg);

  // Input
  const input = document.createElement("input");
  input.type = "text";
  input.style.padding = "10px";
  input.style.border = "2px solid #00ffff";
  input.style.borderRadius = "10px";
  input.style.background = "rgba(0,20,30,0.9)";
  input.style.color = "#00ffff";
  input.style.fontSize = "16px";
  input.style.width = "300px";
  input.style.marginBottom = "20px";
  input.style.textAlign = "center";
  overlay.appendChild(input);

  // Buttons
  const btnContainer = document.createElement("div");
  btnContainer.style.display = "flex";
  btnContainer.style.gap = "10px";

  const okBtn = document.createElement("button");
  okBtn.textContent = "OK";
  okBtn.style.padding = "8px 16px";
  okBtn.style.background = "#000010";
  okBtn.style.color = "#00ffff";
  okBtn.style.border = "2px solid #00ffff";
  okBtn.style.borderRadius = "8px";
  okBtn.style.cursor = "pointer";
  okBtn.style.boxShadow = "0 0 10px #00ffff55";
  okBtn.onclick = () => {
    callback(input.value);
    document.body.removeChild(overlay);
  };

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.padding = "8px 16px";
  cancelBtn.style.background = "#000010";
  cancelBtn.style.color = "#00ffff";
  cancelBtn.style.border = "2px solid #00ffff";
  cancelBtn.style.borderRadius = "8px";
  cancelBtn.style.cursor = "pointer";
  cancelBtn.style.boxShadow = "0 0 10px #00ffff55";
  cancelBtn.onclick = () => {
    callback(null);
    document.body.removeChild(overlay);
  };

  btnContainer.appendChild(okBtn);
  btnContainer.appendChild(cancelBtn);
  overlay.appendChild(btnContainer);

  document.body.appendChild(overlay);
  input.focus();
  okBtn.addEventListener("click", function (){
    document.body.removeChild(overlay);
  })
  cancelBtn.addEventListener("click", function () {
    document.body.removeChild(overlay);
  })
}

// === DOM ELEMENTS === \\
const htmlSelect = document.getElementById("htmlSelect");
const pySelect = document.getElementById("pySelect");
const jsSelect = document.getElementById("jsSelect");
const cssSelect = document.getElementById("cssSelect");
const cssInput = document.getElementById("cssInput");
const htmlInput = document.getElementById("htmlInput");
const pyInput = document.getElementById("pyInput");
const jsInput = document.getElementById("jsInput");
const previewInput = document.getElementById("previewInput");
const previewScreen = document.getElementById("previewScreen");
const choosingList = document.getElementById("choosingList");
const form = document.querySelector("form");
const closePreviewBtn = document.getElementById("closePreviewBtn");
const downloadBtn = document.getElementById("downloadBtn");
const previewContent = document.getElementById("previewContent");
const previewStyle = previewScreen.style;
const htmlEditor = CodeMirror.fromTextArea(htmlInput, {
  mode: "xml",
  theme: "dracula",
  lineNumbers: true,
  autoCloseBrackets: true,
  matchBrackets: true,
  viewportMargin: 50, // Only render visible lines + 50 buffer
  indentUnit: 2,
  indentWithTabs: false,
});
htmlEditor.getWrapperElement().style.fontFamily = '"Consolas", "Monaco", "Courier New", monospace';

const cssEditor = CodeMirror.fromTextArea(cssInput, {
  mode: "css",
  theme: "dracula",
  lineNumbers: true,
  autoCloseBrackets: true,
  matchBrackets: true,
  viewportMargin: 50,
  indentUnit: 2,
  indentWithTabs: false,
});
cssEditor.getWrapperElement().style.fontFamily = '"Consolas", "Monaco", "Courier New", monospace';

const jsEditor = CodeMirror.fromTextArea(jsInput, {
  mode: "javascript",
  theme: "dracula",
  lineNumbers: true,
  autoCloseBrackets: true,
  matchBrackets: true,
  viewportMargin: 50,
  indentUnit: 2,
  indentWithTabs: false,
});
jsEditor.getWrapperElement().style.fontFamily = '"Consolas", "Monaco", "Courier New", monospace';

const pyEditor = CodeMirror.fromTextArea(pyInput, {
  mode: "python",
  theme: "dracula",
  lineNumbers: true,
  autoCloseBrackets: true,
  matchBrackets: true,
  viewportMargin: 50,
  indentUnit: 2,
  indentWithTabs: false,
});
pyEditor.getWrapperElement().style.fontFamily = '"Consolas", "Monaco", "Courier New", monospace';

let previewWindow = null;

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const mode = previewInput.value.toLowerCase().trim();

  // RESET EVERYTHING
  document.body.classList.remove("dock-right", "dock-left", "dock-bottom");

  previewStyle.display = "block";
  previewStyle.top = "";
  previewStyle.bottom = "";
  previewStyle.left = "";
  previewStyle.right = "";
  previewStyle.width = "";
  previewStyle.height = "";
});
const openPreviewBtn = document.getElementById("openPreviewBtn");

// ✅ MAIN PREVIEW APPLY FUNCTION
function applyPreviewMode(mode) {
  mode = mode.toLowerCase().trim();

  localStorage.setItem("preferredDockMode", mode);

  // RESET
  document.body.classList.remove("dock-right", "dock-left", "dock-bottom");

  previewStyle.display = "block";

  if (mode === "separate window") {
    previewStyle.display = 'none';
    if (!previewWindow || previewWindow.closed) {
      previewWindow = window.open("", "_blank", "width=1000,height=700");
    }
    previewWindow.document.open();
    previewWindow.document.write(generateFullOutput());
    previewWindow.document.close();
    return;
  }

  if (mode === "dock to right") {
    document.body.classList.add("dock-right");
  } else if (mode === "dock to left") {
    document.body.classList.add("dock-left");
  } else if (mode === "dock to bottom") {
    document.body.classList.add("dock-bottom");
  }

  updatePreview();
  resizeEditors();
}

function resizeEditors() {
  setTimeout(() => {
    htmlEditor.refresh();
    cssEditor.refresh();
    jsEditor.refresh();
    pyEditor.refresh();
  }, 50);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const mode = previewInput.value;
  applyPreviewMode(mode);
});

openPreviewBtn.addEventListener("click", () => {
  const savedMode = localStorage.getItem("preferredDockMode");

  if (!savedMode) {
    alert("No saved preview mode yet!");
    return;
  }

  applyPreviewMode(savedMode);
});
function updatePreview() {
  previewContent.innerHTML = ""; // clear previous iframe

  const iframe = document.createElement("iframe");
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  previewContent.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(generateOutput());
  doc.close();

  const lang = pySelect.value;
  iframe.onload = () => {
    switch (lang) {
      case "brython":
        iframe.contentWindow.brython && iframe.contentWindow.brython();
        break;
      case "lua":
        fengari.load(jsEditor.getValue())(); // or pyEditor.getValue()
        break;
      case "ruby":
        Opal.eval(pyEditor.getValue());
        break;
      case "scheme":
        new BiwaScheme.Interpreter().evaluate(pyEditor.getValue());
        break;
      case "r":
        const r = new R();
        r.eval(pyEditor.getValue()).then(console.log);
        break;
    }
  };
  if (previewWindow && !previewWindow.closed) {
    previewWindow.document.open();
    previewWindow.document.write(generateFullOutput());
    previewWindow.document.close();
  }
}
function generateOutput() {
  const htmlContent = htmlEditor.getValue();
  const cssContent = `<style>${cssEditor.getValue()}</style>`;
  let jsContent = jsEditor.getValue();
  let pyScript = "";

  const lang = pySelect.value;
  const code = pyEditor.getValue().replace(/`/g,'\\`'); // escape backticks

  if (lang === "brython") {
    pyScript = `<script type="text/python">${code}</script>`;
  } else if (lang === "lua") {
    pyScript = `<script type="text/lua">
      fengari.load(\`${code}\`)();
    </script>`;
  } else if (lang === "ruby") {
    pyScript = `<script type="text/ruby">
      Opal.eval(\`${code}\`);
    </script>`;
  } else if (lang === "scheme") {
    pyScript = `<script type="text/scheme">
      new BiwaScheme.Interpreter().evaluate(\`${code}\`);
    </script>`;
  } else if (lang === "r") {
    pyScript = `<script type="text/r">
      const r = new R();
      r.eval(\`${code}\`).then(console.log);
    </script>`;
  }

  return `
    ${htmlContent}
    ${cssContent}
    <script>${jsContent}</script>
    ${pyScript}
  `;
  // === Final HTML Output ===
  const fullOutput = `
     ${htmlContent}
     ${cssContent}
     <script type="text/javascript">
     window.onload = () => { if(typeof brython !== 'undefined') brython(); };
     ${jsContent}
     </script>
     ${pyScript}
   `;

  return fullOutput;
}
// ---------------------------
// generateFullOutput (pure)
// ---------------------------
function generateFullOutput() {
  const htmlContent = htmlEditor.getValue();
  const cssContent = `<style>${cssEditor.getValue()}</style>`;
  let jsContent = jsEditor.getValue();
  let pyScript = "";

  const lang = pySelect.value;
  const code = pyEditor.getValue().replace(/`/g,'\\`'); // escape backticks

  if (lang === "brython") {
    pyScript = `<script type="text/python">${code}</script>`;
  } else if (lang === "lua") {
    pyScript = `<script type="text/lua">
      fengari.load(\`${code}\`)();
    </script>`;
  } else if (lang === "ruby") {
    pyScript = `<script type="text/ruby">
      Opal.eval(\`${code}\`);
    </script>`;
  } else if (lang === "scheme") {
    pyScript = `<script type="text/scheme">
      new BiwaScheme.Interpreter().evaluate(\`${code}\`);
    </script>`;
  } else if (lang === "r") {
    pyScript = `<script type="text/r">
      const r = new R();
      r.eval(\`${code}\`).then(console.log);
    </script>`;
  }

  return `
    ${htmlContent}
    ${cssContent}
    <script>${jsContent}</script>
    ${pyScript}
  `;
  // === Final HTML Output ===
  const fullOutput = `
     ${htmlContent}
     ${cssContent}
     <script type="text/javascript">
     window.onload = () => { if(typeof brython !== 'undefined') brython(); };
     ${jsContent}
     </script>
     ${pyScript}
   `;

  return fullOutput;
}

// ---------------------------
// download helper (uses cyberPrompt)
// ---------------------------
function downloadProject(defaultName = "project") {
  cyberPrompt("Enter your project name:", (value) => {
    let name = defaultName;
    if (value && value.trim()) name = value.trim();

    const fullOutput = generateFullOutput();
    const blob = new Blob([fullOutput], { type: "text/html" });
    const downloadURL = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadURL;
    a.download = name.endsWith(".html") ? name : name + ".html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadURL);
  });
}

// ---------------------------
// attach download button
// ---------------------------
downloadBtn.addEventListener("click", (e) => {
  e.preventDefault();
  downloadProject("project");
});

// === Auto Update on Input Change ===
htmlEditor.on("change", updatePreview);
cssEditor.on("change", updatePreview);
jsEditor.on("change", updatePreview);
pyEditor.on("change", updatePreview);

// === Dynamic Syntax Highlighting ===
htmlSelect.addEventListener("change", (e) => {
  if (e.target.value === "markdown") {
    htmlEditor.setOption("mode", "markdown");
  } else {
    htmlEditor.setOption("mode", "xml");
  }
});

jsSelect.addEventListener("change", (e) => {
  if (e.target.value === "typescript") {
    jsEditor.setOption("mode", "javascript"); // TypeScript uses JS highlighting
  } else {
    jsEditor.setOption("mode", "javascript");
  }
});

closePreviewBtn.addEventListener("click", () => {
  previewStyle.display = "none";
  document.body.classList.remove("dock-right", "dock-left", "dock-bottom");
  localStorage.removeItem("preferredDockMode");
  resizeEditors();
});

window.addEventListener("resize", () => {
  resizeEditors();

  const savedMode = localStorage.getItem("preferredDockMode");
  if (savedMode && previewScreen.style.display !== "none") {
    applyPreviewMode(savedMode);
  }
});

pySelect.addEventListener("change", (e) => {
  const lang = e.target.value;
  switch (lang) {
    case "python":
    case "brython":
      pyEditor.setOption("mode", "python");
      break;
    case "ruby":
      pyEditor.setOption("mode", "ruby");
      break;
    case "scheme":
      pyEditor.setOption("mode", "scheme");
      break;
    case "r":
      pyEditor.setOption("mode", "r");
      break;
    case "lua":
      pyEditor.setOption("mode", "lua");
      break;
    default:
      pyEditor.setOption("mode", "null"); // plain text
  }
});
pySelect.addEventListener("load", (e) => {
  const lang = e.target.value;
  switch (lang) {
    case "python":
    case "brython":
      pyEditor.setOption("mode", "python");
      break;
    case "ruby":
      pyEditor.setOption("mode", "ruby");
      break;
    case "scheme":
      pyEditor.setOption("mode", "scheme");
      break;
    case "r":
      pyEditor.setOption("mode", "r");
      break;
    case "lua":
      pyEditor.setOption("mode", "lua");
      break;
    default:
      pyEditor.setOption("mode", "null"); // plain text
  }
});

downloadBtn.addEventListener("click", () => {
  cyberPrompt("Enter your project name:", (value) => {
    if (!value) value = "project"; // default name

    // --- Generate full HTML output ---
    const fullOutput = generateFullOutput();

    // --- Create download link ---
    const a = document.createElement("a");
    const blob = new Blob([fullOutput], { type: "text/html" });
    const downloadURL = URL.createObjectURL(blob);
    a.href = downloadURL;
    a.download = value + ".html"; // use entered name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
});
