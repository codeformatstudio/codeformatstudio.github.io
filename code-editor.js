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
const previewBtn = document.getElementById("previewBtn");
const previewScreen = document.getElementById("previewScreen");
const choosingList = document.getElementById("choosingList");
const htmlValue = htmlSelect.textContent;
const cssValue = cssSelect.textContent;
const jsValue = jsSelect.textContent;
const pyValue = pySelect.textContent;
const previewStyle = document.getElementById("previewScreen").style;
const form = document.querySelector("form");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (previewInput.value.toLowerCase() === "Dock To Bottom".toLowerCase()) {
    previewStyle.bottom = "0";
    previewStyle.width = "100%";
    previewStyle.display = "flex";
  }
});
