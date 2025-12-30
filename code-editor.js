// ============================================
// Smart Autocompletion for All Languages
// ============================================

const LANGUAGE_KEYWORDS = {
    python: [
        'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue',
        'def', 'del', 'elif', 'else', 'except', 'False', 'finally', 'for',
        'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'None', 'nonlocal',
        'not', 'or', 'pass', 'raise', 'return', 'True', 'try', 'while', 'with', 'yield',
        'print', 'len', 'range', 'str', 'int', 'list', 'dict', 'set', 'tuple'
    ],
    ruby: [
        'alias', 'and', 'BEGIN', 'begin', 'break', 'case', 'class', 'def',
        'defined?', 'do', 'else', 'elsif', 'END', 'end', 'ensure', 'false',
        'for', 'if', 'in', 'module', 'next', 'nil', 'not', 'or', 'redo',
        'rescue', 'retry', 'return', 'self', 'super', 'then', 'true', 'undef',
        'unless', 'until', 'when', 'while', 'yield',
        'puts', 'print', 'gets', 'require', 'attr_reader', 'attr_writer', 'attr_accessor'
    ],
    lua: [
        'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for', 'function',
        'goto', 'if', 'in', 'local', 'nil', 'not', 'or', 'repeat', 'return',
        'then', 'true', 'until', 'while',
        'print', 'pairs', 'ipairs', 'table', 'string', 'math', 'io', 'os'
    ],
    scheme: [
        'define', 'lambda', 'let', 'let*', 'letrec', 'if', 'cond', 'case',
        'begin', 'do', 'quote', 'quasiquote', 'unquote', 'unquote-splicing',
        'set!', 'and', 'or', 'not', 'call/cc', 'apply', 'eval',
        'car', 'cdr', 'cons', 'list', 'append', 'length', 'reverse'
    ],
    r: [
        'if', 'else', 'for', 'while', 'repeat', 'break', 'next', 'function',
        'return', 'in', 'is.numeric', 'is.character', 'is.logical', 'is.null',
        'is.na', 'is.nan', 'TRUE', 'FALSE', 'NULL', 'NA', 'NaN', 'Inf',
        'c', 'list', 'data.frame', 'matrix', 'array', 'factor', 'paste', 'sprintf'
    ],
    javascript: [
        'abstract', 'arguments', 'await', 'boolean', 'break', 'byte', 'case', 'catch',
        'char', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do',
        'double', 'else', 'enum', 'eval', 'export', 'extends', 'false', 'final',
        'finally', 'float', 'for', 'function', 'goto', 'if', 'implements', 'import',
        'in', 'instanceof', 'int', 'interface', 'let', 'long', 'native', 'new', 'null',
        'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'super',
        'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try',
        'typeof', 'var', 'void', 'volatile', 'while', 'with', 'yield',
        'Array', 'Object', 'String', 'Number', 'Boolean', 'Date', 'Math', 'RegExp',
        'console', 'window', 'document', 'alert', 'setTimeout', 'setInterval'
    ]
};

const HTML_TAGS = [
    'html', 'head', 'body', 'title', 'meta', 'link', 'style', 'script',
    'header', 'nav', 'main', 'section', 'article', 'aside', 'footer',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'pre', 'code',
    'a', 'button', 'input', 'textarea', 'label', 'select', 'option', 'form',
    'table', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot', 'caption', 'col',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'img', 'video', 'audio', 'canvas',
    'svg', 'iframe', 'embed', 'object', 'param', 'source'
];

const CSS_PROPERTIES = [
    'align-content', 'align-items', 'align-self', 'background', 'background-color',
    'background-image', 'background-size', 'background-position', 'border',
    'border-color', 'border-radius', 'border-style', 'border-width', 'box-shadow',
    'box-sizing', 'color', 'cursor', 'display', 'filter', 'flex', 'flex-direction',
    'flex-wrap', 'float', 'font', 'font-family', 'font-size', 'font-style',
    'font-weight', 'gap', 'grid', 'grid-template', 'height', 'justify-content',
    'line-height', 'margin', 'max-height', 'max-width', 'min-height', 'min-width',
    'opacity', 'order', 'overflow', 'padding', 'position', 'text-align', 'text-decoration',
    'text-shadow', 'transform', 'transition', 'width', 'z-index'
];

// Create smart hint function for Python
function pythonHint(editor) {
    const cur = editor.getCursor();
    const token = editor.getTokenAt(cur);
    const word = token.string;

    const completions = LANGUAGE_KEYWORDS.python.filter(kw => kw.startsWith(word));

    return {
        from: { line: cur.line, ch: token.start },
        to: { line: cur.line, ch: token.end },
        list: completions.map(c => ({ text: c, className: 'hint-keyword' }))
    };
}

// Create smart hint function for Ruby
function rubyHint(editor) {
    const cur = editor.getCursor();
    const token = editor.getTokenAt(cur);
    const word = token.string;

    const completions = LANGUAGE_KEYWORDS.ruby.filter(kw => kw.startsWith(word));

    return {
        from: { line: cur.line, ch: token.start },
        to: { line: cur.line, ch: token.end },
        list: completions.map(c => ({ text: c, className: 'hint-keyword' }))
    };
}

// Create smart hint function for Lua
function luaHint(editor) {
    const cur = editor.getCursor();
    const token = editor.getTokenAt(cur);
    const word = token.string;

    const completions = LANGUAGE_KEYWORDS.lua.filter(kw => kw.startsWith(word));

    return {
        from: { line: cur.line, ch: token.start },
        to: { line: cur.line, ch: token.end },
        list: completions.map(c => ({ text: c, className: 'hint-keyword' }))
    };
}

// Create smart hint function for Scheme
function schemeHint(editor) {
    const cur = editor.getCursor();
    const token = editor.getTokenAt(cur);
    const word = token.string;

    const completions = LANGUAGE_KEYWORDS.scheme.filter(kw => kw.startsWith(word));

    return {
        from: { line: cur.line, ch: token.start },
        to: { line: cur.line, ch: token.end },
        list: completions.map(c => ({ text: c, className: 'hint-keyword' }))
    };
}

// Create smart hint function for R
function rHint(editor) {
    const cur = editor.getCursor();
    const token = editor.getTokenAt(cur);
    const word = token.string;

    const completions = LANGUAGE_KEYWORDS.r.filter(kw => kw.startsWith(word));

    return {
        from: { line: cur.line, ch: token.start },
        to: { line: cur.line, ch: token.end },
        list: completions.map(c => ({ text: c, className: 'hint-keyword' }))
    };
}

// Enhanced HTML hint with tags
function enhancedHtmlHint(editor) {
    const cur = editor.getCursor();
    const token = editor.getTokenAt(cur);
    const word = token.string;

    const completions = [
        ...HTML_TAGS.filter(tag => tag.startsWith(word)).map(t => ({ text: t, className: 'hint-tag' })),
        ...LANGUAGE_KEYWORDS.javascript.filter(kw => kw.startsWith(word)).map(k => ({ text: k, className: 'hint-keyword' }))
    ];

    return {
        from: { line: cur.line, ch: token.start },
        to: { line: cur.line, ch: token.end },
        list: completions
    };
}

