import { Loading } from "./Loading";
import { TitleScreen } from "./TitleScreen";
import { Game } from "./Game";

export class GameState {
  constructor() {
    this.state = "";
    this.sprite = null;
    this.name = "";
  }

  handleNameChanged(name) {
    this.name = name;
  }

  handleStartGame() {
    this.updateState("playing");
  }

  async updateState(state) {
    this.state = state;

    switch (state) {
      case "loading": {
        const loading = new Loading();
        loading.render();
        this.sprite = await loading.init();
        this.updateState("titleScreen");
        break;
      }
      case "titleScreen": {
        const titleScreen = new TitleScreen({
          onNameChanged: (name) => this.handleNameChanged(name),
          onStartGame: () => this.handleStartGame(),
        });
        titleScreen.render();
        break;
      }
      case "playing": {
        const game = new Game({ name: this.name, sprite: this.sprite });
        game.newGame();
        break;
      }
    }
  }
}
