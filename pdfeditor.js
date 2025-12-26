"use strict";
// Mobile optimization: Prevent unwanted zoom on double-tap
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Prevent pinch zoom on mobile
document.addEventListener('wheel', function (event) {
    if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
    }
}, { passive: false });

// Prevent text selection on touch devices
document.addEventListener('touchmove', function (e) {
    if (e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
    }
}, { passive: false });

const pdfjsLib = window["pdfjs-dist/build/pdf"];
let pdfDoc = null,
    scale = 1.0,
    pages = [],
    currentPage = 1,
    pdfFileName = "document";
const pageContainer = document.getElementById("pageContainer");
const pagesList = document.getElementById("pagesList");
const zoomInBtn = document.getElementById("zoomIn");
const zoomOutBtn = document.getElementById("zoomOut");
const zoomLabel = document.getElementById("zoomLabel");
let tool = "select",
    objects = [],
    objectId = 1,
    selectedObject = null;
let isDrawing = false,
    tempPath = [],
    isDragging = false,
    dragOffset = { x: 0, y: 0 };
let undoStack = [],
    redoStack = [];
let signaturePad = null;
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Font name to standard font mapping - simpler approach
const fontNameMap = {
    "serif": ["Times New Roman", "Playfair Display", "Merriweather", "Lora", "Cormorant Garamond", "EB Garamond", "Cinzel", "Bodoni Moda"],
    "mono": ["Courier New", "IBM Plex Mono", "JetBrains Mono", "Source Code Pro", "Space Mono", "Inconsolata", "Fira Code", "Roboto Mono", "Ubuntu Mono", "Courier Prime", "Oxygen Mono", "Anonymous Pro", "Overpass Mono"],
};

// Get font name string for use with PDFLib (do NOT pass font to drawText, let PDFLib use default)
const getStandardFontName = (fontName) => {
    if (!fontName) return "Helvetica";
    
    const isSerif = fontNameMap.serif.includes(fontName);
    const isMono = fontNameMap.mono.includes(fontName);
    
    if (isSerif) return "TimesRoman";
    if (isMono) return "Courier";
    return "Helvetica";
};

// ===================== LOAD PDF =====================
document
    .getElementById("loadPDF")
    .addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        pdfFileName = file.name.replace(/\.pdf$/i, "");
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        pdfDoc = await loadingTask.promise;

        // Validate PDF is not rasterized
        await validatePDFQuality();

        await renderAllPages();
    });

async function validatePDFQuality() {
    if (!pdfDoc || pdfDoc.numPages === 0) return;

    try {
        const firstPage = await pdfDoc.getPage(1);
        const operatorList = await firstPage.getOperatorList();

        // Check for text content
        const textContent = await firstPage.getTextContent();
        const hasText = textContent.items && textContent.items.length > 0;

        // Check for vector graphics (not just images)
        const hasVectorOps = operatorList.fnArray &&
            operatorList.fnArray.some((fn, idx) => {
                // Check for drawing operations (not image operations)
                const opName = operatorList.fnArray[idx];
                return opName !== 'paintImageXObject' && opName !== 'paintInlineImageXObject';
            });

        // If no text and only images, warn user
        if (!hasText && !hasVectorOps) {
            const confirm = window.confirm(
                "⚠️ This PDF appears to be a scanned image or rasterized PDF.\n\n" +
                "It may have limited editability. Vector-based PDFs work best.\n\n" +
                "Continue anyway?"
            );
            if (!confirm) {
                pdfDoc = null;
                objects = [];
                clearPages();
            }
        } else if (!hasText && hasVectorOps) {
            console.warn("PDF has vector content but no selectable text");
        } else {
            console.log("✓ PDF has vector and text content");
        }
    } catch (e) {
        console.warn("Could not validate PDF quality:", e);
        // Allow user to continue even if validation fails
    }
}

function clearPages() {
    pageContainer.innerHTML = "";
    pagesList.innerHTML = "";
    pages = [];
}

async function renderAllPages() {
    clearPages();
    const containerWidth = pageContainer.clientWidth - 40;
    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        const scaleFit = containerWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale: scaleFit * scale });

        const wrapper = document.createElement("div");
        wrapper.className = "pageCanvasWrapper";

        const pdfCanvas = document.createElement("canvas");
        pdfCanvas.className = "pdfCanvas";
        pdfCanvas.width = scaledViewport.width;
        pdfCanvas.height = scaledViewport.height;
        wrapper.appendChild(pdfCanvas);

        const drawCanvas = document.createElement("canvas");
        drawCanvas.className = "drawCanvas";
        drawCanvas.width = scaledViewport.width;
        drawCanvas.height = scaledViewport.height;
        wrapper.appendChild(drawCanvas);

        pageContainer.appendChild(wrapper);

        await page.render({
            canvasContext: pdfCanvas.getContext("2d"),
            viewport: scaledViewport,
        }).promise;

        const thumb = document.createElement("canvas");
        thumb.className = "thumbnail";
        const thumbCtx = thumb.getContext("2d");
        thumb.width = 200;
        thumb.height = (viewport.height / viewport.width) * 200;
        pagesList.appendChild(thumb);
        await page.render({
            canvasContext: thumbCtx,
            viewport: page.getViewport({ scale: 200 / viewport.width }),
        }).promise;

        thumb.onclick = () => {
            showPagePreview(i - 1);
        };

        pages.push({ pdfCanvas, drawCanvas, wrapper, scale: scaleFit, page });
    }
    drawObjects();
    attachCanvasEvents();
}

// ===================== ZOOM =====================
zoomInBtn.onclick = () => {
    scale += 0.1;
    zoomLabel.textContent = Math.round(scale * 100) + "%";
    if (pdfDoc) renderAllPages();
};
zoomOutBtn.onclick = () => {
    scale = Math.max(0.1, scale - 0.1);
    zoomLabel.textContent = Math.round(scale * 100) + "%";
    if (pdfDoc) renderAllPages();
};

// Zoom to fit
document.getElementById("zoomFit").onclick = () => {
    scale = 1.0;
    zoomLabel.textContent = "100%";
    if (pdfDoc) renderAllPages();
};

// Undo/Redo
document.getElementById("undoBtn").onclick = () => {
    if (undoStack.length > 0) {
        redoStack.push(JSON.stringify(objects));
        const prev = undoStack.pop();
        objects = prev ? JSON.parse(prev) : [];
        drawObjects();
    }
};

document.getElementById("redoBtn").onclick = () => {
    if (redoStack.length > 0) {
        undoStack.push(JSON.stringify(objects));
        const next = redoStack.pop();
        objects = next ? JSON.parse(next) : [];
        drawObjects();
    }
};

// Delete selected object
document.getElementById("deleteBtn").onclick = () => {
    if (selectedObject) {
        objects = objects.filter((o) => o.id !== selectedObject.id);
        selectedObject = null;
        drawObjects();
        saveState();
    }
};

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
    // Delete key
    if ((e.key === "Delete" || e.key === "Backspace") && selectedObject) {
        e.preventDefault();
        objects = objects.filter((o) => o.id !== selectedObject.id);
        selectedObject = null;
        drawObjects();
        saveState();
    }
    // Tool shortcuts
    if (e.key.toLowerCase() === "a") {
        tool = "select";
        document.querySelector('[data-tool="select"]').click();
    }
    if (e.key.toLowerCase() === "t") {
        tool = "text";
        document.querySelector('[data-tool="text"]').click();
    }
    if (e.key.toLowerCase() === "e") {
        tool = "edit";
        document.querySelector('[data-tool="edit"]').click();
    }
    // Undo/Redo
    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        document.getElementById("undoBtn").click();
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        document.getElementById("redoBtn").click();
    }
});

// ===================== TOOLS =====================
document.querySelectorAll(".tool-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isActive = btn.classList.contains("active");
        document
            .querySelectorAll(".tool-btn")
            .forEach((b) => b.classList.remove("active"));
        const selectedTool = btn.getAttribute("data-tool");
        if (!isActive) {
            btn.classList.add("active");
            tool = selectedTool;
            updateToolCursor();
            updateSubToolbar();
        }
    }, { passive: false });

    // Touch event for better mobile responsiveness
    btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        btn.classList.add("active");
    }, { passive: false });

    btn.addEventListener("touchend", (e) => {
        e.preventDefault();
        // Trigger the click event
        const clickEvent = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true
        });
        btn.dispatchEvent(clickEvent);
    }, { passive: false });
});

function updateToolCursor() {
    pages.forEach(page => {
        // Remove all cursor classes
        page.drawCanvas.classList.remove("text-tool", "select-tool");
        
        // Add the appropriate cursor class
        if (tool === "text") {
            page.drawCanvas.classList.add("text-tool");
        } else if (tool === "select") {
            page.drawCanvas.classList.add("select-tool");
        }
    });
}