// Enhanced CSS hint with properties
function enhancedCssHint(editor) {
    const cur = editor.getCursor();
    const token = editor.getTokenAt(cur);
    const word = token.string;

    const completions = CSS_PROPERTIES.filter(prop => prop.startsWith(word)).map(p => ({
        text: p,
        className: 'hint-property'
    }));

    return {
        from: { line: cur.line, ch: token.start },
        to: { line: cur.line, ch: token.end },
        list: completions
    };
}

// Enhanced JavaScript hint
function enhancedJavaScriptHint(editor) {
    const cur = editor.getCursor();
    const token = editor.getTokenAt(cur);
    const word = token.string;

    const completions = [
        ...LANGUAGE_KEYWORDS.javascript.filter(kw => kw.startsWith(word)).map(k => ({
            text: k,
            className: 'hint-keyword'
        })),
        ...HTML_TAGS.filter(tag => tag.startsWith(word)).map(t => ({
            text: `'${t}'`,
            className: 'hint-tag'
        }))
    ];

    return {
        from: { line: cur.line, ch: token.start },
        to: { line: cur.line, ch: token.end },
        list: completions
    };
}

// Language-aware autocomplete handler
function updateLanguageHints(editor, language) {
    const langMap = {
        'brython': pythonHint,
        'python': pythonHint,
        'ruby': rubyHint,
        'lua': luaHint,
        'scheme': schemeHint,
        'r': rHint,
        'wat': enhancedJavaScriptHint
    };

    const hintFunction = langMap[language] || pythonHint;

    editor.off('inputRead');
    editor.on('inputRead', function (ed, changeObj) {
        if (changeObj.text[0].match(/[a-zA-Z0-9_\-]/)) {
            ed.showHint({ hint: hintFunction, completeSingle: false });
        }
    });
}

// ============================================
// Auto-closing Tags for HTML
// ============================================

function autoCloseTag(cm, char) {
    if (char === '>') {
        const pos = cm.getCursor();
        const token = cm.getTokenAt(pos);

        if (token.type && token.type.includes('tag')) {
            const line = cm.getLine(pos.line);
            const before = line.substring(0, pos.ch);

            // Check if it's an opening tag (not self-closing)
            if (before.match(/<[a-zA-Z][^>]*$/) && !before.match(/\/\s*$/)) {
                const tagMatch = before.match(/<([a-zA-Z][a-zA-Z0-9]*)\b/);
                if (tagMatch) {
                    const tagName = tagMatch[1];
                    const selfClosing = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

                    if (!selfClosing.includes(tagName.toLowerCase())) {
                        cm.replaceSelection(`></${tagName}>`, 'end');
                        cm.setCursor({ line: pos.line, ch: pos.ch + 1 });
                    } else {
                        cm.replaceSelection(char, 'end');
                    }
                } else {
                    cm.replaceSelection(char, 'end');
                }
            } else {
                cm.replaceSelection(char, 'end');
            }
        } else {
            cm.replaceSelection(char, 'end');
        }
    } else {
        cm.replaceSelection(char, 'end');
    }
}

/**
 * Shows a cyber-styled confirm dialog with three options.
 * @param {string} message - The message to show.
 * @param {function("zip"|"single"|"multiple")} callback - Returns the user's choice.
 */
const DOWNLOAD_FORMATS = [
    { value: "zip", label: "ZIP (.zip) – Recommended" },
    { value: "tar", label: "TAR (.tar)" },
    { value: "tar.gz", label: "TAR.GZ (.tar.gz)" },
    { value: "tar.bz2", label: "TAR.BZ2 (.tar.bz2)" },
    { value: "tar.xz", label: "TAR.XZ (.tar.xz)" },
    { value: "7z", label: "7Z (.7z)" }
];

function cyberConfirm(message, callback) {
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

    // Message
    const msg = document.createElement("div");
    msg.textContent = message;
    msg.style.marginBottom = "20px";
    msg.style.fontSize = "20px";
    overlay.appendChild(msg);

    // Buttons container
    const btnBox = document.createElement("div");

    const zipBtn = document.createElement("button");
    zipBtn.textContent = "ZIP";
    zipBtn.style.marginRight = "10px";

    const singleBtn = document.createElement("button");
    singleBtn.textContent = "Single";
    singleBtn.style.marginRight = "10px";

    const multipleBtn = document.createElement("button");
    multipleBtn.textContent = "Multiple";

    // Button handlers
    zipBtn.onclick = () => { document.body.removeChild(overlay); callback("zip"); };
    singleBtn.onclick = () => { document.body.removeChild(overlay); callback("single"); };
    multipleBtn.onclick = () => { document.body.removeChild(overlay); callback("multiple"); };

    btnBox.appendChild(zipBtn);
    btnBox.appendChild(singleBtn);
    btnBox.appendChild(multipleBtn);

    overlay.appendChild(btnBox);
    document.body.appendChild(overlay);
}

