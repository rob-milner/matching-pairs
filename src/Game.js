import { cardTypes, fruits } from "./constants";

export class Game {
  constructor({ name, sprite }) {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "canvas";
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight * 0.8;
    this.canvas.addEventListener("click", (e) => {
      this.handleCardClick(e);
    });
    this.ctx = this.canvas.getContext("2d");
    this.cardWidth = Math.floor(this.canvas.width / 5);
    this.cardHeight = this.cardWidth * 1.5;
    this.gap = this.cardWidth / 5;
    this.cols = 4;
    this.cards = [];
    this.selectedCards = [];
    this.score = 0;
    this.name = name;
    this.sprite = sprite;
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
    this.renderCards();
    this.renderStatus();
  }

  renderCards() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      switch (card.status) {
        case "hidden":
          this.ctx.fillStyle = "white";
          break;
        case "visible":
          this.ctx.fillStyle = "orange";
          break;
        case "matched":
          this.ctx.fillStyle = "green";
          break;
      }
      const x = (i % this.cols) * (this.cardWidth + this.gap);
      const y = Math.floor(i / this.cols) * (this.cardHeight + this.gap);

      this.ctx.fillRect(
        x + this.gap,
        y + this.gap,
        this.cardWidth,
        this.cardHeight
      );

      const fruit = fruits[card.type];
      if (!fruit) continue;
      if (card.status !== "hidden") {
        this.ctx.drawImage(
          this.sprite,
          fruit.x,
          fruit.y,
          fruit.width,
          fruit.height,
          x + this.gap,
          y + this.gap + (this.cardHeight - this.cardWidth) / 2,
          this.cardWidth,
          this.cardWidth
        );
      } else {
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(
          x + this.gap * 2,
          y + this.gap * 2,
          this.cardWidth - this.gap * 2,
          this.cardHeight - this.gap * 2
        );
      }
    }

    const canvas = document.querySelector("canvas");
    if (!canvas) {
      document.querySelector("#app").replaceChildren(this.canvas);
    } else {
      canvas.replaceWith(this.canvas);
    }
  }

  renderStatus() {
    let status = document.getElementById("status");
    if (!status) {
      status = document.createElement("div");
      status.id = "status";

      const app = document.getElementById("app");
      app.appendChild(status);
    }

    if (this.winner) {
      const winText = document.createTextNode(
        `${this.name} wins! Score: ${this.score}`
      );
      const restartButton = document.createElement("button");
      restartButton.id = "restart";
      restartButton.textContent = "Play Again";
      restartButton.onclick = () => this.newGame();
      status.replaceChildren(winText);
      status.appendChild(restartButton);
    } else {
      const scoreText = document.createTextNode(`${this.name}: ${this.score}`);
      status.replaceChildren(scoreText);
    }
  }

  addPoint() {
    this.score++;
    this.renderStatus();
  }

  checkForWinner() {
    if (this.cards.every((c) => c.status === "matched")) {
      this.winner = true;
    }
  }

  handleCardClick(e) {
    if (this.selectedCards.length === 2) return;

    const cx = e.clientX;
    const cy = e.clientY;

    const colWidth = this.cardWidth + this.gap;
    const rowHeight = this.cardHeight + this.gap;
    const gridLeft = this.gap;
    const gridTop = this.gap;

    const col = Math.floor((cx - gridLeft) / colWidth);
    const row = Math.floor((cy - gridTop) / rowHeight);

    if (col < 0 || row < 0) return;

    const xIn = cx - gridLeft - col * colWidth;
    const yIn = cy - gridTop - row * rowHeight;

    if (xIn < 0 || yIn < 0) return;
    if (xIn > this.cardWidth || yIn > this.cardHeight) return;

    const index = row * this.cols + col;
    if (index < 0 || index >= this.cards.length) return;

    if (this.cards[index].status !== "hidden") return;

    this.selectedCards.push(index);
    this.cards[index].status = "visible";

    if (this.selectedCards.length === 2) {
      const [first, second] = this.selectedCards;
      if (this.cards[first].type === this.cards[second].type) {
        this.cards[first].status = "matched";
        this.cards[second].status = "matched";
        this.selectedCards = [];
        this.renderCards();
        this.addPoint();
        this.checkForWinner();
        this.renderStatus();
        return;
      } else {
        setTimeout(() => {
          this.cards[first].status = "hidden";
          this.cards[second].status = "hidden";
          this.selectedCards = [];
          this.renderCards();
        }, 750);
      }
    }
    this.renderCards();
  }
}
