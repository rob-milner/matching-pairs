import { initCards, shuffleCards, drawCards, cards } from "./cards";

export let gameState = "loading";

let score = 0;

const status = document.querySelector("#status");

export const updateGameState = (state) => {
  gameState = state;
  switch (gameState) {
    case "loading":
      drawLoadingScreen();
      break;
    case "titleScreen":
      drawTitleScreen();
      break;
    case "playing":
      newGame();
      break;
  }
};

const loading = document.querySelector("#loading");
const titleScreen = document.querySelector("#title-screen");
const game = document.querySelector("#game");
let name = "";

const drawLoadingScreen = () => {
  loading.style.display = "block";
};

const drawTitleScreen = () => {
  loading.style.display = "none";
  titleScreen.style.display = "block";

  document.querySelector("#start").addEventListener("click", () => {
    name = document.querySelector("#name").value;
    updateGameState("playing");
  });
};

const newGame = () => {
  titleScreen.style.display = "none";

  score = 0;
  shuffleCards();
  drawCards();
  updateStatus();

  game.style.display = "flex";
};

export const updateStatus = () => {
  if (cards.every((card) => card.status === "matched")) {
    status.innerHTML = `<div>${name} wins! Score: ${score}</div><button id="restart">Play again</button>`;
    document.querySelector("#restart").addEventListener("click", newGame);
  } else {
    status.appendChild(
      document.createElement("div", { textContent: `${name}: ${score}` })
    );
    document.querySelector("#status").innerHTML = `${name}: ${score}`;
  }
};

export const initGame = () => {
  updateGameState("loading");
  initCards();
};

export const updateScore = () => {
  score++;
};