function generateLanguageScriptForPreview(lang, code) {
    const escapedCode = code.replace(/`/g, '\\`');

    switch (lang) {
        case "python":
            return `<script type="text/python">
        ${escapedCode}
      </script>`;

        case "ruby":
            return `<script id="ruby-script">
        (function() {
          if (window.Opal) {
            Opal.eval(\`${escapedCode}\`);
          }
        })();
      </script>`;

        case "lua":
            return `<script id="lua-script">
        (function() {
          if (window.fengari) {
            fengari.load(\`${escapedCode}\`)();
          }
        })();
      </script>`;

        case "scheme":
            return `<script id="scheme-script">
        (function() {
          if (window.BiwaScheme) {
            const interpreter = new BiwaScheme.Interpreter();
            interpreter.evaluate(\`${escapedCode}\`);
          }
        })();
      </script>`;

        case "r":
            return `<script id="r-script" type="module">
        (async function() {
          if (window.WebR) {
            const { WebR } = window;
            const webR = new WebR();
            await webR.init();
            await webR.evalR(\`${escapedCode}\`);
          }
        })();
      </script>`;

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
    ],
    wat: [
        "https://cdn.jsdelivr.net/npm/wabt/index.js"
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
    if (!htmlEditor.isClean() || !cssEditor.isClean() || !jsEditor.isClean() || !pyEditor.isClean()) {
        const message = "Are you sure you want to leave this page?";

        event.preventDefault(); // Some browsers require this
        event.returnValue = message; // Legacy method for older browsers

        return message ? true : false; // For some older browsers\
    }
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
const previewContent = document.getElementById("previewContent");
const previewStyle = previewScreen.style;

// Variable declarations before use
let previewTimer = null;
const htmlEditor = CodeMirror.fromTextArea(htmlInput, {
    mode: "htmlmixed",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    viewportMargin: 50,
    indentUnit: 2,
    indentWithTabs: false,
    extraKeys: {
        "Ctrl-Space": "autocomplete",
        "'>'": function (cm) { autoCloseTag(cm, '>'); },
        "'/'": function (cm) { autoCloseTag(cm, '/'); }
    }
});
htmlEditor.getWrapperElement().style.fontFamily = '"Consolas", "Monaco", "Courier New", monospace';
htmlEditor.on('inputRead', function (editor, changeObj) {
    if (changeObj.text[0].match(/[a-zA-Z<]/)) {
        editor.showHint({ hint: enhancedHtmlHint, completeSingle: false });
    }
});

const cssEditor = CodeMirror.fromTextArea(cssInput, {
    mode: "css",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    viewportMargin: 50,
    indentUnit: 2,
    indentWithTabs: false,
    extraKeys: {
        "Ctrl-Space": "autocomplete"
    }
});
cssEditor.getWrapperElement().style.fontFamily = '"Consolas", "Monaco", "Courier New", monospace';
cssEditor.on('inputRead', function (editor, changeObj) {
    if (changeObj.text[0].match(/[a-zA-Z-]/)) {
        editor.showHint({ hint: enhancedCssHint, completeSingle: false });
    }
});

const jsEditor = CodeMirror.fromTextArea(jsInput, {
    mode: "javascript",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    viewportMargin: 50,
    indentUnit: 2,
    indentWithTabs: false,
    extraKeys: {
        "Ctrl-Space": "autocomplete"
    }
});
jsEditor.getWrapperElement().style.fontFamily = '"Consolas", "Monaco", "Courier New", monospace';
jsEditor.on('inputRead', function (editor, changeObj) {
    if (changeObj.text[0].match(/[a-zA-Z0-9_]/)) {
        editor.showHint({ hint: enhancedJavaScriptHint, completeSingle: false });
    }
});

const pyEditor = CodeMirror.fromTextArea(pyInput, {
    mode: "python",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    viewportMargin: 50,
    indentUnit: 2,
    indentWithTabs: false,
    extraKeys: {
        "Ctrl-Space": "autocomplete"
    }
});
pyEditor.getWrapperElement().style.fontFamily = '"Consolas", "Monaco", "Courier New", monospace';
pyEditor.on('inputRead', function (editor, changeObj) {
    if (changeObj.text[0].match(/[a-zA-Z0-9_]/)) {
        editor.showHint({ hint: pythonHint, completeSingle: false });
    }
});

// Add language-aware autocomplete handler
pyEditor.on('change', function (editor) {
    const lang = pySelect.value;
    updateLanguageHints(editor, lang);
});

// Initialize hints based on language selection
pySelect.addEventListener('change', (e) => {
    updateLanguageHints(pyEditor, e.target.value);
});

let previewWindow = null;

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const mode = previewInput.value.toLowerCase().trim();

    // RESET EVERYTHING
    document.body.classList.remove(
        "dock-right",
        "dock-left",
        "dock-bottom",
        "dock-top"
    );

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
    document.body.classList.remove(
        "dock-right",
        "dock-left",
        "dock-bottom",
        "dock-top"
    );


    previewStyle.display = "block";

    if (mode === "new tab") {
        previewStyle.display = 'none';
        if (!previewWindow || previewWindow.closed) {
            previewWindow = window.open("", `_blank", "width=${screen.width},height=${screen.height}`);
        }
        previewWindow.document.open();
        previewWindow.document.write(generateFullOutput());
        previewWindow.document.close();
        return;
    }
    if (mode === "separate window") {
        previewStyle.display = "none"; // hide the dock preview

        const features = `
    width=${screen.width},
    height=${screen.height},
    left=0,
    top=0,
    resizable=yes,
    scrollbars=yes,
    toolbar=no,
    menubar=no
  `.replace(/\s/g, ''); // remove spaces

        // Reuse window if it's already open
        if (!previewWindow || previewWindow.closed) {
            previewWindow = window.open("", "previewWindow", features);
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
    } else if (mode === "dock to top") {
        document.body.classList.add("dock-top");
    }

    schedulePreviewUpdate(true);
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
        cyberAlert("No saved preview mode yet!\nUse the preview input field to set your preference.");
        return;
    }

    applyPreviewMode(savedMode);
});

// Auto-load saved preview mode on page load
window.addEventListener("load", () => {
    const savedMode = localStorage.getItem("preferredDockMode");
    if (savedMode) {
        previewInput.value = savedMode;
        // Uncomment the line below to auto-apply the saved mode on page load
        // applyPreviewMode(savedMode);
    }
});
function updatePreview() {
    previewContent.innerHTML = ""; // clear previous iframe

    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    previewContent.appendChild(iframe);

    let rawHTML = htmlEditor.getValue();

    // 🔥 If HTML section is set to Markdown → convert it
    if (htmlSelect.value === "markdown") {
        rawHTML = marked.parse(rawHTML);
    }

    const htmlContent = "<!DOCTYPE html>\n" + rawHTML;
    const cssContent = `<style>${cssEditor.getValue()}</style>`;
    const jsContent = jsEditor.getValue();
    const lang = pySelect.value;
    const code = pyEditor.getValue();

    const runtimeScripts = injectRuntime(lang);
    const pyScript = generateLanguageScriptForPreview(lang, code);
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(generateFullOutput());
    doc.close();
    // new tab preview
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

    // Brython initialization
    if (lang === "brython") {
        setTimeout(() => iframe.contentWindow.brython(), 100);
        if (previewWindow && !previewWindow.closed) {
            setTimeout(() => previewWindow.brython(), 100);
        }
    }
}

function generateOutput() {
    const htmlContent = htmlEditor.getValue();
    if (htmlSelect.value === "markdown") {
        htmlContent = marked.parse(htmlContent);
    }
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
    let rawHTML = htmlEditor.getValue();
    if (htmlSelect.value === "markdown") rawHTML = marked.parse(rawHTML);

    const cssContent = `<style>${cssEditor.getValue()}</style>`;
    const jsContent = jsEditor.getValue();
    const lang = pySelect.value;
    const code = pyEditor.getValue();

    const runtimeScripts = injectRuntime(lang);
    const pyScript = generateLanguageScriptForPreview(lang, code);

    // Wrap everything in proper HTML
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Preview</title>
${cssContent}
${runtimeScripts}
</head>
<body>
${rawHTML}
<script>
${jsContent}
</script>
${pyScript}
</body>
</html>
  `;
}


function generateLanguageScript(lang, code) {
    switch (lang) {
        case "brython":
            return `
        <script type="text/python" src="python/main.py"></script>
        <script>window.onload = ()=>{brython();}
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
        case "wat":
            return `
<script>
(async () => {
  if (!window.WabtModule) return;

  const wabt = await WabtModule();

  try {
    const response = await fetch("wasm/module.wat");
    const watSource = await response.text();

    const module = wabt.parseWat("module.wat", watSource);
    const { buffer } = module.toBinary({});

    const wasmModule = await WebAssembly.instantiate(buffer, {
      env: {
        log: (x) => console.log("WASM:", x)
      }
    });

    if (wasmModule.instance.exports._start) {
      wasmModule.instance.exports._start();
    } else if (wasmModule.instance.exports.main) {
      console.log("Result:", wasmModule.instance.exports.main());
    }

  } catch (e) {
    console.error("WAT Error:", e);
  }
})();
</script>
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

// === Dynamic Syntax Highlighting ===
htmlSelect.addEventListener("change", (e) => {
    if (e.target.value === "markdown") {
        htmlEditor.setOption("mode", "markdown");
    } else {
        htmlEditor.setOption("mode", "htmlmixed");
    }
});
htmlSelect.addEventListener("load", (e) => {
    if (e.target.value === "markdown") {
        htmlEditor.setOption("mode", "markdown");
    } else {
        htmlEditor.setOption("mode", "htmlmixed");
    }
});


jsSelect.addEventListener("change", (e) => {
    if (e.target.value === "typescript") {
        jsEditor.setOption("mode", "javascript"); // TypeScript uses JS highlighting
    } else {
        jsEditor.setOption("mode", "javascript");
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
    document.body.classList.remove(
        "dock-right",
        "dock-left",
        "dock-bottom",
        "dock-top"
    );

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
        case "wat":
            pyEditor.setOption("mode", "wast"); // ✅ CodeMirror WAT mode
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
        case "wat":
            pyEditor.setOption("mode", "wast"); // ✅ CodeMirror WAT mode
            break;
        default:
            pyEditor.setOption("mode", "null"); // plain text
    }
});

function downloadMultipleFilesFallback(projectName) {
    const files = {
        "index.html": htmlSelect.value === "markdown" ? marked.parse(htmlEditor.getValue()) : htmlEditor.getValue(),
        "style.css": cssEditor.getValue(),
        "script.js": jsEditor.getValue()
    };

    const lang = pySelect.value;
    let ext = null;

    if (lang === "python" || lang === "brython") ext = "py";
    else if (lang === "ruby") ext = "rb";
    else if (lang === "lua") ext = "lua";
    else if (lang === "scheme") ext = "scm";
    else if (lang === "r") ext = "r";
    else if (lang === "wat") ext = "wat";


    if (lang === "wat") {
        files["wasm_module.wat"] = pyEditor.getValue();
    } else if (ext) {
        files[`main.${ext}`] = pyEditor.getValue();
    }


    for (const [filename, content] of Object.entries(files)) {
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = projectName + "_" + filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }
}
async function downloadProjectFallback() {
    cyberPrompt("Enter your project name:", async (projectName) => {
        if (!projectName || !projectName.trim()) projectName = "project";

        const ua = navigator.userAgent.toLowerCase();
        const isChromium = ua.includes("chrome") || ua.includes("edg") || ua.includes("chromium");

        if (isChromium && window.showDirectoryPicker) {
            // Normal folder download
            const root = await window.showDirectoryPicker();
            const projectFolder = await root.getDirectoryHandle(projectName, { create: true });

            await writeFile(projectFolder, "index.html", htmlSelect.value === "markdown" ? marked.parse(htmlEditor.getValue()) : htmlEditor.getValue());
            await writeFile(projectFolder, "style.css", cssEditor.getValue());
            await writeFile(projectFolder, "script.js", jsEditor.getValue());

            const lang = pySelect.value;
            let folderName, fileName;

            if (lang === "python" || lang === "brython") { folderName = "python"; fileName = "main.py"; }
            else if (lang === "ruby") { folderName = "ruby"; fileName = "main.rb"; }
            else if (lang === "lua") { folderName = "lua"; fileName = "main.lua"; }
            else if (lang === "scheme") { folderName = "scheme"; fileName = "main.scm"; }
            else if (lang === "r") { folderName = "r"; fileName = "main.r"; }
            else if (lang === "wat") { folderName = "wasm"; fileName = "module.wat"; }

            if (folderName && fileName) {
                const langFolder = await projectFolder.getDirectoryHandle(folderName, { create: true });
                await writeFile(langFolder, fileName, pyEditor.getValue());
            }

            console.log("✅ Project folder created successfully!");
            return;
        }

        // Fallback for non-Chromium browsers
        cyberConfirm("Your browser doesn't support folder download. Choose ZIP, Single HTML, or Multiple Files.", async (choice) => {
            if (choice === true) {
                // Single HTML
                const blob = new Blob([generateFullOutput()], { type: "text/html" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = projectName + ".html";
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else if (choice === false) {
                // Multiple files
                downloadMultipleFilesFallback(projectName);
            } else {
                // ZIP fallback
                await downloadProjectAsZip(projectName);
            }
        });
    });
}
function exportMarkdown(projectName, markdownCode) {
    const zip = new JSZip();
  
    const name = projectName || "project";
  
    // Save raw markdown
    zip.file(`index.md`, markdownCode);
  
    // Convert markdown → HTML
    const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>${name}</title>
  </head>
  <body>
  ${marked.parse(markdownCode)}
  </body>
  </html>`;
  
    zip.file("index.html", html);
  
    zip.generateAsync({ type: "blob" }).then(blob => {
      saveAs(blob, `${name}.zip`);
    });
  }
  
// Updated ZIP function to accept projectName
async function downloadProjectAsZip(projectName) {
    const zip = new JSZip();

    // Core files
    let htmlContent = htmlEditor.getValue();
    if (htmlSelect.value === "markdown") htmlContent = marked.parse(htmlContent);

    zip.file("index.html", htmlContent);
    zip.file("style.css", cssEditor.getValue());
    zip.file("script.js", jsEditor.getValue());

    const lang = pySelect.value;
    let folderName, fileName;

    if (lang === "python" || lang === "brython") { folderName = "python"; fileName = "main.py"; }
    else if (lang === "ruby") { folderName = "ruby"; fileName = "main.rb"; }
    else if (lang === "lua") { folderName = "lua"; fileName = "main.lua"; }
    else if (lang === "scheme") { folderName = "scheme"; fileName = "main.scm"; }
    else if (lang === "r") { folderName = "r"; fileName = "main.r"; }
    else if (lang === "wat") { folderName = "wasm"; fileName = "module.wat"; }

    if (folderName && fileName) {
        zip.folder(folderName).file(fileName, pyEditor.getValue());
    }

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, projectName + ".zip");
}

