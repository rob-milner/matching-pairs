export class TitleScreen {
  constructor({ onNameChanged, onStartGame }) {
    const div = document.createElement("div");
    div.id = "title-screen";
    const h1 = document.createElement("h1");
    const text = document.createTextNode("Matching Pairs");
    h1.appendChild(text);
    const input = document.createElement("input");
    input.type = "text";
    input.id = "name";
    input.placeholder = "Enter your name";
    input.onchange = (e) => {
      onNameChanged(e.target.value);
    };
    const button = document.createElement("button");
    button.id = "start";
    const buttonText = document.createTextNode("Start Game");
    button.onclick = onStartGame;
    button.appendChild(buttonText);
    div.appendChild(h1);
    div.appendChild(input);
    div.appendChild(button);
    this.html = div;
  }

  render() {
    const app = document.querySelector("#app");
    app.replaceChildren(this.html);
  }
}