function updateSubToolbar() {
    const subToolbar = document.getElementById("subToolbar");
    subToolbar.innerHTML = "";

    if (tool === "text") {
        subToolbar.innerHTML = `
    <label>Font: <select id="fontFamily">
      <option>Arial</option>
      <option>Verdana</option>
      <option>Courier New</option>
      <option>Times New Roman</option>
      <option>Roboto</option>
      <option>Open Sans</option>
      <option>Lato</option>
      <option>Montserrat</option>
      <option>Playfair Display</option>
      <option>Poppins</option>
      <option>Raleway</option>
      <option>Ubuntu</option>
      <option>Merriweather</option>
      <option>Lora</option>
      <option>Oswald</option>
      <option>Pacifico</option>
      <option>Dancing Script</option>
      <option>Caveat</option>
      <option>Great Vibes</option>
      <option>Satisfy</option>
      <option>Indie Flower</option>
      <option>Fredoka</option>
      <option>Inter</option>
      <option>Work Sans</option>
      <option>Quicksand</option>
      <option>Nunito</option>
      <option>Mulish</option>
      <option>Outfit</option>
      <option>Sora</option>
      <option>IBM Plex Mono</option>
      <option>JetBrains Mono</option>
      <option>Source Code Pro</option>
      <option>Space Mono</option>
      <option>Inconsolata</option>
      <option>Fira Code</option>
      <option>Roboto Mono</option>
      <option>Ubuntu Mono</option>
      <option>Courier Prime</option>
      <option>Oxygen Mono</option>
      <option>Anonymous Pro</option>
      <option>Overpass Mono</option>
      <option>Cormorant Garamond</option>
      <option>EB Garamond</option>
      <option>Cinzel</option>
      <option>Bodoni Moda</option>
    </select></label>
    <label>Size: <input type="number" id="fontSize" value="20" min="6" max="200"></label>
    <label>Color: <input type="color" id="fontColor" value="#0ff"></label>
  `;
    } else if (tool === "edit") {
        subToolbar.innerHTML = `
    <label>Font Color: <input type="color" id="editFontColor" value="#0ff"></label>
    <label>Font: <select id="editFontFamily">
      <option>Arial</option>
      <option>Verdana</option>
      <option>Courier New</option>
      <option>Times New Roman</option>
      <option>Roboto</option>
      <option>Open Sans</option>
      <option>Lato</option>
      <option>Montserrat</option>
      <option>Playfair Display</option>
      <option>Poppins</option>
      <option>Raleway</option>
      <option>Ubuntu</option>
      <option>Merriweather</option>
      <option>Lora</option>
      <option>Oswald</option>
      <option>Pacifico</option>
      <option>Dancing Script</option>
      <option>Caveat</option>
      <option>Great Vibes</option>
      <option>Satisfy</option>
      <option>Indie Flower</option>
      <option>Fredoka</option>
      <option>Inter</option>
      <option>Work Sans</option>
      <option>Quicksand</option>
      <option>Nunito</option>
      <option>Mulish</option>
      <option>Outfit</option>
      <option>Sora</option>
      <option>IBM Plex Mono</option>
      <option>JetBrains Mono</option>
      <option>Source Code Pro</option>
      <option>Space Mono</option>
      <option>Inconsolata</option>
      <option>Fira Code</option>
      <option>Roboto Mono</option>
      <option>Ubuntu Mono</option>
      <option>Courier Prime</option>
      <option>Oxygen Mono</option>
      <option>Anonymous Pro</option>
      <option>Overpass Mono</option>
      <option>Cormorant Garamond</option>
      <option>EB Garamond</option>
      <option>Cinzel</option>
      <option>Bodoni Moda</option>
    </select></label>
    <p style="color:#0ff; font-size:11px;">Drag to move • Double-click text to edit • Press DEL to delete</p>
  `;
    } else if (tool === "pen" || tool === "highlight") {
        subToolbar.innerHTML = `
    <label>Color: <input type="color" id="penColor" value="#0ff"></label>
    <label>Size: <input type="number" id="penSize" value="2" min="1" max="50"></label>
  `;
    } else if (tool === "shape") {
        subToolbar.innerHTML = `
    <label>Shape: <select id="shapeType"><option value="rect">Rectangle</option><option value="ellipse">Ellipse</option><option value="line">Line</option><option value="arrow">Arrow</option></select></label>
    <label>Color: <input type="color" id="shapeColor" value="#0ff"></label>
    <label>Size: <input type="number" id="shapeSize" value="2" min="1" max="50"></label>
    <label>Fill: <input type="color" id="shapeFill" value="#0ff"></label>
  `;
    } else if (tool === "signature") {
        subToolbar.innerHTML = `
    <label>Font: <select id="signatureFont">
      <option>Arial</option>
      <option>Verdana</option>
      <option>Courier New</option>
      <option>Times New Roman</option>
      <option>Roboto</option>
      <option>Open Sans</option>
      <option>Lato</option>
      <option>Montserrat</option>
      <option>Playfair Display</option>
      <option>Poppins</option>
      <option>Raleway</option>
      <option>Ubuntu</option>
      <option>Merriweather</option>
      <option>Lora</option>
      <option>Oswald</option>
      <option>Pacifico</option>
      <option>Dancing Script</option>
      <option>Caveat</option>
      <option>Great Vibes</option>
      <option>Satisfy</option>
      <option>Indie Flower</option>
      <option>Fredoka</option>
      <option>Inter</option>
      <option>Work Sans</option>
      <option>Quicksand</option>
      <option>Nunito</option>
      <option>Mulish</option>
      <option>Outfit</option>
      <option>Sora</option>
      <option>IBM Plex Mono</option>
      <option>JetBrains Mono</option>
      <option>Source Code Pro</option>
      <option>Space Mono</option>
      <option>Inconsolata</option>
      <option>Fira Code</option>
      <option>Roboto Mono</option>
      <option>Ubuntu Mono</option>
      <option>Courier Prime</option>
      <option>Oxygen Mono</option>
      <option>Anonymous Pro</option>
      <option>Overpass Mono</option>
      <option>Cormorant Garamond</option>
      <option>EB Garamond</option>
      <option>Cinzel</option>
      <option>Bodoni Moda</option>
      </select></label>
      <p style="color:#0ff; font-size:12px;">Draw your signature below</p>
      `;
        setTimeout(() => initSignaturePad(), 100);
    } else if (tool === "eraser") {
        subToolbar.innerHTML = `
    <label>Size: <input type="number" id="eraserSize" value="20" min="5" max="100"></label>
  `;
    } else if (tool === "note") {
        subToolbar.innerHTML = `
    <label>Color: <input type="color" id="noteColor" value="#ffff00"></label>
    <label>Font: <select id="noteFont">
      <option>Arial</option>
      <option>Verdana</option>
      <option>Courier New</option>
      <option>Times New Roman</option>
      <option>Roboto</option>
      <option>Open Sans</option>
      <option>Lato</option>
      <option>Montserrat</option>
      <option>Playfair Display</option>
      <option>Poppins</option>
      <option>Raleway</option>
      <option>Ubuntu</option>
      <option>Merriweather</option>
      <option>Lora</option>
      <option>Oswald</option>
      <option>Pacifico</option>
      <option>Dancing Script</option>
      <option>Caveat</option>
      <option>Great Vibes</option>
      <option>Satisfy</option>
      <option>Indie Flower</option>
      <option>Fredoka</option>
      <option>Inter</option>
      <option>Work Sans</option>
      <option>Quicksand</option>
      <option>Nunito</option>
      <option>Mulish</option>
      <option>Outfit</option>
      <option>Sora</option>
      <option>IBM Plex Mono</option>
      <option>JetBrains Mono</option>
      <option>Source Code Pro</option>
      <option>Space Mono</option>
      <option>Inconsolata</option>
      <option>Fira Code</option>
      <option>Roboto Mono</option>
      <option>Ubuntu Mono</option>
      <option>Courier Prime</option>
      <option>Oxygen Mono</option>
      <option>Anonymous Pro</option>
      <option>Overpass Mono</option>
      <option>Cormorant Garamond</option>
      <option>EB Garamond</option>
      <option>Cinzel</option>
      <option>Bodoni Moda</option>
      </select></label>
      <label>Size: <input type="number" id="noteSize" value="15" min="10" max="100"></label>
      `;
      } else if (tool === "arrow") {
        subToolbar.innerHTML = `
    <label>Color: <input type="color" id="arrowColor" value="#0ff"></label>
    <label>Size: <input type="number" id="arrowSize" value="2" min="1" max="50"></label>
  `;
    }

    // Add event listeners for edit tool color and font changes
    if (tool === "edit") {
        setTimeout(() => {
            const colorInput = document.getElementById("editFontColor");
            const fontInput = document.getElementById("editFontFamily");

            if (colorInput && selectedObject && selectedObject.type === "text") {
                colorInput.value = selectedObject.color || "#0ff";
                colorInput.addEventListener("change", () => {
                    if (selectedObject && selectedObject.type === "text") {
                        selectedObject.color = colorInput.value;
                        drawObjects();
                        saveState();
                    }
                });
            }

            if (fontInput && selectedObject && selectedObject.type === "text") {
                fontInput.value = selectedObject.font || "Arial";
                fontInput.addEventListener("change", () => {
                    if (selectedObject && selectedObject.type === "text") {
                        selectedObject.font = fontInput.value;
                        drawObjects();
                        saveState();
                    }
                });
            }
        }, 50);
    }
}