// Export button is handled below with improved export system
async function downloadByFormat(projectName, format) {
    switch (format) {
        case "zip":
            await downloadProjectAsZip(projectName);
            break;

        case "tar":
        case "tar.gz":
        case "tar.bz2":
        case "tar.xz":
        case "7z":
            alert(
                `⚠️ ${format.toUpperCase()} is selected.\n\n` +
                `This format requires a WebAssembly compression library.\n` +
                `ZIP works immediately.\n\n` +
                `You can add:\n` +
                `• fflate (gzip)\n` +
                `• xz-wasm\n` +
                `• bzip2-wasm\n` +
                `• js7z`
            );
            break;

        default:
            alert("Unknown format");
    }
}
function collectProjectFiles() {
    const files = [];

    const rawHtml = htmlEditor.getValue();
    const rawCss = cssEditor.getValue();
    const rawJs = jsEditor.getValue();
    const rawMarkdown = htmlSelect.value === "markdown" ? rawHtml : null;

    /* ---------- HTML ---------- */
    const htmlOutput =
        htmlSelect.value === "markdown"
            ? marked.parse(rawHtml)
            : rawHtml;

    files.push({
        name: "index.html",
        content: htmlOutput
    });

    /* ---------- CSS ---------- */
    files.push({
        name: "style.css",
        content: rawCss
    });

    /* ---------- JavaScript ---------- */
    files.push({
        name: "script.js",
        content: rawJs
    });

    /* ---------- TypeScript ---------- */
    if (jsSelect.value === "typescript") {
        files.push({
            name: "script.ts",
            content: rawJs
        });
    }

    /* ---------- Markdown ---------- */
    if (rawMarkdown) {
        files.push({
            name: "README.md",
            content: rawMarkdown
        });
    }

    /* ---------- Backend / Language files ---------- */
    const lang = pySelect.value;
    const map = {
        python: ["python/main.py"],
        brython: ["python/main.py"],
        ruby: ["ruby/main.rb"],
        lua: ["lua/main.lua"],
        scheme: ["scheme/main.scm"],
        r: ["r/main.r"],
        wat: ["wasm/module.wat"]
    };

    if (map[lang]) {
        files.push({
            name: map[lang][0],
            content: pyEditor.getValue()
        });
    }

    return files;
}
function isAnyPreviewOpen() {
    // Docked preview visible
    if (previewScreen && previewScreen.style.display !== "none") {
        return true;
    }

    // New tab / separate window preview open
    if (previewWindow && !previewWindow.closed) {
        return true;
    }

    return false;
}


