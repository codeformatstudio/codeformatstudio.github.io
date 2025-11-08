function typewriter(text, speed, place, typeOfText) {
    if (speed === void 0) { speed = 50; }
    if (place === void 0) { place = "body"; }
    if (typeOfText === void 0) { typeOfText = "innerHTML"; }
    var element;
    if (!place || place.toLowerCase() === "body") {
        element = document.body;
    }
    else if (place.toLowerCase() === "head") {
        console.warn("Typing in <head> is not visible. Using <body> instead.");
        element = document.body;
    }
    else {
        element = document.getElementById(place);
    }
    if (!element) {
        console.error("Element \"".concat(place, "\" not found."));
        return;
    }
    if (!speed || speed <= 0)
        speed = 50;
    var i = 0;
    var buffer = "";
    function type() {
        if (i < text.length) {
            buffer += text.charAt(i);
            i++;
            if (typeOfText === "innerHTML") {
                element.innerHTML = buffer;
            }
            else if (typeOfText === "innerText") {
                element.innerText = buffer;
            }
            else if (typeOfText === "textContent") {
                element.textContent = buffer;
            }
            else if (typeOfText === "outerText") {
                element.outerText = buffer;
            }
            else if (typeOfText === "outerHTML") {
                element.outerHTML = buffer;
            }
            var randomSpeed = speed + Math.random() * 50 - 25;
            setTimeout(type, Math.max(10, randomSpeed));
        }
    }
    type();
}
