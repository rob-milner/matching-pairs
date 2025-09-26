import { TitleScreen } from "./TitleScreen";
import { Cards } from "./Cards";

export class GameState {
  constructor() {
    this.state = "";
    this.name = "";
    this.numberOfPlayers = 1;
  }

  handleNameChanged(name) {
    this.name = name;
  }

  handleStartGame(numberOfPlayers) {
    this.updateState("playing");
    this.numberOfPlayers = numberOfPlayers;
  }

  async updateState(state) {
    this.state = state;

    switch (state) {
      case "titleScreen": {
        const titleScreen = new TitleScreen({
          onNameChanged: (name) => this.handleNameChanged(name),
          onStartGame: () => this.handleStartGame(),
        });
        titleScreen.render();
        break;
      }
      case "playing": {
        const game = new Cards({
          name: this.name,
        });
        if (this.numberOfPlayers === 2) {
          game.newMultiplayerGame();
        } else {
          game.newGame();
        }
        break;
      }
    }
  }
}