function downloadAsTar(projectName) {
    const tar = new Tar();
    const files = collectProjectFiles();

    files.forEach(f => {
        tar.append(f.name, new TextEncoder().encode(f.content));
    });

    const blob = new Blob([tar.out], { type: "application/x-tar" });
    saveAs(blob, projectName + ".tar");
}
function downloadAsTarGz(projectName) {
    const tar = new Tar();
    const files = collectProjectFiles();

    files.forEach(f => {
        tar.append(f.name, new TextEncoder().encode(f.content));
    });

    // gzip compression
    const gzipped = fflate.gzipSync(tar.out, { level: 9 });

    const blob = new Blob([gzipped], { type: "application/gzip" });
    saveAs(blob, projectName + ".tar.gz");
}
async function downloadByFormat(projectName, format) {
    switch (format) {
        case "zip":
            await downloadProjectAsZip(projectName);
            break;

        case "tar":
            downloadAsTar(projectName);
            break;

        case "tar.gz":
            downloadAsTarGz(projectName);
            break;

        case "tar.bz2":
        case "tar.xz":
        case "7z":
            alert(
                `${format.toUpperCase()} is not implemented yet.\n\n` +
                `Planned via WebAssembly (heavy but possible).`
            );
            break;

        default:
            alert("Unknown format");
    }
}

