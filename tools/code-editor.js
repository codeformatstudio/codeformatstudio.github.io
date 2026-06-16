const editorSwitch = document.getElementById("editorSelect");

// ✅ CRITICAL: Initialize editor preference BEFORE creating editors
const savedEditorPreference = localStorage.getItem("editor") || "codemirror";
editorSwitch.value = savedEditorPreference;

function switchEditor() {
    localStorage.setItem("editor", editorSwitch.value);
    location.reload(); // recreate editors using saved choice
}

function createMonacoEditors() {
    const htmlValue = htmlEditor.getValue();
    const cssValue = cssEditor.getValue();
    const jsValue = jsEditor.getValue();
    const pyValue = pyEditor.getValue();

    htmlEditor.toTextArea();
    cssEditor.toTextArea();
    jsEditor.toTextArea();
    pyEditor.toTextArea();

    htmlEditor = monaco.editor.create(htmlInput.parentElement, {
        value: htmlValue,
        language: "html",
        theme: "vs-dark",
        automaticLayout: true
    });

    cssEditor = monaco.editor.create(cssInput.parentElement, {
        value: cssValue,
        language: "css",
        theme: "vs-dark",
        automaticLayout: true
    });

    jsEditor = monaco.editor.create(jsInput.parentElement, {
        value: jsValue,
        language: "javascript",
        theme: "vs-dark",
        automaticLayout: true
    });

    pyEditor = monaco.editor.create(pyInput.parentElement, {
        value: pyValue,
        language: "python",
        theme: "vs-dark",
        automaticLayout: true
    });
}

function createCodeMirrorEditors() {
    const htmlValue = htmlEditor.getValue();
    const cssValue = cssEditor.getValue();
    const jsValue = jsEditor.getValue();
    const pyValue = pyEditor.getValue();

    htmlEditor.dispose();
    cssEditor.dispose();
    jsEditor.dispose();
    pyEditor.dispose();

    htmlEditor = CodeMirror.fromTextArea(htmlInput, {
        mode: "htmlmixed",
        lineNumbers: true
    });
    htmlEditor.setValue(htmlValue);

    cssEditor = CodeMirror.fromTextArea(cssInput, {
        mode: "css",
        lineNumbers: true
    });
    cssEditor.setValue(cssValue);

    jsEditor = CodeMirror.fromTextArea(jsInput, {
        mode: "javascript",
        lineNumbers: true
    });
    jsEditor.setValue(jsValue);

    pyEditor = CodeMirror.fromTextArea(pyInput, {
        mode: "python",
        lineNumbers: true
    });
    pyEditor.setValue(pyValue);
}
