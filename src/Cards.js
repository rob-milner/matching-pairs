import crel from "crel";
import { cardTypes } from "./constants";

export class Cards {
  constructor({ name }) {
    this.shuffleCards();
    this.selectedCards = [];
    this.score = 0;
    this.name = name;

    const app = document.querySelector("#app");

    const cardElements = [];
    for (let i = 0; i < this.cards.length; i++) {
      cardElements.push(
        crel("div", {
          id: i,
          class: `card ${this.cards[i].status} ${this.cards[i].type}`,
          onclick: (e) => this.handleCardClick(e.target.id),
        })
      );
    }

    app.innerHTML = "";
    this.html = crel(
      app,
      crel("div", { id: "cards" }, [...cardElements]),
      crel("div", { id: "status" })
    );
  }

  shuffleCards() {
    const deck = [];
    let id = 1;
    for (const type of cardTypes) {
      deck.push({ id: id++, type, status: "hidden" });
      deck.push({ id: id++, type, status: "hidden" });
    }
    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    this.cards = deck;
  }

  newGame() {
    this.score = 0;
    this.winner = false;
    this.shuffleCards();
    this.updateAllCards();
    this.updateStatus();
  }

  newMultiplayerGame() {}

  updateCard(index) {
    const c = this.cards[index];
    const card = document.querySelector(`.card[id="${index}"]`);
    card.classList = `card ${c.status} ${c.type}`;
  }

  updateAllCards() {
    for (let i = 0; i < this.cards.length; i++) {
      this.updateCard(i);
    }
  }

  updateStatus() {
    const status = document.getElementById("status");
    status.innerHTML = "";
    if (this.winner) {
      crel(
        status,
        `${this.name} wins! Score: ${this.score}`,
        crel(
          "button",
          { id: "restart", onclick: () => this.newGame() },
          "Play Again"
        )
      );
    } else {
      crel(status, `${this.name}: ${this.score}`);
    }
  }

  addPoint() {
    this.score++;
    this.updateStatus();
  }

  checkForWinner() {
    if (this.cards.every((c) => c.status === "matched")) {
      this.winner = true;
    }
  }

  handleCardClick(index) {
    if (this.selectedCards.length === 2) return;
    if (this.cards[index].status !== "hidden") return;
    this.selectedCards.push(index);
    this.cards[index].status = "visible";

    if (this.selectedCards.length === 2) {
      const [first, second] = this.selectedCards;
      if (this.cards[first].type === this.cards[second].type) {
        this.cards[first].status = "matched";
        this.cards[second].status = "matched";
        this.selectedCards = [];
        this.updateCard(first);
        this.updateCard(second);
        this.addPoint();
        this.checkForWinner();
        this.updateStatus();
        return;
      } else {
        setTimeout(() => {
          this.cards[first].status = "hidden";
          this.cards[second].status = "hidden";
          this.selectedCards = [];
          this.updateCard(first);
          this.updateCard(second);
        }, 750);
      }
    }
    this.updateCard(index);
  }
}