async function downloadProjectAsFolder() {
    cyberPrompt("Enter your project name:", async (projectName) => {
        if (!projectName || !projectName.trim()) projectName = "project";

        // ------------------------------
        // 🔥 Detect non-Chromium browsers
        // ------------------------------
        const ua = navigator.userAgent.toLowerCase();
        const isChromium = ua.includes("chrome") || ua.includes("edg") || ua.includes("chromium");

        if (!isChromium) {
            cyberConfirm(
                "Your browser doesn't support downloading folders.\nDownload as a single file or multiple files?",
                (choice) => {
                    if (choice) {
                        // user chose "Single File"
                        const full = generateFullOutput();
                        const blob = new Blob([full], { type: "text/html" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = projectName + ".html";
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        URL.revokeObjectURL(url);
                    } else {
                        // user chose "Multiple Files"
                        downloadMultipleFilesFallback(projectName);
                    }
                }
            );
            return; // stop normal folder download
        }

        // ------------------------------
        // Chromium → normal folder download
        // ------------------------------
        const root = await window.showDirectoryPicker();
        const projectFolder = await root.getDirectoryHandle(projectName, { create: true });

        await writeFile(projectFolder, "index.html", htmlEditor.getValue());
        await writeFile(projectFolder, "style.css", cssEditor.getValue());
        await writeFile(projectFolder, "script.js", jsEditor.getValue());

        const lang = pySelect.value;
        let folderName = null;
        let fileName = null;

        if (lang === "python" || lang === "brython") {
            folderName = "python"; fileName = "main.py";
        }
        else if (lang === "ruby") {
            folderName = "ruby"; fileName = "main.rb";
        }
        else if (lang === "r") {
            folderName = "r"; fileName = "main.r";
        }
        else if (lang === "lua") {
            folderName = "lua"; fileName = "main.lua";
        }
        else if (lang === "scheme") {
            folderName = "scheme"; fileName = "main.scm";
        }
        else if (lang === "wat") {
            folderName = "wasm"; fileName = "module.wat";
        }


        if (folderName && fileName) {
            const langFolder = await projectFolder.getDirectoryHandle(folderName, { create: true });
            await writeFile(langFolder, fileName, pyEditor.getValue());
        }

        console.log("✅ Project folder created successfully!");
    });
}


async function writeFile(dirHandle, name, content) {
    const fileHandle = await dirHandle.getFileHandle(name, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
}

let previewUpdateTimer = null;
let previewDirty = false;

// Cache last rendered state
const lastPreviewState = {
    html: "",
    css: "",
    js: "",
    py: "",
    htmlMode: "",
    jsMode: "",
    pyMode: ""
};
function markPreviewDirty() {
    previewDirty = true;
    schedulePreviewUpdate();
}

htmlEditor.on("change", markPreviewDirty);
cssEditor.on("change", markPreviewDirty);
jsEditor.on("change", markPreviewDirty);
pyEditor.on("change", markPreviewDirty);
function schedulePreviewUpdate(force = false) {
    // 💤 Freeze if tab not visible (unless forced)
    if (!force && document.visibilityState !== "visible") return;

    // 🚫 No preview open → no work
    if (!force && !isAnyPreviewOpen()) return;

    // 🧠 Nothing changed → skip
    if (!force && !previewDirty) return;

    // Cancel pending work
    if (previewUpdateTimer) {
        cancelAnimationFrame(previewUpdateTimer);
        previewUpdateTimer = null;
    }

    const run = () => {
        previewUpdateTimer = null;

        // Re-check before heavy work
        if (!force && (!isAnyPreviewOpen() || document.visibilityState !== "visible")) {
            return;
        }

        // 🎯 Diff check (skip iframe rebuild if identical)
        const currentState = {
            html: htmlEditor.getValue(),
            css: cssEditor.getValue(),
            js: jsEditor.getValue(),
            py: pyEditor.getValue(),
            htmlMode: htmlSelect.value,
            jsMode: jsSelect.value,
            pyMode: pySelect.value
        };

        let changed = false;
        for (const key in currentState) {
            if (currentState[key] !== lastPreviewState[key]) {
                changed = true;
                break;
            }
        }

        if (!changed && !force) {
            previewDirty = false;
            return;
        }

        // Update cache
        Object.assign(lastPreviewState, currentState);
        previewDirty = false;

        updatePreview();
    };

    // ⚡ Prefer idle time when typing fast
    if (!force && "requestIdleCallback" in window) {
        previewUpdateTimer = requestIdleCallback(run, { timeout: 300 });
    } else {
        previewUpdateTimer = requestAnimationFrame(run);
    }
}



// ============================================
// 🔥 FILE OPENING & EXPORT FEATURES
// ============================================

const fileInput = document.getElementById('fileInput');
const fileInputFallback = document.getElementById('fileInputFallback');
const openFileBtn = document.getElementById('openFileBtn');
const exportBtn = document.getElementById('exportBtn');
const projectNameInput = document.getElementById('projectNameInput');

// Track opened files for export
let openedProjectFiles = {};
let openedProjectName = 'untitled';

// Shared file loading handler
async function loadProjectFiles(files) {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    openedProjectFiles = {};
    let loadedCount = 0;
    let failedCount = 0;

    try {
        for (const file of fileArray) {
            try {
                const content = await file.text();
                const path = file.webkitRelativePath || file.name;
                openedProjectFiles[path] = content;

                // Auto-load HTML files
                if (path.endsWith('.html') || path.endsWith('index.html')) {
                    htmlEditor.setValue(content);
                    htmlSelect.value = 'html';
                    loadedCount++;
                }
                // Auto-load CSS files
                else if (path.endsWith('.css') || path.endsWith('style.css')) {
                    cssEditor.setValue(content);
                    loadedCount++;
                }
                // Auto-load JavaScript files
                else if (path.endsWith('.js') || path.endsWith('script.js')) {
                    jsEditor.setValue(content);
                    jsSelect.value = 'javascript';
                    loadedCount++;
                }
                // Auto-load Python files
                else if (path.endsWith('.py') || path.endsWith('main.py')) {
                    pyEditor.setValue(content);
                    pySelect.value = 'brython';
                    loadedCount++;
                }
                // Auto-load Ruby files
                else if (path.endsWith('.rb') || path.endsWith('main.rb')) {
                    pyEditor.setValue(content);
                    pySelect.value = 'ruby';
                    loadedCount++;
                }
                // Auto-load Lua files
                else if (path.endsWith('.lua') || path.endsWith('main.lua')) {
                    pyEditor.setValue(content);
                    pySelect.value = 'lua';
                    loadedCount++;
                }
                // Auto-load Scheme files
                else if (path.endsWith('.scm') || path.endsWith('main.scm')) {
                    pyEditor.setValue(content);
                    pySelect.value = 'scheme';
                    loadedCount++;
                }
                // Auto-load R files
                else if (path.endsWith('.r') || path.endsWith('main.r')) {
                    pyEditor.setValue(content);
                    pySelect.value = 'r';
                    loadedCount++;
                }
                // Auto-load WebAssembly files
                else if (path.endsWith('.wat') || path.endsWith('main.wat')) {
                    pyEditor.setValue(content);
                    pySelect.value = 'wat';
                    loadedCount++;
                }
                else {
                    loadedCount++;
                }
            } catch (error) {
                console.warn(`Failed to load file: ${file.name}`, error);
                failedCount++;
            }
        }

        // Extract project name
        const folderPath = fileArray[0].webkitRelativePath || fileArray[0].name || '';
        openedProjectName = folderPath.split('/')[0] || 'project';
        projectNameInput.value = openedProjectName;

        // Show summary notification
        let message = `✅ Loaded ${loadedCount} file${loadedCount !== 1 ? 's' : ''} from "${openedProjectName}"`;
        if (failedCount > 0) {
            message += `\n⚠️ Failed to load ${failedCount} file${failedCount !== 1 ? 's' : ''}`;
        }
        cyberAlert(message);

        // Schedule preview update
        schedulePreviewUpdate();
    } catch (error) {
        cyberAlert(`❌ Error loading project:\n${error.message}`);
        console.error('Project loading error:', error);
    }
}

// Open project files with fallback
openFileBtn.addEventListener('click', () => {
    // Try folder selection first (modern browsers)
    fileInput.click();
});

// Handle folder selection
fileInput.addEventListener('change', (e) => {
    loadProjectFiles(e.target.files);
});

// Handle file selection fallback
fileInputFallback.addEventListener('change', (e) => {
    loadProjectFiles(e.target.files);
});

// ============================================
// Compression & Export Functions
// ============================================

const EXPORT_FORMATS = [
    { value: 'zip', label: 'ZIP (.zip) - Fast & Universal' },
    { value: 'folder', label: 'Folder (Chromium browsers)' },
    { value: '7z', label: '7Z (.7z) - Excellent Compression' },
    { value: 'gzip', label: 'GZIP (.tar.gz) - Unix Standard' },
    { value: 'deflate', label: 'DEFLATE (.deflate) - Raw' },
    { value: 'zlib', label: 'Zlib (.zlib) - With Header' },
    { value: 'tar', label: 'TAR (.tar) - Archive Only' },
    { value: 'tar.xz', label: 'TAR.XZ (.tar.xz) - Best Compression' },
];

function cyberAlert(message) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,10,0.95);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    color: #00ffff;
    font-family: "Orbitron", sans-serif;
    font-size: 18px;
    text-align: center;
  `;
    overlay.textContent = message;

    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.style.cssText = `
    margin-top: 20px;
    padding: 10px 20px;
    background: #00ffff;
    color: #000010;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
  `;
    btn.onclick = () => document.body.removeChild(overlay);

    overlay.appendChild(btn);
    document.body.appendChild(overlay);
}

function cyberFormatSelect(message, formats, callback) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,10,0.95);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    color: #00ffff;
    font-family: "Orbitron", sans-serif;
  `;

    const title = document.createElement('div');
    title.textContent = message;
    title.style.cssText = 'font-size: 20px; margin-bottom: 20px;';
    overlay.appendChild(title);

    const select = document.createElement('select');
    select.style.cssText = `
    padding: 10px;
    background: rgba(0, 20, 40, 0.9);
    color: #00ffff;
    border: 2px solid #00ffff;
    border-radius: 6px;
    font-family: "Orbitron", sans-serif;
    cursor: pointer;
    margin-bottom: 15px;
    width: 300px;
  `;

    formats.forEach(fmt => {
        const option = document.createElement('option');
        option.value = fmt.value;
        option.textContent = fmt.label;
        select.appendChild(option);
    });

    overlay.appendChild(select);

    const levelLabel = document.createElement('div');
    levelLabel.textContent = 'Compression Level: 6 (Balanced)';
    levelLabel.style.cssText = 'margin-bottom: 10px; color: #00ff88;';
    overlay.appendChild(levelLabel);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '11';
    slider.value = '6';
    slider.style.cssText = `
    width: 300px;
    margin-bottom: 15px;
    cursor: pointer;
  `;

    slider.addEventListener('input', (e) => {
        const level = parseInt(e.target.value);
        const names = ['None', 'Fast', 'Fast', 'Fast', 'Balanced', 'Balanced', 'Balanced', 'High', 'High', 'High', 'Max', 'Max'];
        levelLabel.textContent = `Compression Level: ${level} (${names[level]})`;
    });

    overlay.appendChild(slider);

    const btnBox = document.createElement('div');
    btnBox.style.cssText = 'display: flex; gap: 10px;';

    const exportBtn2 = document.createElement('button');
    exportBtn2.textContent = 'Export';
    exportBtn2.style.cssText = `
    padding: 10px 20px;
    background: #00ffff;
    color: #000010;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
  `;
    exportBtn2.onclick = () => {
        document.body.removeChild(overlay);
        callback(select.value, parseInt(slider.value));
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = `
    padding: 10px 20px;
    background: transparent;
    color: #00ffff;
    border: 1px solid #00ffff;
    border-radius: 6px;
    cursor: pointer;
  `;
    cancelBtn.onclick = () => document.body.removeChild(overlay);

    btnBox.appendChild(exportBtn2);
    btnBox.appendChild(cancelBtn);
    overlay.appendChild(btnBox);
    document.body.appendChild(overlay);
}

function collectProjectFiles() {
    const files = [];

    let html = htmlEditor.getValue();
    if (htmlSelect.value === 'markdown') html = marked.parse(html);
    files.push({ name: 'index.html', content: html });

    files.push({ name: 'style.css', content: cssEditor.getValue() });
    files.push({ name: 'script.js', content: jsEditor.getValue() });

    const lang = pySelect.value;
    const ext = {
        brython: 'py',
        python: 'py',
        ruby: 'rb',
        lua: 'lua',
        scheme: 'scm',
        r: 'r',
        wat: 'wat'
    }[lang] || 'py';

    const folder = {
        brython: 'python',
        python: 'python',
        ruby: 'ruby',
        lua: 'lua',
        scheme: 'scheme',
        r: 'r',
        wat: 'wasm'
    }[lang] || 'python';

    files.push({
        name: `${folder}/main.${ext}`,
        content: pyEditor.getValue()
    });

    return files;
}

// Floating notification system
let notificationTimeout = null;

function showFloatingNotification(message, duration = 4000) {
    const notification = document.getElementById('floatingNotification');
    const notificationText = document.getElementById('notificationText');

    notificationText.textContent = message;
    notification.style.display = 'block';
    notification.style.animation = 'slideDown 0.3s ease';

    clearTimeout(notificationTimeout);

    notificationTimeout = setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }, duration);
}