function initSignaturePad() {
    const sigCanvas = document.getElementById("signatureCanvas");
    if (sigCanvas) {
        signaturePad = new SignaturePad(sigCanvas);
    }
}

let lastTap = 0;
let tapCount = 0;
const doubleTapDelay = 300;

function attachCanvasEvents() {
    pages.forEach((pg, pageIndex) => {
        // Mouse events
        pg.drawCanvas.addEventListener("mousedown", (e) =>
            handleMouseDown(e, pageIndex)
        );
        pg.drawCanvas.addEventListener("mousemove", (e) =>
            handleMouseMove(e, pageIndex)
        );
        pg.drawCanvas.addEventListener("mouseup", (e) =>
            handleMouseUp(e, pageIndex)
        );
        pg.drawCanvas.addEventListener("dblclick", (e) =>
            handleDoubleClick(e, pageIndex)
        );

        // Touch events for mobile
        pg.drawCanvas.addEventListener("touchstart", (e) =>
            handleTouchStart(e, pageIndex)
        );
        pg.drawCanvas.addEventListener("touchmove", (e) =>
            handleTouchMove(e, pageIndex)
        );
        pg.drawCanvas.addEventListener("touchend", (e) =>
            handleTouchEnd(e, pageIndex)
        );
    });
}

function handleDoubleClick(e, pageIndex) {
    selectObject(e, pageIndex);
    if (selectedObject && selectedObject.type === "text") {
        // Open text editor for double-clicked text
        editTextObject(selectedObject, pageIndex);
    }
}

function editTextObject(obj, pageIndex) {
    const wrapper = pages[pageIndex].wrapper;
    const textarea = document.createElement("textarea");
    textarea.className = "text-input-area";
    textarea.value = obj.text;
    textarea.style.left = obj.x + "px";
    textarea.style.top = obj.y + "px";
    textarea.style.fontSize = obj.size + "px";
    textarea.style.fontFamily = obj.font;
    textarea.style.color = obj.color;

    wrapper.appendChild(textarea);
    textarea.focus();
    textarea.select();

    // Auto-scale - matches createTextInput sizing
    function autoResize() {
        textarea.style.height = "auto";
        textarea.style.height = Math.max(textarea.scrollHeight, obj.size * 1.2) + "px";
        textarea.style.width = "auto";
        textarea.style.width = Math.max(textarea.scrollWidth, 50) + "px";
    }

    textarea.addEventListener("input", autoResize);
    textarea.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" || e.ctrlKey || e.metaKey) {
            autoResize();
        }
    });

    function saveEdit() {
        const newText = textarea.value.trim();
        if (newText) {
            obj.text = newText;
            saveState();
            drawObjects();
        } else {
            drawObjects();
        }
        textarea.remove();
    }

    textarea.addEventListener("blur", saveEdit);
    textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            saveEdit();
        }
    });

    autoResize();
}

function handleTouchStart(e, pageIndex) {
    if (e.touches.length > 1) return; // Ignore multi-touch
    e.preventDefault();
    const touch = e.touches[0];
    const pos = getMousePos({ clientX: touch.clientX, clientY: touch.clientY }, pages[pageIndex].drawCanvas);

    // Direct handling for better mobile responsiveness
    if (tool === "select") {
        selectObject({ clientX: touch.clientX, clientY: touch.clientY }, pageIndex);
        return;
    }
    if (tool === "eraser") {
        eraseAtPoint(pos, pageIndex);
        return;
    }

    // Start drawing immediately on touch
    isDrawing = true;
    tempPath = [pos];
}

function handleTouchMove(e, pageIndex) {
    if (!isDrawing || e.touches.length > 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    const pos = getMousePos({ clientX: touch.clientX, clientY: touch.clientY }, pages[pageIndex].drawCanvas);
    tempPath.push(pos);
    drawTemp(pageIndex);
}

function handleTouchEnd(e, pageIndex) {
    if (!isDrawing) return;
    e.preventDefault();
    isDrawing = false;

    // Handle end drawing similar to mouse up
    if (tempPath.length > 0) {
        handleMouseUp(e, pageIndex);
    }
}

function getMousePos(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    // Account for scroll offset on mobile
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return {
        x: e.clientX - rect.left + scrollLeft,
        y: e.clientY - rect.top + scrollTop,
    };
}

function handleMouseDown(e, pageIndex) {
    console.log("Mouse down on page", pageIndex, "with tool:", tool);
    if (tool === "select" || tool === "edit") {
        selectObject(e, pageIndex);
        if (tool === "edit" && selectedObject) {
            // Start dragging in edit mode
            isDragging = true;
            dragOffset.x = getMousePos(e, pages[pageIndex].drawCanvas).x - (selectedObject.x || selectedObject.x1);
            dragOffset.y = getMousePos(e, pages[pageIndex].drawCanvas).y - (selectedObject.y || selectedObject.y1);
        }
        return;
    }
    if (tool === "eraser") {
        const pos = getMousePos(e, pages[pageIndex].drawCanvas);
        eraseAtPoint(pos, pageIndex);
        return;
    }
    // Set isDrawing for all other tools
    isDrawing = true;
    const pos = getMousePos(e, pages[pageIndex].drawCanvas);
    tempPath = [pos];
}

function handleMouseMove(e, pageIndex) {
    if (tool === "edit" && isDragging && selectedObject) {
        // Drag selected object
        const pos = getMousePos(e, pages[pageIndex].drawCanvas);
        const deltaX = pos.x - dragOffset.x - (selectedObject.x || selectedObject.x1);
        const deltaY = pos.y - dragOffset.y - (selectedObject.y || selectedObject.y1);

        if (selectedObject.type === "text") {
            selectedObject.x += deltaX;
            selectedObject.y += deltaY;
        } else if (["rect", "ellipse", "line", "arrow"].includes(selectedObject.type)) {
            selectedObject.x1 += deltaX;
            selectedObject.y1 += deltaY;
            selectedObject.x2 += deltaX;
            selectedObject.y2 += deltaY;
        } else if (["pen", "highlight"].includes(selectedObject.type)) {
            selectedObject.path.forEach(p => {
                p.x += deltaX;
                p.y += deltaY;
            });
        } else if (selectedObject.type === "text-highlight") {
            selectedObject.x1 += deltaX;
            selectedObject.y1 += deltaY;
            selectedObject.x2 += deltaX;
            selectedObject.y2 += deltaY;
        }
        drawObjects();
        return;
    }
    if (!isDrawing) return;
    const pos = getMousePos(e, pages[pageIndex].drawCanvas);
    tempPath.push(pos);
    drawTemp(pageIndex);
}

function handleMouseUp(e, pageIndex) {
    if (isDragging && tool === "edit") {
        isDragging = false;
        saveState();
        return;
    }
    
    // Allow text tool to work with just a click (not requiring drag)
    if (tool === "text") {
        console.log("Text tool clicked at page", pageIndex);
        const pos = getMousePos(e, pages[pageIndex].drawCanvas);
        console.log("Position:", pos);
        createTextInput(pageIndex, pos.x, pos.y);
        isDrawing = false;
        tempPath = [];
        return;
    }
    
    // Allow note tool to work with just a click (not requiring drag)
    if (tool === "note") {
        console.log("Note tool clicked at page", pageIndex);
        const pos = getMousePos(e, pages[pageIndex].drawCanvas);
        console.log("Position:", pos);
        createNoteInput(pageIndex, pos.x, pos.y);
        isDrawing = false;
        tempPath = [];
        return;
    }
    
    if (!isDrawing) return;
    isDrawing = false;
    if (tool === "pen") {
        objects.push({
            id: objectId++,
            type: "pen",
            page: pageIndex,
            color: document.getElementById("penColor").value,
            size: parseInt(document.getElementById("penSize").value),
            path: [...tempPath],
        });
        saveState();
    }
    if (tool === "highlight") {
        objects.push({
            id: objectId++,
            type: "highlight",
            page: pageIndex,
            color: document.getElementById("penColor").value,
            size: parseInt(document.getElementById("penSize").value),
            opacity: 0.35,
            path: [...tempPath],
        });
        saveState();
    }
    if (tool === "shape") {
        const st = document.getElementById("shapeType").value;
        const color = document.getElementById("shapeColor").value;
        const size = parseInt(document.getElementById("shapeSize").value);
        const fill = document.getElementById("shapeFill").value;
        objects.push({
            id: objectId++,
            type: st,
            page: pageIndex,
            color,
            size,
            fill,
            x1: tempPath[0].x,
            y1: tempPath[0].y,
            x2: tempPath[tempPath.length - 1].x,
            y2: tempPath[tempPath.length - 1].y,
        });
        saveState();
    }
    if (tool === "signature") {
        // For signature tool, allow just a click to place stored signature
        if (!isDrawing || tempPath.length === 0) {
            const pos = getMousePos(e, pages[pageIndex].drawCanvas);
            if (storedSignature) {
                objects.push({
                    id: objectId++,
                    type: "signature",
                    page: pageIndex,
                    x: pos.x,
                    y: pos.y,
                    storedSignatureData: storedSignature,
                });
                saveState();
                drawObjects();
            } else {
                alert("Please set up your signature first!");
                openSignatureModal();
            }
            isDrawing = false;
            tempPath = [];
            return;
        }
        
        // If user drew something with signature pad
        const data = signaturePad.toData();
        objects.push({
            id: objectId++,
            type: "signature",
            page: pageIndex,
            x: tempPath[0].x,
            y: tempPath[0].y,
            path: data,
        });
        saveState();
        signaturePad.clear();
     }
        if (tool === "arrow") {
        objects.push({
            id: objectId++,
            type: "arrow-line",
            page: pageIndex,
            color: document.getElementById("arrowColor")?.value || "#0ff",
            size: parseInt(document.getElementById("arrowSize")?.value || 2),
            x1: tempPath[0].x,
            y1: tempPath[0].y,
            x2: tempPath[tempPath.length - 1].x,
            y2: tempPath[tempPath.length - 1].y,
        });
        saveState();
    }
    tempPath = [];
    drawObjects();
}

// ===================== DRAWING FUNCTIONS =====================
function drawObjects() {
    pages.forEach((pg, pageIndex) => {
        const ctx = pg.drawCanvas.getContext("2d");
        ctx.clearRect(0, 0, pg.drawCanvas.width, pg.drawCanvas.height);
        objects
            .filter((o) => o.page === pageIndex)
            .forEach((o) => {
                if (o.type === "pen") drawPen(o, ctx);
                if (o.type === "highlight") drawHighlight(o, ctx);
                if (o.type === "text-highlight") drawTextHighlight(o, ctx);
                if (o.type === "text") drawText(o, ctx);
                if (["rect", "ellipse", "line", "arrow"].includes(o.type))
                    drawShape(o, ctx);
                if (o.type === "signature") drawSignature(o, ctx);
                if (o.type === "note") drawNote(o, ctx);
                if (o.type === "arrow-line") drawArrow(o, ctx);

                // Draw selection highlight
                if (selectedObject && selectedObject.id === o.id) {
                    drawSelectionBox(o, ctx);
                }
            });
        // Draw text selection on top
        drawTextSelection();
     });
}

function drawSelectionBox(o, ctx) {
    ctx.strokeStyle = "#ffff00";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    if (o.type === "text") {
        const lines = o.text.split("\n");
        const lineHeight = o.size * 1.2;
        const width = Math.max(...lines.map(l => l.length)) * o.size * 0.6;
        const height = lines.length * lineHeight;
        ctx.strokeRect(o.x - 2, o.y - o.size - 2, width + 4, height + 4);
    } else if (["rect", "ellipse", "line", "arrow"].includes(o.type)) {
        const x1 = o.x1, y1 = o.y1, x2 = o.x2, y2 = o.y2;
        ctx.strokeRect(Math.min(x1, x2) - 5, Math.min(y1, y2) - 5, Math.abs(x2 - x1) + 10, Math.abs(y2 - y1) + 10);
    } else if (o.type === "text-highlight") {
        ctx.strokeRect(o.x1 - 5, o.y1 - 5, o.x2 - o.x1 + 10, o.y2 - o.y1 + 10);
    } else if (["pen", "highlight"].includes(o.type)) {
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        o.path.forEach(p => {
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y);
        });
        ctx.strokeRect(minX - 5, minY - 5, maxX - minX + 10, maxY - minY + 10);
    }

    ctx.setLineDash([]);
}

