import crel from "crel";
export class TitleScreen {
  constructor({ onNameChanged, onStartGame }) {
    this.html = crel(
      crel("div", { id: "title-screen" }),
      crel("h1", { id: "title" }, "Matching Pairs"),
      crel(
        "div",
        { id: "title-cards" },
        crel("div", { id: "card1" }),
        crel("div", { id: "card2" })
      ),
      crel("input", {
        type: "text",
        id: "name",
        placeholder: "Enter your name",
        onchange: (e) => onNameChanged(e.target.value),
      }),
      crel(
        "div",
        { id: "start-buttons" },
        crel(
          "button",
          { id: "1player", onclick: () => onStartGame(1) },
          "1 Player"
        ),
        crel(
          "button",
          { id: "2player", onclick: () => onStartGame(2) },
          "2 Player"
        )
      )
    );
  }

  render() {
    const app = document.querySelector("#app");
    app.replaceChildren(this.html);
  }
}