// Hide notification on blur
document.getElementById('floatingNotification').addEventListener('blur', function () {
    this.style.display = 'none';
    clearTimeout(notificationTimeout);
});

// Check if HTML contains style tags
function checkHtmlForStyles() {
    const htmlContent = htmlEditor.getValue().toLowerCase();
    const hasStyleTag = htmlContent.includes('<style');
    const hasScriptTag = htmlContent.includes('<script');

    return { hasStyleTag, hasScriptTag };
}

async function createTar(files) {
    const blocks = [];

    for (const file of files) {
        const content = typeof file.content === 'string'
            ? new TextEncoder().encode(file.content)
            : new Uint8Array(file.content);

        const header = createTarHeader(file.name, content.length);
        blocks.push(header);

        const paddedSize = Math.ceil(content.length / 512) * 512;
        const paddedContent = new Uint8Array(paddedSize);
        paddedContent.set(content);
        blocks.push(paddedContent);
    }

    blocks.push(new Uint8Array(1024));

    const totalSize = blocks.reduce((sum, b) => sum + b.length, 0);
    const tar = new Uint8Array(totalSize);
    let offset = 0;

    for (const block of blocks) {
        tar.set(block, offset);
        offset += block.length;
    }

    return tar;
}

function createTarHeader(filename, size) {
    const header = new Uint8Array(512);
    const nameBytes = new TextEncoder().encode(filename);
    header.set(nameBytes.slice(0, 100), 0);
    header.set(new TextEncoder().encode('0000644\0'.padEnd(8)), 100);
    header.set(new TextEncoder().encode('0000000\0'.padEnd(8)), 108);
    header.set(new TextEncoder().encode('0000000\0'.padEnd(8)), 116);

    const sizeOctal = size.toString(8).padStart(11, '0') + '\0';
    header.set(new TextEncoder().encode(sizeOctal), 124);

    const now = Math.floor(Date.now() / 1000);
    const timeOctal = now.toString(8).padStart(11, '0') + '\0';
    header.set(new TextEncoder().encode(timeOctal), 136);

    header.set(new TextEncoder().encode('        '), 148);
    header[156] = 48;
    header.set(new TextEncoder().encode('ustar\0'), 257);

    let checksum = 0;
    for (let i = 0; i < header.length; i++) checksum += header[i];
    const checksumStr = checksum.toString(8).padStart(6, '0') + '\0 ';
    header.set(new TextEncoder().encode(checksumStr), 148);

    return header;
}

async function exportProject(format, level) {
    // Check for styles/scripts in HTML
    const { hasStyleTag, hasScriptTag } = checkHtmlForStyles();
    if (hasStyleTag || hasScriptTag) {
        showFloatingNotification('💡 Move CSS and Scripts to their areas?');
    }

    const files = collectProjectFiles();
    const projectName = projectNameInput.value || 'project';
    let blob;

    try {
        switch (format) {
            case 'folder':
                await exportAsFolder(files, projectName);
                if (isChromiumBrowser()) {
                    cyberAlert(`✅ Folder exported successfully`);
                }
                return;
            case 'zip':
                blob = await exportAsZip(files, level);
                break;
            case '7z':
                blob = await exportAs7z(files, level);
                break;
            case 'gzip':
                blob = await exportAsGzip(files, level);
                break;
            case 'deflate':
                blob = await exportAsDeflate(files, level);
                break;
            case 'zlib':
                blob = await exportAsZlib(files, level);
                break;
            case 'tar':
                blob = await exportAsTar(files);
                break;
            case 'tar.xz':
                blob = await exportAsTarXz(files, level);
                break;
            default:
                blob = await exportAsZip(files, level);
        }

        const ext = {
            'zip': '.zip',
            '7z': '.7z',
            'gzip': '.tar.gz',
            'deflate': '.deflate',
            'zlib': '.zlib',
            'tar': '.tar',
            'tar.xz': '.tar.xz'
        }[format];

        saveAs(blob, projectName + ext);
        cyberAlert(`✅ Exported as ${format.toUpperCase()}\n${(blob.size / 1024).toFixed(2)} KB`);

    } catch (error) {
        cyberAlert(`❌ Export failed:\n${error.message}`);
        console.error(error);
    }
}

