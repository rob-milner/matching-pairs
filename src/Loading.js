export class Loading {
  constructor() {
    const div = document.createElement("div");
    div.id = "loading";
    const text = document.createTextNode("Loading...");
    div.appendChild(text);

    this.html = div;
  }

  async init() {
    return new Promise((resolve) => {
      const sprite = new Image();
      sprite.src = "../fruit.png";
      sprite.onload = () => {
        resolve(sprite);
      };
    });
  }

  render() {
    const app = document.querySelector("#app");
    app.append(this.html);
  }
}
