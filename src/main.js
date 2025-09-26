import "./style.css";
import { GameState } from "./GameState";

class Game {
  constructor() {
    this.gameState = new GameState();
  }

  init() {
    this.gameState.updateState("titleScreen");
  }
}

const game = new Game();
game.init();
