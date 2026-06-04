var Typewriter = /** @class */ (function () {
    function Typewriter(text, speed, place, typeOfText) {
        if (speed === void 0) { speed = 50; }
        if (place === void 0) { place = "body"; }
        if (typeOfText === void 0) { typeOfText = "innerHTML"; }
        this.buffer = "";
        this.index = 0;
        this.text = text;
        this.speed = speed > 0 ? speed : 50;
        this.place = place;
        this.typeOfText = typeOfText;
        this.element = this.getElement(place);
        if (!this.element) {
            console.error("Element \"".concat(place, "\" not found."));
            return;
        }
    }
    /** Gets an element reference based on the provided place string */
    Typewriter.prototype.getElement = function (place) {
        if (!place || place.toLowerCase() === "body") {
            return document.body;
        }
        else if (place.toLowerCase() === "head") {
            console.warn("Typing in <head> is not visible. Using <body> instead.");
            return document.body;
        }
        else {
            return document.getElementById(place);
        }
    };
    /** Starts the typing effect */
    Typewriter.prototype.type = function () {
        this.typeRecursive();
    };
    /** Private recursive typing logic */
    Typewriter.prototype.typeRecursive = function () {
        var _this = this;
        if (!this.element)
            return;
        if (this.index < this.text.length) {
            this.buffer += this.text.charAt(this.index);
            this.index++;
            switch (this.typeOfText) {
                case "innerText":
                    this.element.innerText = this.buffer;
                    break;
                case "textContent":
                    this.element.textContent = this.buffer;
                    break;
                case "outerText":
                    this.element.outerText = this.buffer;
                    break;
                case "outerHTML":
                    this.element.outerHTML = this.buffer;
                    break;
                case "innerHTML":
                default:
                    this.element.innerHTML = this.buffer;
            }
            var randomSpeed = this.speed + Math.random() * 50 - 25;
            setTimeout(function () { return _this.typeRecursive(); }, Math.max(10, randomSpeed));
        }
    };
    return Typewriter;
}());
// Example usage:
// const typer = new Typewriter("Hello, world!", 80, "output", "innerText");
// typer.type();