function drawPen(o, ctx) {
    ctx.strokeStyle = o.color;
    ctx.lineWidth = o.size;
    ctx.lineCap = "round";
    ctx.beginPath();
    o.path.forEach((p, i) =>
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
    );
    ctx.stroke();
}

function drawHighlight(o, ctx) {
    ctx.strokeStyle = o.color;
    ctx.lineWidth = o.size;
    ctx.globalAlpha = o.opacity || 0.35;
    ctx.beginPath();
    o.path.forEach((p, i) =>
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
    );
    ctx.stroke();
    ctx.globalAlpha = 1;
}

function drawText(o, ctx) {
    ctx.fillStyle = o.color;
    ctx.font = `${o.size}px ${o.font}`;
    ctx.textBaseline = "top";
    const lines = o.text.split("\n");
    const lineHeight = o.size * 1.2;
    lines.forEach((line, i) => {
        ctx.fillText(line, o.x, o.y + i * lineHeight);
    });
}

function drawShape(o, ctx) {
    ctx.strokeStyle = o.color;
    ctx.lineWidth = o.size;
    const x1 = o.x1,
        y1 = o.y1,
        x2 = o.x2,
        y2 = o.y2;
    if (o.type === "rect") {
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        ctx.fillStyle = o.fill;
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
    }
    if (o.type === "ellipse") {
        ctx.beginPath();
        ctx.ellipse(
            (x1 + x2) / 2,
            (y1 + y2) / 2,
            Math.abs(x2 - x1) / 2,
            Math.abs(y2 - y1) / 2,
            0,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = o.fill;
        ctx.fill();
        ctx.stroke();
    }
    if (o.type === "line") {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    if (o.type === "arrow") {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}



function drawNote(o, ctx) {
    const noteWidth = o.text.length * (o.size * 0.6);
    const noteHeight = o.size * 1.5;

    // Draw yellow note background
    ctx.fillStyle = o.color;
    ctx.globalAlpha = 0.8;
    ctx.fillRect(o.x, o.y, noteWidth, noteHeight);
    ctx.globalAlpha = 1;

    // Draw border
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.strokeRect(o.x, o.y, noteWidth, noteHeight);

    // Draw text
    ctx.fillStyle = "#000";
    ctx.font = `${o.size}px ${o.font || "Arial"}`;
    ctx.fillText(o.text, o.x + 4, o.y + o.size);
}

function drawArrow(o, ctx) {
    const headlen = 15;
    const angle = Math.atan2(o.y2 - o.y1, o.x2 - o.x1);

    ctx.strokeStyle = o.color;
    ctx.lineWidth = o.size;
    ctx.lineCap = "round";

    // Draw line
    ctx.beginPath();
    ctx.moveTo(o.x1, o.y1);
    ctx.lineTo(o.x2, o.y2);
    ctx.stroke();

    // Draw arrowhead
    ctx.beginPath();
    ctx.moveTo(o.x2, o.y2);
    ctx.lineTo(o.x2 - headlen * Math.cos(angle - Math.PI / 6), o.y2 - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(o.x2, o.y2);
    ctx.lineTo(o.x2 - headlen * Math.cos(angle + Math.PI / 6), o.y2 - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}

function drawTemp(pageIndex) {
    const ctx = pages[pageIndex].drawCanvas.getContext("2d");
    ctx.clearRect(
        0,
        0,
        pages[pageIndex].drawCanvas.width,
        pages[pageIndex].drawCanvas.height
    );
    drawObjects();
    if (tool === "pen" || tool === "highlight") {
        ctx.beginPath();
        ctx.strokeStyle =
            document.getElementById("penColor")?.value || "#0ff";
        ctx.lineWidth = parseInt(
            document.getElementById("penSize")?.value || 2
        );
        ctx.lineCap = "round";
        tempPath.forEach((p, i) =>
            i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
        );
        ctx.stroke();
    }
    if (tool === "shape") {
        const st = document.getElementById("shapeType")?.value || "rect";
        const color = document.getElementById("shapeColor")?.value || "#0ff";
        const size = parseInt(
            document.getElementById("shapeSize")?.value || 2
        );
        const fill = document.getElementById("shapeFill")?.value || "#0ff";
        const x1 = tempPath[0].x,
            y1 = tempPath[0].y,
            x2 = tempPath[tempPath.length - 1].x,
            y2 = tempPath[tempPath.length - 1].y;
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        if (st === "rect") {
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
            ctx.fillStyle = fill;
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
        }
        if (st === "ellipse") {
            ctx.beginPath();
            ctx.ellipse(
                (x1 + x2) / 2,
                (y1 + y2) / 2,
                Math.abs(x2 - x1) / 2,
                Math.abs(y2 - y1) / 2,
                0,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.stroke();
        }
        if (st === "line") {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        if (st === "arrow") {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }
}

function selectObject(e, pageIndex) {
    const pos = getMousePos(e, pages[pageIndex].drawCanvas);
    selectedObject = objects.find(
        (o) => o.page === pageIndex && isPointInsideObject(pos, o)
    );
    updatePropertiesPanel();
}

function isPointInsideObject(pos, o) {
    if (o.type === "text") {
        const lines = o.text.split("\n");
        const lineHeight = o.size * 1.2;
        const maxWidth =
            Math.max(...lines.map((l) => l.length)) * o.size * 0.6;
        const totalHeight = lines.length * lineHeight;
        return (
            pos.x >= o.x &&
            pos.x <= o.x + maxWidth &&
            pos.y >= o.y - o.size &&
            pos.y <= o.y + totalHeight
        );
    }
    if (
        ["rect", "ellipse", "line", "arrow", "pen", "highlight", "text-highlight"].includes(
            o.type
        )
    ) {
        const x1 = o.x1 || o.x,
            y1 = o.y1 || o.y,
            x2 = o.x2 || x1,
            y2 = o.y2 || y1;
        return (
            pos.x >= Math.min(x1, x2) - 10 &&
            pos.x <= Math.max(x1, x2) + 10 &&
            pos.y >= Math.min(y1, y2) - 10 &&
            pos.y <= Math.max(y1, y2) + 10
        );
    }
    return false;
}

function updatePropertiesPanel() {
    const panel = document.getElementById("propertiesContent");
    panel.innerHTML = `
  <h3>Tool Properties</h3>
  <fieldset>
    <legend>Text</legend>
    <label>Font: <select id="propFont">
      <option>Arial</option>
      <option>Verdana</option>
      <option>Courier New</option>
      <option>Times New Roman</option>
      <option>Roboto</option>
      <option>Open Sans</option>
      <option>Lato</option>
      <option>Montserrat</option>
      <option>Playfair Display</option>
      <option>Poppins</option>
      <option>Raleway</option>
      <option>Ubuntu</option>
      <option>Merriweather</option>
      <option>Lora</option>
      <option>Oswald</option>
      <option>Pacifico</option>
      <option>Dancing Script</option>
      <option>Caveat</option>
      <option>Great Vibes</option>
      <option>Satisfy</option>
      <option>Indie Flower</option>
      <option>Fredoka</option>
      <option>Inter</option>
      <option>Work Sans</option>
      <option>Quicksand</option>
      <option>Nunito</option>
      <option>Mulish</option>
      <option>Outfit</option>
      <option>Sora</option>
      <option>IBM Plex Mono</option>
      <option>JetBrains Mono</option>
      <option>Source Code Pro</option>
      <option>Space Mono</option>
      <option>Inconsolata</option>
      <option>Fira Code</option>
      <option>Cormorant Garamond</option>
      <option>EB Garamond</option>
      <option>Cinzel</option>
      <option>Bodoni Moda</option>
    </select></label>
    <label>Size: <input type="number" id="propTextSize" value="20" min="6" max="200"></label>
    <label>Color: <input type="color" id="propTextColor" value="#0ff"></label>
  </fieldset>
  <fieldset>
    <legend>Pen</legend>
    <label>Color: <input type="color" id="propPenColor" value="#0ff"></label>
    <label>Size: <input type="number" id="propPenSize" value="2" min="1" max="50"></label>
  </fieldset>
  <fieldset>
    <legend>Shapes</legend>
    <label>Color: <input type="color" id="propShapeColor" value="#0ff"></label>
    <label>Size: <input type="number" id="propShapeSize" value="2" min="1" max="50"></label>
  </fieldset>
`;
}

function eraseAtPoint(pos, pageIndex) {
    const hitObj = objects.find(
        (o) => o.page === pageIndex && isPointInsideObject(pos, o)
    );
    if (hitObj) {
        objects = objects.filter((o) => o.id !== hitObj.id);
        drawObjects();
        saveState();
    }
}

function createTextInput(pageIndex, x, y) {
    // Remove any existing text input
    const existingInput = document.querySelector(".text-input-area");
    if (existingInput) existingInput.remove();

    const wrapper = pages[pageIndex].wrapper;
    const fontSize = parseInt(
        document.getElementById("fontSize")?.value || 20
    );

    const textarea = document.createElement("textarea");
    textarea.className = "text-input-area";

    // Position exactly where clicked
    textarea.style.left = x + "px";
    textarea.style.top = y + "px";
    textarea.style.fontSize = fontSize + "px";
    textarea.style.fontFamily = document.getElementById("fontFamily")?.value || "Arial";

    wrapper.appendChild(textarea);

    // Prevent text selection issues on mobile
    textarea.setAttribute("autocomplete", "off");
    textarea.setAttribute("autocorrect", "off");
    textarea.setAttribute("autocapitalize", "off");
    textarea.setAttribute("spellcheck", "false");

    // Drag functionality for repositioning text
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let startLeft = x;
    let startTop = y;

    function startDrag(e) {
        if (textarea.value.trim()) {
            isDragging = true;
            dragStartX = e.clientX || (e.touches && e.touches[0].clientX);
            dragStartY = e.clientY || (e.touches && e.touches[0].clientY);
            startLeft = parseInt(textarea.style.left);
            startTop = parseInt(textarea.style.top);
            textarea.classList.add("dragging");
            e.preventDefault();
        }
    }

    function moveDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        const deltaX = clientX - dragStartX;
        const deltaY = clientY - dragStartY;

        textarea.style.left = Math.max(0, startLeft + deltaX) + "px";
        textarea.style.top = Math.max(0, startTop + deltaY) + "px";
    }

    function endDrag() {
        isDragging = false;
        textarea.classList.remove("dragging");
    }

    textarea.addEventListener("mousedown", startDrag);
    textarea.addEventListener("touchstart", startDrag, { passive: false });
    document.addEventListener("mousemove", moveDrag);
    document.addEventListener("touchmove", moveDrag, { passive: false });
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchend", endDrag);

    // Auto-scale textarea with content
    function autoResize() {
        textarea.style.height = "auto";
        const newHeight = Math.max(textarea.scrollHeight, fontSize * 1.2);
        textarea.style.height = newHeight + "px";

        // Auto-width based on content - no extra padding since we removed it
        textarea.style.width = "auto";
        const newWidth = Math.max(textarea.scrollWidth, 50);
        textarea.style.width = newWidth + "px";
    }

    textarea.addEventListener("input", autoResize);
    textarea.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" || e.ctrlKey || e.metaKey) {
            autoResize();
        }
    });

    // Small delay to ensure DOM is ready before focus
    setTimeout(() => {
        textarea.focus();
        autoResize();
    }, 50);

    function saveText() {
        const text = textarea.value.trim();
        if (text) {
            // Use exact position where textarea was placed (no offset needed since padding is 0)
            const finalX = parseInt(textarea.style.left);
            const finalY = parseInt(textarea.style.top);
            objects.push({
                id: objectId++,
                type: "text",
                page: pageIndex,
                text,
                font: document.getElementById("fontFamily")?.value || "Arial",
                size: fontSize,
                color: document.getElementById("fontColor")?.value || "#0ff",
                x: finalX,
                y: finalY,
            });
            saveState();
            drawObjects();
        }
        textarea.remove();
    }

    textarea.addEventListener("blur", saveText);
    textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            saveText();
        }
    });
}

function createNoteInput(pageIndex, x, y) {
    // Remove any existing note input
    const existingInput = document.querySelector(".note-input-area");
    if (existingInput) existingInput.remove();

    const wrapper = pages[pageIndex].wrapper;
    const noteColor = document.getElementById("noteColor")?.value || "#ffff00";
    const noteSize = parseInt(document.getElementById("noteSize")?.value || 15);
    const noteFont = document.getElementById("noteFont")?.value || "Arial";

    const textarea = document.createElement("textarea");
    textarea.className = "note-input-area";

    // Position exactly where clicked
    textarea.style.left = x + "px";
    textarea.style.top = y + "px";
    textarea.style.fontSize = noteSize + "px";
    textarea.style.fontFamily = noteFont;
    textarea.style.backgroundColor = noteColor;
    textarea.style.color = "#000";

    wrapper.appendChild(textarea);

    // Mobile attributes
    textarea.setAttribute("autocomplete", "off");
    textarea.setAttribute("autocorrect", "off");
    textarea.setAttribute("autocapitalize", "off");
    textarea.setAttribute("spellcheck", "false");

    // Drag functionality for repositioning note
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let startLeft = x;
    let startTop = y;

    function startDrag(e) {
        if (textarea.value.trim()) {
            isDragging = true;
            dragStartX = e.clientX || (e.touches && e.touches[0].clientX);
            dragStartY = e.clientY || (e.touches && e.touches[0].clientY);
            startLeft = parseInt(textarea.style.left);
            startTop = parseInt(textarea.style.top);
            textarea.classList.add("dragging");
            e.preventDefault();
        }
    }

    function moveDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        const deltaX = clientX - dragStartX;
        const deltaY = clientY - dragStartY;

        textarea.style.left = Math.max(0, startLeft + deltaX) + "px";
        textarea.style.top = Math.max(0, startTop + deltaY) + "px";
    }

    function endDrag() {
        isDragging = false;
        textarea.classList.remove("dragging");
    }

    textarea.addEventListener("mousedown", startDrag);
    textarea.addEventListener("touchstart", startDrag, { passive: false });
    document.addEventListener("mousemove", moveDrag);
    document.addEventListener("touchmove", moveDrag, { passive: false });
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchend", endDrag);

    // Auto-scale textarea with content
    function autoResize() {
        textarea.style.height = "auto";
        const newHeight = Math.max(textarea.scrollHeight, noteSize * 1.5);
        textarea.style.height = newHeight + "px";

        // Auto-width based on content
        textarea.style.width = "auto";
        const newWidth = Math.max(textarea.scrollWidth, 100);
        textarea.style.width = newWidth + "px";
    }

    textarea.addEventListener("input", autoResize);
    textarea.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" || e.ctrlKey || e.metaKey) {
            autoResize();
        }
    });

    // Small delay to ensure DOM is ready before focus
    setTimeout(() => {
        textarea.focus();
        autoResize();
    }, 50);

    function saveNote() {
        const text = textarea.value.trim();
        if (text) {
            // Use exact position where textarea was placed
            const finalX = parseInt(textarea.style.left);
            const finalY = parseInt(textarea.style.top);
            objects.push({
                id: objectId++,
                type: "note",
                page: pageIndex,
                text,
                color: noteColor,
                size: noteSize,
                font: document.getElementById("noteFont")?.value || "Arial",
                x: finalX,
                y: finalY,
            });
            saveState();
            drawObjects();
        }
        textarea.remove();
    }

    textarea.addEventListener("blur", saveNote);
    textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            saveNote();
        }
    });
}

