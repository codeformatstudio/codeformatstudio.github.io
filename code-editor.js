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

// === Docking Logic ===
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const mode = previewInput.value.toLowerCase();
  previewScreen.style.display = "block";

  // Reset all positioning first
  previewStyle.top = "";
  previewStyle.bottom = "";
  previewStyle.left = "";
  previewStyle.right = "";
  previewStyle.width = "";
  previewStyle.height = "";

  if (mode === "dock to bottom") {
    previewStyle.bottom = "0";
    previewStyle.left = "0";
    previewStyle.width = "100%";
    previewStyle.height = "250px";
  } else if (mode === "dock to right") {
    previewStyle.right = "0";
    previewStyle.top = "0";
    previewStyle.width = "50%";
    previewStyle.height = "100%";
  } else if (mode === "dock to left") {
    previewStyle.left = "0";
    previewStyle.top = "0";
    previewStyle.width = "50%";
    previewStyle.height = "100%";
  } else if (mode === "separate window") {
    previewStyle.top = "0";
    previewStyle.left = "0";
    previewStyle.width = "100%";
    previewStyle.height = "100%";
  }

  updatePreview();
});

// === Update Preview Function ===
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

  if (pySelect.value === "brython") {
    iframe.onload = () => {
      iframe.contentWindow.brython && iframe.contentWindow.brython();
    };
  }
}

// === Code Compilation and Assembly ===
function generateOutput() {
  let htmlContent = htmlEditor.getValue();
  let cssContent = `<style>${cssEditor.getValue()}</style>`;
  let jsContent = "";

  // --- HTML or Markdown ---
  if (htmlSelect.value === "markdown") {
    htmlContent = marked.parse(htmlEditor.getValue() || "");
  }

  // --- JS / TS Compilation ---
  if (jsSelect.value === "typescript") {
    try {
      jsContent = ts.transpile(jsEditor.getValue(), {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2020,
      });
    } catch (err) {
      jsContent = `console.error("TypeScript Error:", ${JSON.stringify(
        err.message
      )});`;
    }
  } else if (jsSelect.value === "javascript") {
    jsContent = jsEditor.getValue();
  }

  // --- Python (Brython) ---
  let pyScript = "";
  if (pySelect.value === "brython") {
    pyScript = `<script type="text/python">${pyEditor.getValue()}</script>`;
  }

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
function generateFullOutput() {
  let htmlContent = htmlEditor.getValue();
  let cssContent = `<style>${cssEditor.getValue()}</style>`;
  let jsContent = "";

  // --- HTML or Markdown ---
  if (htmlSelect.value === "markdown") {
    htmlContent = marked.parse(htmlEditor.getValue() || "");
  }

  // --- JS / TS Compilation ---
  if (jsSelect.value === "typescript") {
    try {
      jsContent = ts.transpile(jsEditor.getValue(), {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ESNext,
      });
    } catch (err) {
      jsContent = `console.error("TypeScript Error:", ${JSON.stringify(
        err.message
      )});`;
    }
  } else if (jsSelect.value === "javascript") {
    jsContent = jsEditor.getValue();
  }

  // --- Python (Brython) ---
  let pyScript = "";
  if (pySelect.value === "brython") {
    pyScript = `<script type="text/python">${pyEditor.getValue()}</script>`;
  }

  // === Final HTML Output ===
  const fullOutput = `
     <!DOCTYPE html>
     <html>
     <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
     </head>
     <body>
     ${htmlContent}
     ${cssContent}
     <script src="https://cdn.jsdelivr.net/npm/brython@3.14.0/brython.js"></script>
     <script src="https://cdn.jsdelivr.net/npm/typescript@5.6.3/lib/typescript.js"></script>
     <script src="https://cdn.jsdelivr.net/npm/marked@17.0.0/lib/marked.umd.js"></script>
     <script type="text/javascript">
     document.addEventListener("DOMContentLoaded", () => { if(typeof brython !== 'undefined') brython(); });
     ${jsContent}
     </script>
     ${pyScript}
     </body>
     </html>
   `;
  let name;
  cyberPrompt("Enter your project name:", (value) => {
    if (value === null) {
      value = "project";
      name = value;
    }
  });
  const a = document.createElement("a");
  generateOutput();
  const blob = new Blob([fullOutput], { type: "text/html" });
  const downloadURL = URL.createObjectURL(blob);
  a.href = downloadURL;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  return fullOutput;
}
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

closePreviewBtn.addEventListener("click", function () {
  previewStyle.display = "none";
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
