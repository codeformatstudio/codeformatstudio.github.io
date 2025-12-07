function generateLanguageScriptForPreview(lang, code) {
  const escapedCode = code.replace(/`/g, '\\`');
  switch(lang) {
    case "brython":
      return `<script type="text/python">${escapedCode}</script>`;
    case "ruby":
      return `<script type="text/ruby">${escapedCode}</script>`;
    case "scheme":
      return `<script type="text/x-scheme">${escapedCode}</script>`;
    case "r":
      return `<script type="text/r">${escapedCode}</script>`;
    case "lua":
      return `<script type="application/lua">${escapedCode}</script>`;
    default:
      return "";
  }
}

const RUNTIME_URLS = {
  brython: [
    "https://cdn.jsdelivr.net/npm/brython@3.12.0/brython.min.js",
    "https://cdn.jsdelivr.net/npm/brython@3.12.0/brython_stdlib.min.js"
  ],

  lua: [
    "https://unpkg.com/fengari-web/dist/fengari-web.js"
  ],

  ruby: [
    "https://cdn.opalrb.com/opal/current/opal.js"
  ],

  scheme: [
    "https://cdn.jsdelivr.net/npm/biwascheme@0.8.3/release/biwascheme.js"
  ],

  r: [
    "https://webr.r-wasm.org/latest/webr.mjs"
  ]
};
function injectRuntime(lang) {
  const urls = RUNTIME_URLS[lang] || [];
  return urls
    .map(url => {
      if (url.endsWith(".mjs")) {
        return `<script type="module" src="${url}"></script>`;
      }
      return `<script src="${url}"></script>`;
    })
    .join("\n");
}

window.addEventListener("beforeunload", function (event) {
    // Most browsers ignore the custom message, but you can set it
    const message = "Are you sure you want to leave this page?";
    
    event.preventDefault(); // Some browsers require this
    event.returnValue = message; // Legacy method for older browsers
    
    return message?true:false; // For some older browsers
});

function cyberPrompt(message, callback) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0,0,10,0.95)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "10000";
  overlay.style.color = "#00ffff";
  overlay.style.fontFamily = '"Orbitron", sans-serif';

  const msg = document.createElement("div");
  msg.textContent = message;
  msg.style.marginBottom = "20px";
  msg.style.fontSize = "20px";
  overlay.appendChild(msg);

  const input = document.createElement("input");
  input.style.padding = "10px";
  input.style.width = "300px";
  overlay.appendChild(input);

  const btnBox = document.createElement("div");
  btnBox.style.marginTop = "20px";

  const okBtn = document.createElement("button");
  okBtn.textContent = "OK";

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";

  function close(result) {
    callback(result);
    document.body.removeChild(overlay);
  }

  okBtn.onclick = () => close(input.value);
  cancelBtn.onclick = () => close(null);

  btnBox.appendChild(okBtn);
  btnBox.appendChild(cancelBtn);
  overlay.appendChild(btnBox);
  document.body.appendChild(overlay);

  input.focus();
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

  const htmlContent = htmlEditor.getValue();
  const cssContent = `<style>${cssEditor.getValue()}</style>`;
  const jsContent = jsEditor.getValue();
  const lang = pySelect.value;
  const code = pyEditor.getValue();

  const runtimeScripts = injectRuntime(lang);
  const pyScript = generateLanguageScriptForPreview(lang, code);

  doc.write(`
    ${htmlContent}
    ${cssContent}
    ${runtimeScripts}
    <script>${jsContent}</script>
    ${pyScript}
  `);
  doc.close();

  // Separate window preview
  if (previewWindow && !previewWindow.closed) {
    previewWindow.document.open();
    previewWindow.document.write(`
      ${htmlContent}
      ${cssContent}
      ${runtimeScripts}
      <script>${jsContent}</script>
      ${pyScript}
    `);
    previewWindow.document.close();
  }

  // Brython needs explicit initialization
  if (lang === "brython") {
    iframe.contentWindow.brython();
  }
}