function saveState() {
    undoStack.push(JSON.stringify(objects));
    redoStack = [];
}

// ===================== EXPORT PDF =====================
document.getElementById("exportPDF").onclick = async () => {
    if (!pdfDoc) {
        alert("No PDF loaded");
        return;
    }

    try {
        const { PDFDocument, rgb, StandardFonts } = PDFLib;

        // Load original PDF file
        const pdfBytes = await pdfDoc.getData();
        const newPdf = await PDFDocument.load(pdfBytes);

        const pages_list = await newPdf.getPages();

        // Get scale factor from rendered pages
        const scaleFactor = pages[0] ? pages[0].scale : 1;

        // Embed standard fonts for use in PDF
        const helveticaFont = await newPdf.embedFont(StandardFonts.Helvetica);
        const timesFont = await newPdf.embedFont(StandardFonts.TimesRoman);
        const courierFont = await newPdf.embedFont(StandardFonts.Courier);

        // Add annotations to each page
        for (let i = 0; i < pages_list.length; i++) {
            const page = pages_list[i];
            const pageAnnotations = objects.filter((o) => o.page === i);
            const pageSize = page.getSize();
            const pageHeight = pageSize.height;

            // Draw each annotation as vector
            pageAnnotations.forEach((annotation) => {
                if (annotation.type === "text") {
                    const fontSize = annotation.size / scaleFactor;
                    const fontColor = hexToRgb(annotation.color);
                    const fontName = getStandardFontName(annotation.font);
                    let selectedFont = helveticaFont;
                    if (fontName === "TimesRoman") selectedFont = timesFont;
                    else if (fontName === "Courier") selectedFont = courierFont;
                    
                    page.drawText(annotation.text, {
                        x: annotation.x / scaleFactor,
                        y: pageHeight - annotation.y / scaleFactor - fontSize,
                        size: fontSize,
                        color: rgb(
                            fontColor.r / 255,
                            fontColor.g / 255,
                            fontColor.b / 255
                        ),
                        font: selectedFont,
                    });
                } else if (
                    annotation.type === "pen" ||
                    annotation.type === "highlight"
                ) {
                    drawPathOnPage(
                        page,
                        annotation.path,
                        annotation.color,
                        annotation.size / scaleFactor,
                        annotation.type === "highlight" ? 0.35 : 1,
                        pageHeight,
                        scaleFactor
                    );
                } else if (annotation.type === "text-highlight") {
                    const highlightColor = hexToRgb(annotation.color);
                    page.drawRectangle({
                        x: annotation.x1 / scaleFactor,
                        y: pageHeight - annotation.y2 / scaleFactor,
                        width: (annotation.x2 - annotation.x1) / scaleFactor,
                        height: (annotation.y2 - annotation.y1) / scaleFactor,
                        color: rgb(
                            highlightColor.r / 255,
                            highlightColor.g / 255,
                            highlightColor.b / 255
                        ),
                        opacity: 0.35,
                    });
                } else if (
                    ["rect", "ellipse", "line", "arrow"].includes(annotation.type)
                ) {
                    drawShapeOnPage(page, annotation, pageHeight, scaleFactor);
                } else if (annotation.type === "signature") {
                    drawSignatureOnPage(page, annotation, pageHeight, scaleFactor, helveticaFont, timesFont, courierFont);
                } else if (annotation.type === "note") {
                    const noteColor = hexToRgb(annotation.color);
                    const fontName = getStandardFontName(annotation.font);
                    let selectedFont = helveticaFont;
                    if (fontName === "TimesRoman") selectedFont = timesFont;
                    else if (fontName === "Courier") selectedFont = courierFont;
                    const noteFontSize = annotation.size / scaleFactor;
                    
                    page.drawText(annotation.text, {
                        x: annotation.x / scaleFactor,
                        y: pageHeight - annotation.y / scaleFactor - noteFontSize,
                        size: noteFontSize,
                        color: rgb(
                            noteColor.r / 255,
                            noteColor.g / 255,
                            noteColor.b / 255
                        ),
                        font: selectedFont,
                    });
                }
            });
        }

        const pdfBytesExport = await newPdf.save();
        const blob = new Blob([pdfBytesExport], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${pdfFileName}-edited.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        console.log("✓ Exported as vector PDF (no rasterization)");
        console.log("✓ Vector PDF exported successfully!\n\nYour PDF contains:\n• Original vector content\n• Vector annotations (text, shapes, drawings)");
    } catch (e) {
        console.error("Export error:", e);
        alert("Error exporting PDF: " + e.message);
    }
};

// Helper function to convert hex color to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : { r: 0, g: 255, b: 255 };
}

