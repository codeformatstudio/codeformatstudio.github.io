class Typewriter {
  private text: string;
  private speed: number;
  private place: string;
  private typeOfText: "innerHTML" | "innerText" | "textContent" | "outerHTML" | "outerText";
  private element: HTMLElement | null;
  private buffer: string = "";
  private index: number = 0;

  constructor(
    text: string,
    speed: number = 50,
    place: string = "body",
    typeOfText: "innerHTML" | "innerText" | "textContent" | "outerHTML" | "outerText" = "innerHTML"
  ) {
    this.text = text;
    this.speed = speed > 0 ? speed : 50;
    this.place = place;
    this.typeOfText = typeOfText;
    this.element = this.getElement(place);

    if (!this.element) {
      console.error(`Element "${place}" not found.`);
      return;
    }
  }

  /** Gets an element reference based on the provided place string */
  private getElement(place: string): HTMLElement | null {
    if (!place || place.toLowerCase() === "body") {
      return document.body;
    } else if (place.toLowerCase() === "head") {
      console.warn("Typing in <head> is not visible. Using <body> instead.");
      return document.body;
    } else {
      return document.getElementById(place);
    }
  }

  /** Starts the typing effect */
  public type(): void {
    this.typeRecursive();
  }

  /** Private recursive typing logic */
  private typeRecursive(): void {
    if (!this.element) return;

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

      const randomSpeed = this.speed + Math.random() * 50 - 25;
      setTimeout(() => this.typeRecursive(), Math.max(10, randomSpeed));
    }
  }
}

// Example usage:
// const typer = new Typewriter("Hello, world!", 80, "output", "innerText");
// typer.type();
