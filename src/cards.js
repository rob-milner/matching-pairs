import { updateGameState, updateStatus, updateScore } from "./gamestate";

const fruits = {
  apple: {
    x: 155,
    y: 90,
    width: 200,
    height: 200,
  },
  banana: {
    x: 405,
    y: 90,
    width: 200,
    height: 200,
  },
  cherry: {
    x: 690,
    y: 90,
    width: 200,
    height: 200,
  },
  orange: {
    x: 945,
    y: 90,
    width: 200,
    height: 200,
  },
  watermelon: {
    x: 1190,
    y: 70,
    width: 230,
    height: 230,
  },
  strawberry: {
    x: 155,
    y: 380,
    width: 200,
    height: 200,
  },
  grape: {
    x: 405,
    y: 380,
    width: 200,
    height: 200,
  },
  kiwi: {
    x: 685,
    y: 380,
    width: 200,
    height: 200,
  },
};

const cardTypes = [
  "apple",
  "banana",
  "cherry",
  "orange",
  "watermelon",
  "strawberry",
  "grape",
  "kiwi",
];

export let cards = [];
let selectedCards = [];

let cardWidth = 0;
let cardHeight = 0;
let gap = 0;
let cols = 0;

const sprite = new Image();

const canvas = document.createElement("canvas");
canvas.id = "canvas";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.9;
document.querySelector("#game").appendChild(canvas);
canvas.addEventListener("click", (e) => {
  handleClick(e);
});
const ctx = canvas.getContext("2d");

export const initCards = () => {
  cardWidth = Math.floor(canvas.width / 5);
  cardHeight = cardWidth * 1.5;
  gap = cardWidth / 5;
  cols = 4;

  sprite.src = "./fruit.png";
  sprite.onload = () => {
    updateGameState("titleScreen");
  };
};

export const shuffleCards = () => {
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
  return (cards = deck);
};

export const drawCards = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    switch (card.status) {
      case "hidden":
        ctx.fillStyle = "white";
        break;
      case "visible":
        ctx.fillStyle = "orange";
        break;
      case "matched":
        ctx.fillStyle = "green";
        break;
    }
    const x = (i % cols) * (cardWidth + gap);
    const y = Math.floor(i / cols) * (cardHeight + gap);

    ctx.fillRect(x + gap, y + gap, cardWidth, cardHeight);
    const fruit = fruits[card.type];
    if (!fruit) continue;
    if (card.status !== "hidden") {
      ctx.drawImage(
        sprite,
        fruit.x,
        fruit.y,
        fruit.width,
        fruit.height,
        x + gap,
        y + gap + (cardHeight - cardWidth) / 2,
        cardWidth,
        cardWidth
      );
    }
  }
};

export const handleClick = (e) => {
  if (selectedCards.length === 2) return;

  const cx = e.clientX;
  const cy = e.clientY;

  const colWidth = cardWidth + gap;
  const rowHeight = cardHeight + gap;
  const gridLeft = gap;
  const gridTop = gap;

  const col = Math.floor((cx - gridLeft) / colWidth);
  const row = Math.floor((cy - gridTop) / rowHeight);

  if (col < 0 || row < 0) return;

  const xIn = cx - gridLeft - col * colWidth;
  const yIn = cy - gridTop - row * rowHeight;

  if (xIn < 0 || yIn < 0) return;
  if (xIn > cardWidth || yIn > cardHeight) return;

  const index = row * cols + col;
  if (index < 0 || index >= cards.length) return;

  if (cards[index].status !== "hidden") return;

  selectedCards.push(index);
  cards[index].status = "visible";

  if (selectedCards.length === 2) {
    const [first, second] = selectedCards;
    if (cards[first].type === cards[second].type) {
      cards[first].status = "matched";
      cards[second].status = "matched";
      selectedCards = [];
      drawCards();
      updateScore();
      updateStatus();
      return;
    } else {
      setTimeout(() => {
        cards[first].status = "hidden";
        cards[second].status = "hidden";
        selectedCards = [];
        drawCards();
      }, 750);
    }
  }
  drawCards();
};