// Draw path (pen, highlight) on PDF page
function drawPathOnPage(
    page,
    path,
    color,
    size,
    opacity,
    pageHeight,
    scaleFactor
) {
    if (!path || path.length < 2) return;

    const { rgb } = PDFLib;
    const colorRgb = hexToRgb(color);
    const pdfColor = rgb(
        colorRgb.r / 255,
        colorRgb.g / 255,
        colorRgb.b / 255
    );

    // Draw as vector line segments (pure PDF vectors, not rasterized)
    for (let i = 0; i < path.length - 1; i++) {
        const p1 = path[i];
        const p2 = path[i + 1];

        page.drawLine({
            start: {
                x: p1.x / scaleFactor,
                y: pageHeight - p1.y / scaleFactor,
            },
            end: {
                x: p2.x / scaleFactor,
                y: pageHeight - p2.y / scaleFactor,
            },
            thickness: size,
            color: pdfColor,
            opacity: opacity,
        });
    }
}

// Draw shape on PDF page - VECTOR ONLY
function drawShapeOnPage(page, shape, pageHeight, scaleFactor) {
    const { rgb } = PDFLib;
    const colorRgb = hexToRgb(shape.color);
    const pdfColor = rgb(
        colorRgb.r / 255,
        colorRgb.g / 255,
        colorRgb.b / 255
    );

    const x1 = shape.x1 / scaleFactor;
    const y1 = pageHeight - shape.y1 / scaleFactor;
    const x2 = shape.x2 / scaleFactor;
    const y2 = pageHeight - shape.y2 / scaleFactor;
    const thickness = shape.size / scaleFactor;

    if (shape.type === "rect") {
        // Vector rectangle (pure PDF path)
        page.drawRectangle({
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y1 - y2),
            color: pdfColor,
            borderColor: pdfColor,
            borderWidth: thickness,
        });
    } else if (shape.type === "line" || shape.type === "arrow") {
        // Vector line (pure PDF vector)
        page.drawLine({
            start: { x: x1, y: y1 },
            end: { x: x2, y: y2 },
            thickness: thickness,
            color: pdfColor,
        });
    } else if (shape.type === "ellipse") {
        // Vector ellipse (pure PDF path)
        page.drawEllipse({
            x: (x1 + x2) / 2,
            y: (y1 + y2) / 2,
            xScale: Math.abs(x2 - x1) / 2,
            yScale: Math.abs(y1 - y2) / 2,
            color: pdfColor,
            borderColor: pdfColor,
            borderWidth: thickness,
        });
    }
}