function generateOutput() {
  const htmlContent = htmlEditor.getValue();
  const cssContent = `<style>${cssEditor.getValue()}</style>`;
  const jsContent = jsEditor.getValue();
  const lang = pySelect.value;

  const code = pyEditor.getValue().replace(/`/g, "\\`");

  // Insert language-specific runtime URLs
  const runtimeScripts = injectRuntime(lang);

  // Insert language-specific interpreter usage
  const pyScript = generateLanguageScript(lang, code);

  return `
    ${htmlContent}
    ${cssContent}

    ${runtimeScripts}

    <script>${jsContent}</script>
    ${pyScript}
  `;
}

// ---------------------------
// generateFullOutput (pure)
// ---------------------------
function generateFullOutput() {
  const htmlContent = htmlEditor.getValue();
  const cssContent = `<style>${cssEditor.getValue()}</style>`;
  const jsContent = jsEditor.getValue();
  const lang = pySelect.value;

  const code = pyEditor.getValue().replace(/`/g, "\\`");

  const runtimeScripts = injectRuntime(lang);
  const pyScript = generateLanguageScript(lang, code);

  return `
    ${htmlContent}
    ${cssContent}

    ${runtimeScripts}

    <script>${jsContent}</script>
    ${pyScript}
  `;
}
function generateLanguageScript(lang, code) {
  switch (lang) {
    case "brython":
      return `
        <script type="text/python" src="python/main.py"></script>
      `;

    case "lua":
      return `
        <script type="application/lua" src="lua/main.lua"></script>
      `;

    case "ruby":
      return `
        <script type="text/ruby" src="ruby/main.rb"></script>
      `;

    case "scheme":
      return `
        <script type="text/x-scheme" src="scheme/main.scm"></script>
      `;

    case "r":
      return `
        <script type="text/r" src="r/main.r"></script>
      `;

    default:
      return "";
  }
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

downloadBtn.addEventListener("click", (e) => {
  e.preventDefault();
  downloadProjectAsFolder();
});
async function downloadProjectAsFolder() {
  cyberPrompt("Enter your project name:", async (projectName) => {
    if (!projectName || !projectName.trim()) projectName = "project";

    // Ask the user where to save
    const root = await window.showDirectoryPicker();

    // Create main project directory
    const projectFolder = await root.getDirectoryHandle(projectName, { create: true });

    // ---------------------------
    // ✅ WEB FILES (Always Created)
    // ---------------------------
    await writeFile(projectFolder, "index.html", htmlEditor.getValue());
    await writeFile(projectFolder, "style.css", cssEditor.getValue());
    await writeFile(projectFolder, "script.js", jsEditor.getValue());

    // ---------------------------
    // ✅ LANGUAGE-SPECIFIC FOLDER
    // ---------------------------
    const lang = pySelect.value;   // ← THIS IS YOUR REAL DROPDOWN VALUE
    let folderName = null;
    let fileName = null;

    if (lang === "brython") {
      folderName = "python";
      fileName = "main.py";
    } 
    else if (lang === "python") {
      folderName = "python";
      fileName = "main.py";
    } 
    else if (lang === "ruby") {
      folderName = "ruby";
      fileName = "main.rb";
    } 
    else if (lang === "r") {
      folderName = "r";
      fileName = "main.r";
    } 
    else if (lang === "lua") {
      folderName = "lua";
      fileName = "main.lua";
    } 
    else if (lang === "scheme") {
      folderName = "scheme";
      fileName = "main.scm";
    }

    // ✅ Only create the language folder if one is selected
    if (folderName && fileName) {
      const langFolder = await projectFolder.getDirectoryHandle(folderName, { create: true });
      await writeFile(langFolder, fileName, pyEditor.getValue());
    }

    console.log("✅ Project created successfully with correct structure!");
  });
}

async function writeFile(dirHandle, name, content) {
  const fileHandle = await dirHandle.getFileHandle(name, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
}
