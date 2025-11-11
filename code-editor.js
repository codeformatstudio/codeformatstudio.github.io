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
  let htmlContent = htmlInput.value;
  let cssContent = `<style>${cssInput.value}</style>`;
  let jsContent = "";

  // --- HTML or Markdown ---
  if (htmlSelect.value === "markdown") {
    htmlContent = marked.parse(htmlInput.value || "");
  }

  // --- JS / TS Compilation ---
  if (jsSelect.value === "typescript") {
    try {
      jsContent = ts.transpile(jsInput.value, {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2020,
      });
    } catch (err) {
      jsContent = `console.error("TypeScript Error:", ${JSON.stringify(
        err.message
      )});`;
    }
  } else if (jsSelect.value === "javascript") {
    jsContent = jsInput.value;
  }

  // --- Python (Brython) ---
  let pyScript = "";
  if (pySelect.value === "brython") {
    pyScript = `<script type="text/python">${pyInput.value}</script>`;
  }

  // === Final HTML Output ===
  const fullOutput = `
    ${htmlContent}
    ${cssContent}
    <script src="https://cdn.jsdelivr.net/npm/brython@3.14.0/brython.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/typescript@5.6.3/lib/typescript.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked@17.0.0/lib/marked.umd.js"></script>
    <script type="text/javascript">
    window.onload = brython();
    ${jsContent}
    </script>
    ${pyScript}
  `;

  return fullOutput;
}
function generateFullOutput() {
  let htmlContent = htmlInput.value;
  let cssContent = `<style>${cssInput.value}</style>`;
  let jsContent = "";

  // --- HTML or Markdown ---
  if (htmlSelect.value === "markdown") {
    htmlContent = marked.parse(htmlInput.value || "");
  }

  // --- JS / TS Compilation ---
  if (jsSelect.value === "typescript") {
    try {
      jsContent = ts.transpile(jsInput.value, {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ESNext,
      });
    } catch (err) {
      jsContent = `console.error("TypeScript Error:", ${JSON.stringify(
        err.message
      )});`;
    }
  } else if (jsSelect.value === "javascript") {
    jsContent = jsInput.value;
  }

  // --- Python (Brython) ---
  let pyScript = "";
  if (pySelect.value === "brython") {
    pyScript = `<script type="text/python">${pyInput.value}</script>`;
  }

  // === Final HTML Output ===
  const fullOutput = `
    <!DOCTYPE html>
    ${htmlContent}
    ${cssContent}
    <script src="https://cdn.jsdelivr.net/npm/brython@3.14.0/brython.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/typescript@5.6.3/lib/typescript.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked@17.0.0/lib/marked.umd.js"></script>
    <script type="text/javascript">
    document.addEventListener("DOMContentLoaded", () => brython());

    ${jsContent}
    </script>
    ${pyScript}
  `;
  const name = prompt("Name your project");
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
[htmlInput, cssInput, jsInput, pyInput].forEach((el) => {
  el.addEventListener("input", updatePreview);
});
closePreviewBtn.addEventListener("click", function () {
  previewStyle.display = "none";
});
downloadBtn.addEventListener("click", generateFullOutput);