// Draw signature on PDF page - VECTOR ONLY
function drawSignatureOnPage(page, sig, pageHeight, scaleFactor, helveticaFont, timesFont, courierFont) {
    if (!sig.storedSignatureData) return;

    const signatureData = sig.storedSignatureData;
    const { rgb } = PDFLib;
    const pdfColor = rgb(0, 1, 1); // Cyan color

    if (signatureData.mode === "draw" && signatureData.data) {
        // Draw signature as vector paths (pure PDF vectors, not rasterized)
        signatureData.data.forEach((stroke) => {
            if (!stroke.points || stroke.points.length < 2) return;
            for (let i = 0; i < stroke.points.length - 1; i++) {
                const p1 = stroke.points[i];
                const p2 = stroke.points[i + 1];
                page.drawLine({
                    start: {
                        x: sig.x / scaleFactor + p1.x / scaleFactor,
                        y: pageHeight - (sig.y / scaleFactor + p1.y / scaleFactor),
                    },
                    end: {
                        x: sig.x / scaleFactor + p2.x / scaleFactor,
                        y: pageHeight - (sig.y / scaleFactor + p2.y / scaleFactor),
                    },
                    thickness: 1.5,
                    color: pdfColor,
                });
            }
        });
    } else if (signatureData.mode === "type" && signatureData.text) {
        // Select font based on the signature's font choice
        const fontName = getStandardFontName(signatureData.font);
        let selectedFont = helveticaFont;
        if (fontName === "TimesRoman") selectedFont = timesFont;
        else if (fontName === "Courier") selectedFont = courierFont;
        
        // Draw signature text as vector text with proper font
        page.drawText(signatureData.text, {
            x: sig.x / scaleFactor,
            y: pageHeight - sig.y / scaleFactor,
            size: 20,
            color: pdfColor,
            font: selectedFont,
        });
    }
}

updatePropertiesPanel();

// ===================== SIGNATURE MANAGEMENT =====================
let storedSignature = null;
let signatureMode = "draw";
let signaturePadEditor = null;
let tempSignatureData = null;

function loadSignatureFromStorage() {
    const stored = localStorage.getItem("userSignature");
    if (stored) {
        storedSignature = JSON.parse(stored);
    }
}

// Load signature from storage on page load
loadSignatureFromStorage();

function saveSignatureToStorage(signature) {
    localStorage.setItem("userSignature", JSON.stringify(signature));
    storedSignature = signature;
}

function openSignatureModal() {
    document.getElementById("signatureModal").classList.add("active");
    signatureMode = "draw";
    updateSignatureModeUI();
    setTimeout(() => initSignatureDrawCanvas(), 100);
}

function closeSignatureModal() {
    document.getElementById("signatureModal").classList.remove("active");
    if (signaturePadEditor) {
        signaturePadEditor.clear();
        signaturePadEditor = null;
    }
}

function initSignatureDrawCanvas() {
    const canvas = document.getElementById("signatureDrawCanvas");
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = 200;

    signaturePadEditor = new SignaturePad(canvas, {
        backgroundColor: "rgba(34, 34, 34, 1)",
    });
}

function updateSignatureModeUI() {
    document.querySelectorAll(".signature-mode-btn").forEach((btn) => {
        btn.classList.remove("active");
    });
    document
        .querySelector(`[data-mode="${signatureMode}"]`)
        .classList.add("active");

    const drawCanvas = document.getElementById("signatureDrawCanvas");
    const typeInput = document.getElementById("signatureTypeInput");

    if (signatureMode === "draw") {
        drawCanvas.classList.remove("hidden");
        typeInput.classList.add("hidden");
        setTimeout(() => {
            if (!signaturePadEditor) initSignatureDrawCanvas();
        }, 50);
    } else {
        drawCanvas.classList.add("hidden");
        typeInput.classList.remove("hidden");
        typeInput.value = "";
        typeInput.focus();
    }
}

function updateSignaturePreview() {
    const previewCanvas = document.getElementById("signaturePreviewCanvas");
    const previewCtx = previewCanvas.getContext("2d");

    previewCanvas.width = 400;
    previewCanvas.height = 150;
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

    if (signatureMode === "draw" && signaturePadEditor) {
        const srcCanvas = signaturePadEditor.canvas;
        const ratio = Math.min(
            previewCanvas.width / srcCanvas.width,
            previewCanvas.height / srcCanvas.height
        );
        const x = (previewCanvas.width - srcCanvas.width * ratio) / 2;
        const y = (previewCanvas.height - srcCanvas.height * ratio) / 2;
        previewCtx.drawImage(
            srcCanvas,
            x,
            y,
            srcCanvas.width * ratio,
            srcCanvas.height * ratio
        );
    } else {
        const text = document.getElementById("signatureTypeInput").value;
        if (text) {
            previewCtx.fillStyle = "#0ff";
            previewCtx.font = "italic 48px cursive";
            previewCtx.textAlign = "center";
            previewCtx.textBaseline = "middle";
            previewCtx.fillText(
                text,
                previewCanvas.width / 2,
                previewCanvas.height / 2
            );
        }
    }
}

function saveCurrentSignature() {
    if (signatureMode === "draw") {
        if (!signaturePadEditor || signaturePadEditor.isEmpty()) {
            alert("Please draw your signature");
            return;
        }
        const signature = {
            mode: "draw",
            data: signaturePadEditor.toData(),
            font: document.getElementById("signatureFont")?.value || "cursive",
        };
        saveSignatureToStorage(signature);
    } else {
        const text = document
            .getElementById("signatureTypeInput")
            .value.trim();
        if (!text) {
            alert("Please type your signature");
            return;
        }
        const signature = {
            mode: "type",
            text: text,
            font: document.getElementById("signatureFont")?.value || "cursive",
        };
        saveSignatureToStorage(signature);
    }
    closeSignatureModal();
}

function clearStoredSignature() {
    if (confirm("Are you sure you want to clear your signature?")) {
        localStorage.removeItem("userSignature");
        storedSignature = null;
        document.getElementById("signatureTypeInput").value = "";
        if (signaturePadEditor) signaturePadEditor.clear();
        updateSignaturePreview();
    }
}

// Mode selector
document.querySelectorAll(".signature-mode-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        signatureMode = e.target.getAttribute("data-mode");
        updateSignatureModeUI();
        setTimeout(() => updateSignaturePreview(), 50);
    });
});

// Input listeners
document
    .getElementById("signatureTypeInput")
    ?.addEventListener("input", () => {
        updateSignaturePreview();
    });

if (signaturePadEditor) {
    signaturePadEditor.addEventListener("endStroke", () => {
        updateSignaturePreview();
    });
}

// Modal buttons
document
    .getElementById("confirmSignature")
    .addEventListener("click", saveCurrentSignature);
document
    .getElementById("cancelSignature")
    .addEventListener("click", closeSignatureModal);
document
    .getElementById("clearSignature")
    .addEventListener("click", clearStoredSignature);

// Close modal on backdrop click
document
    .getElementById("signatureModal")
    .addEventListener("click", (e) => {
        if (e.target.id === "signatureModal") {
            closeSignatureModal();
        }
    });

// Add signature button to tool options
function updateSignatureToolUI() {
    const subToolbar = document.getElementById("subToolbar");
    if (
        tool === "signature" &&
        !subToolbar.querySelector(".signature-manage-btn")
    ) {
        const btn = document.createElement("button");
        btn.className = "signature-manage-btn";
        btn.textContent = "⚙️ Manage Signature";
        btn.addEventListener("click", openSignatureModal);
        subToolbar.appendChild(btn);
    }
}

// Override updateSubToolbar to add signature button
const originalUpdateSubToolbar = updateSubToolbar;
updateSubToolbar = function () {
    originalUpdateSubToolbar.call(this);
    if (tool === "signature") {
        updateSignatureToolUI();
    }
};

// Draw stored signature on canvas
function drawStoredSignature(o, ctx) {
    if (!o.storedSignatureData) return;

    const sig = o.storedSignatureData;
    const offsetX = o.x || 0;
    const offsetY = o.y || 0;
    
    if (sig.mode === "draw" && sig.data) {
        ctx.strokeStyle = "#0ff";
        ctx.lineWidth = 2;
        sig.data.forEach((stroke) => {
            if (!stroke.points) return;
            ctx.beginPath();
            stroke.points.forEach((p, i) => {
                const x = p.x + offsetX;
                const y = p.y + offsetY;
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            });
            ctx.stroke();
        });
    } else if (sig.mode === "type" && sig.text) {
        ctx.fillStyle = "#0ff";
        const font = sig.font || "cursive";
        ctx.font = `italic 20px ${font}`;
        ctx.fillText(sig.text, offsetX, offsetY);
    }
}

// Old signature handler removed - now handled in handleMouseUp function above

// Override drawSignature to use stored data
function drawSignature(o, ctx) {
    if (o.storedSignatureData) {
        drawStoredSignature(o, ctx);
    } else if (o.path) {
        ctx.strokeStyle = "#0ff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        o.path.forEach((stroke) => {
            if (!stroke.points) return;
            stroke.points.forEach((p, i) =>
                i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
            );
        });
        ctx.stroke();
    }
}

// ===================== PAGE PREVIEW =====================
let currentPreviewPage = 0;

function showPagePreview(pageIndex) {
    currentPreviewPage = pageIndex;
    renderPagePreview();
    document.getElementById("pagePreviewModal").classList.add("active");
}