function isChromiumBrowser() {
    const ua = navigator.userAgent;
    const isChromium = /Chrome|Edge|Brave|Vivaldi|Opera/.test(ua) && !/Edg/.test(ua) || /Edg/.test(ua);
    return isChromium && window.showDirectoryPicker;
}

async function exportAsFolder(files, projectName) {
    // Check for File System Access API support (Chromium browsers)
    if (!window.showDirectoryPicker) {
        cyberAlert('❌ Folder export requires Chromium browser (Chrome, Edge, Brave, etc.)');
        throw new Error('Folder export not supported on this browser');
    }

    const dirHandle = await window.showDirectoryPicker();
    const projectDir = await dirHandle.getDirectoryHandle(projectName, { create: true });

    const fileMap = {};
    files.forEach(file => {
        const parts = file.name.split('/');
        const dirs = parts.slice(0, -1);
        const fileName = parts[parts.length - 1];
        fileMap[file.name] = { dirs, fileName, content: file.content };
    });

    for (const [path, fileData] of Object.entries(fileMap)) {
        let currentDir = projectDir;

        for (const dirName of fileData.dirs) {
            currentDir = await currentDir.getDirectoryHandle(dirName, { create: true });
        }

        const fileHandle = await currentDir.getFileHandle(fileData.fileName, { create: true });
        const writable = await fileHandle.createWritable();

        if (typeof fileData.content === 'string') {
            await writable.write(fileData.content);
        } else {
            await writable.write(new Blob([fileData.content]));
        }

        await writable.close();
    }
}

async function exportAsZip(files, level) {
    const zip = new JSZip();
    files.forEach(f => zip.file(f.name, f.content));
    return await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level }
    });
}

async function exportAs7z(files, level) {
    // Using JSZip for 7Z fallback (since proper 7z lib is complex)
    // For true 7Z support, use archiver.js if available
    try {
        if (window.Archiver) {
            const archive = window.Archiver('7z', {
                zlib: { level: Math.min(level, 9) }
            });
            const stream = archive.pipe(new WritableStream());
            files.forEach(f => archive.append(f.content, { name: f.name }));
            await archive.finalize();
            return new Blob([stream.getBuffer()], { type: 'application/x-7z-compressed' });
        }
    } catch (e) {
        console.warn('7Z library not available, using ZIP as fallback');
    }

    // Fallback to ZIP
    return exportAsZip(files, level);
}

async function exportAsGzip(files, level) {
    const tar = await createTar(files);
    const compressed = fflate.gzipSync(tar, { level });
    return new Blob([compressed], { type: 'application/gzip' });
}

async function exportAsDeflate(files, level) {
    const data = new Uint8Array(files.reduce((sum, f) => sum + new TextEncoder().encode(f.content).length, 0));
    let offset = 0;
    files.forEach(f => {
        const bytes = new TextEncoder().encode(f.content);
        data.set(bytes, offset);
        offset += bytes.length;
    });
    const compressed = fflate.deflateSync(data, { level });
    return new Blob([compressed], { type: 'application/octet-stream' });
}

async function exportAsZlib(files, level) {
    const data = new Uint8Array(files.reduce((sum, f) => sum + new TextEncoder().encode(f.content).length, 0));
    let offset = 0;
    files.forEach(f => {
        const bytes = new TextEncoder().encode(f.content);
        data.set(bytes, offset);
        offset += bytes.length;
    });
    const compressed = fflate.zlibSync(data, { level });
    return new Blob([compressed], { type: 'application/octet-stream' });
}

async function exportAsTar(files) {
    return new Blob([await createTar(files)], { type: 'application/x-tar' });
}

async function exportAsTarXz(files, level) {
    const tar = await createTar(files);

    if (typeof LZMA !== 'undefined') {
        return new Promise((resolve, reject) => {
            try {
                LZMA.compress(
                    tar,
                    Math.min(Math.max(level, 1), 9),
                    (compressed, error) => {
                        if (error) {
                            reject(new Error('XZ compression failed'));
                            return;
                        }
                        if (!compressed || compressed.length === 0) {
                            reject(new Error('XZ compression produced empty result'));
                            return;
                        }
                        try {
                            const blob = new Blob([new Uint8Array(compressed)], { type: 'application/x-xz' });
                            resolve(blob);
                        } catch (e) {
                            reject(new Error('Failed to create XZ blob: ' + e.message));
                        }
                    }
                );
            } catch (err) {
                reject(new Error('XZ compression error: ' + err.message));
            }
        });
    }

    // Fallback to gzip if LZMA unavailable
    try {
        return await exportAsGzip(files, level);
    } catch (err) {
        throw new Error('TAR.XZ compression unavailable (LZMA library not loaded)');
    }
}

function cyberNameSelect(message, callback) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,10,0.95);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    color: #00ffff;
    font-family: "Orbitron", sans-serif;
  `;

    const title = document.createElement('div');
    title.textContent = message;
    title.style.cssText = 'font-size: 20px; margin-bottom: 20px;';
    overlay.appendChild(title);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Project name (e.g., my-app)';
    input.value = projectNameInput.value || 'project';
    input.style.cssText = `
    padding: 10px;
    background: rgba(0, 20, 40, 0.9);
    color: #00ffff;
    border: 2px solid #00ffff;
    border-radius: 6px;
    font-family: "Orbitron", sans-serif;
    margin-bottom: 15px;
    width: 300px;
  `;
    overlay.appendChild(input);

    const btnBox = document.createElement('div');
    btnBox.style.cssText = 'display: flex; gap: 10px;';

    const okBtn = document.createElement('button');
    okBtn.textContent = 'Continue';
    okBtn.style.cssText = `
    padding: 10px 20px;
    background: #00ffff;
    color: #000010;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
  `;
    okBtn.onclick = () => {
        document.body.removeChild(overlay);
        const name = input.value.trim() || 'project';
        projectNameInput.value = name;
        callback(name);
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = `
    padding: 10px 20px;
    background: transparent;
    color: #00ffff;
    border: 1px solid #00ffff;
    border-radius: 6px;
    cursor: pointer;
  `;
    cancelBtn.onclick = () => document.body.removeChild(overlay);

    btnBox.appendChild(okBtn);
    btnBox.appendChild(cancelBtn);
    overlay.appendChild(btnBox);
    document.body.appendChild(overlay);

    input.focus();
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') okBtn.click();
    });
}

// Export button handler
exportBtn.addEventListener('click', () => {
    cyberNameSelect('Enter project name:', (projectName) => {
        cyberFormatSelect('Choose Export Format:', EXPORT_FORMATS, (format, level) => {
            exportProject(format, level);
        });
    });
});