async function renderPagePreview() {
    const previewCanvas = document.getElementById("pagePreviewCanvas");
    const pageNum = currentPreviewPage + 1;

    if (!pdfDoc || pageNum > pdfDoc.numPages) return;

    try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 });

        previewCanvas.width = viewport.width;
        previewCanvas.height = viewport.height;

        await page.render({
            canvasContext: previewCanvas.getContext("2d"),
            viewport: viewport,
        }).promise;

        // Update title and info
        document.getElementById("pagePreviewTitle").textContent = `Page ${pageNum}`;
        document.getElementById("pagePreviewInfo").textContent = `Page ${pageNum} of ${pdfDoc.numPages}`;

        // Update button states
        document.getElementById("prevPageBtn").disabled = pageNum === 1;
        document.getElementById("nextPageBtn").disabled = pageNum === pdfDoc.numPages;
    } catch (e) {
        console.error("Preview render error:", e);
    }
}

function scrollToPage() {
    // Use currentPreviewPage which is 0-indexed
    const pageIndex = currentPreviewPage;
    if (pageIndex < 0 || pageIndex >= pages.length) {
        console.error("Invalid page index:", pageIndex);
        return;
    }
    
    const wrapper = pages[pageIndex].wrapper;
    if (!wrapper) {
        console.error("Page wrapper not found for index:", pageIndex);
        return;
    }
    
    wrapper.scrollIntoView({ behavior: "smooth" });

    // Update thumbnail selection
    document
        .querySelectorAll(".thumbnail")
        .forEach((t) => t.classList.remove("selected"));
    document.querySelectorAll(".thumbnail")[pageIndex]?.classList.add("selected");

    // Close modal
    document.getElementById("pagePreviewModal").classList.remove("active");
}

// Preview modal controls
document.getElementById("closePreview").addEventListener("click", () => {
    document.getElementById("pagePreviewModal").classList.remove("active");
});

document.getElementById("prevPageBtn").addEventListener("click", () => {
    if (currentPreviewPage > 0) {
        currentPreviewPage--;
        renderPagePreview();
    }
});

document.getElementById("nextPageBtn").addEventListener("click", () => {
    if (currentPreviewPage < pdfDoc.numPages - 1) {
        currentPreviewPage++;
        renderPagePreview();
    }
});

document.getElementById("goToPageBtn").addEventListener("click", () => {
    scrollToPage();
});

// Close modal on backdrop click
document.getElementById("pagePreviewModal").addEventListener("click", (e) => {
    if (e.target.id === "pagePreviewModal") {
        document.getElementById("pagePreviewModal").classList.remove("active");
    }
});

// ===================== PANEL TOGGLES =====================
const togglePagesBtn = document.getElementById("toggleSidebar");
const togglePropertiesBtn = document.getElementById("toggleProperties");
const appContainer = document.getElementById("app");

if (togglePagesBtn) {
    togglePagesBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        appContainer.classList.toggle("pages-hidden");
        
        // Save preference to localStorage
        const isPagesHidden = appContainer.classList.contains("pages-hidden");
        localStorage.setItem("pagesHidden", isPagesHidden);
    });
    
    // Restore state from localStorage
    const isPagesHidden = localStorage.getItem("pagesHidden") === "true";
    if (isPagesHidden) {
        appContainer.classList.add("pages-hidden");
    }
}

if (togglePropertiesBtn) {
    togglePropertiesBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        appContainer.classList.toggle("properties-hidden");
        
        // Save preference to localStorage
        const isPropertiesHidden = appContainer.classList.contains("properties-hidden");
        localStorage.setItem("propertiesHidden", isPropertiesHidden);
    });
    
    // Restore state from localStorage
    const isPropertiesHidden = localStorage.getItem("propertiesHidden") === "true";
    if (isPropertiesHidden) {
        appContainer.classList.add("properties-hidden");
    }
}

// ===================== WINDOW RESIZE =====================
window.addEventListener("resize", () => {
    if (pdfDoc) {
        renderAllPages();
    }
});

// ===================== TEXT SELECTION & HIGHLIGHT =====================
let selectedTextRanges = []; // Array of {pageIndex, startChar, endChar, textObjectId}
let isTextSelecting = false;
let selectionStart = null;
let selectionCanvas = null;
let selectionPageIndex = null;

// Enable text selection on canvas - only for select tool
document.addEventListener("mousedown", (e) => {
    if (tool === "select" && e.target.classList && e.target.classList.contains("drawCanvas")) {
        isTextSelecting = true;
        selectionCanvas = e.target;
        selectionPageIndex = Array.from(pages).findIndex(p => p.drawCanvas === selectionCanvas);
        const rect = selectionCanvas.getBoundingClientRect();
        selectionStart = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        selectedTextRanges = [];
    } else {
        // Reset text selection for other tools
        isTextSelecting = false;
        selectionStart = null;
        selectionCanvas = null;
        selectionPageIndex = null;
    }
});

// Get character index at position for text selection
function getCharIndexAtPos(textObj, x, y) {
    const lines = textObj.text.split("\n");
    const lineHeight = textObj.size * 1.2;
    
    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const lineY = textObj.y + lineIdx * lineHeight;
        if (y >= lineY && y < lineY + lineHeight) {
            const line = lines[lineIdx];
            for (let charIdx = 0; charIdx <= line.length; charIdx++) {
                const charWidth = line.substring(0, charIdx).length * textObj.size * 0.6;
                if (x <= textObj.x + charWidth) {
                    let totalChars = 0;
                    for (let i = 0; i < lineIdx; i++) {
                        totalChars += lines[i].length + 1; // +1 for newline
                    }
                    return totalChars + charIdx;
                }
            }
            let totalChars = 0;
            for (let i = 0; i < lineIdx; i++) {
                totalChars += lines[i].length + 1;
            }
            return totalChars + line.length;
        }
    }
    return textObj.text.length;
}

document.addEventListener("mousemove", (e) => {
    if (isTextSelecting && selectionStart && selectionCanvas && selectionPageIndex >= 0) {
        const rect = selectionCanvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        // Find all text objects intersecting with selection box
        const minX = Math.min(selectionStart.x, currentX);
        const maxX = Math.max(selectionStart.x, currentX);
        const minY = Math.min(selectionStart.y, currentY);
        const maxY = Math.max(selectionStart.y, currentY);
        
        selectedTextRanges = [];
        
        objects.filter(o => o.page === selectionPageIndex && o.type === "text")
            .forEach(textObj => {
                const lines = textObj.text.split("\n");
                const lineHeight = textObj.size * 1.2;
                const width = Math.max(...lines.map(l => l.length)) * textObj.size * 0.6;
                const height = lines.length * lineHeight;
                
                // Check if text object overlaps with selection
                if (textObj.x < maxX && textObj.x + width > minX &&
                    textObj.y < maxY && textObj.y + height > minY) {
                    
                    const startChar = getCharIndexAtPos(textObj, minX - textObj.x, minY - textObj.y);
                    const endChar = getCharIndexAtPos(textObj, maxX - textObj.x, maxY - textObj.y);
                    
                    selectedTextRanges.push({
                        pageIndex: selectionPageIndex,
                        objectId: textObj.id,
                        startChar: Math.min(startChar, endChar),
                        endChar: Math.max(startChar, endChar),
                    });
                }
            });
        
        drawObjects();
    }
});

document.addEventListener("mouseup", (e) => {
    isTextSelecting = false;
    selectionStart = null;
    selectionCanvas = null;
    selectionPageIndex = null;
    drawObjects();
});

// Draw selected text highlight
function drawTextSelection() {
    selectedTextRanges.forEach(range => {
        const textObj = objects.find(o => o.id === range.objectId);
        if (!textObj || textObj.page >= pages.length) return;
        
        const ctx = pages[textObj.page].drawCanvas.getContext("2d");
        
        const lines = textObj.text.split("\n");
        const lineHeight = textObj.size * 1.2;
        let charCount = 0;
        
        lines.forEach((line, lineIdx) => {
            for (let i = 0; i < line.length; i++) {
                if (charCount >= range.startChar && charCount < range.endChar) {
                    const x = textObj.x + i * textObj.size * 0.6;
                    const y = textObj.y + lineIdx * lineHeight;
                    
                    // Draw light blue background
                    ctx.fillStyle = "#ADD8E6";
                    ctx.fillRect(x, y - textObj.size, textObj.size * 0.6, textObj.size * 1.2);
                    
                    // Draw white text
                    ctx.fillStyle = "#ffffff";
                    ctx.font = `${textObj.size}px ${textObj.font}`;
                    ctx.textBaseline = "top";
                    ctx.fillText(line[i], x, y - textObj.size);
                }
                charCount++;
            }
            charCount++; // newline
        });
    });
}

// Draw text highlight boxes
function drawTextHighlight(o, ctx) {
    const width = o.x2 - o.x1;
    const height = o.y2 - o.y1;
    
    ctx.fillStyle = o.color || "#ffff00";
    ctx.globalAlpha = 0.35;
    ctx.fillRect(o.x1, o.y1, width, height);
    ctx.globalAlpha = 1;
}
