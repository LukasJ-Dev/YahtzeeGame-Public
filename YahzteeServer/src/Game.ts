import { Lobby, Player, Dice, Score } from "./types";
import {
  Chance,
  FourOfKind,
  FullHouse,
  LargeStraight,
  NumberScoring,
  Scoring,
  SmallStraight,
  ThreeOfKind,
  Yahtzee,
} from "./utils/Scoring";
import { getRandomNumbers } from "./utils/random";

const scoringRulesTable = [
  new NumberScoring(1),
  new NumberScoring(2),
  new NumberScoring(3),
  new NumberScoring(4),
  new NumberScoring(5),
  new NumberScoring(6),
  new ThreeOfKind(),
  new FourOfKind(),
  new FullHouse(),
  new SmallStraight(),
  new LargeStraight(),
  new Yahtzee(),
  new Chance(),
];

export class Game {
  private gameCode: string;
  private gameStarted: boolean;
  private lobbyPlayers?: Player[];
  private players?: Player[];
  private playerTurn: number = 0;
  private diceRolled: number = 0;

  constructor(players: Player[], gameCode: string) {
    this.lobbyPlayers = players;
    this.gameCode = gameCode;
    this.gameStarted = false;
  }

  hasGameStarted(): boolean {
    return this.gameStarted;
  }

  getPlayers(): Player[] {
    if (this.gameStarted && this.players) return this.players;
    return this.lobbyPlayers || [];
  }

  rollDice(): Dice[] {
    if (!this.gameStarted || !this.players) return [];

    if (this.diceRolled >= 3) return [];

    const newDice = this.players[this.playerTurn].dices?.map((dice, i) => {
      if (dice.locked) return dice;
      return { value: Math.floor(Math.random() * 6) + 1, locked: false };
    });

    if (!newDice) return [];

    this.players[this.playerTurn].dices = newDice;
    this.diceRolled++;
    return newDice;
  }

  lockDice(index: number) {
    if (
      !this.gameStarted ||
      !this.players ||
      this.playerTurn === undefined ||
      this.diceRolled === 0
    )
      return [];
    if (!this.players[this.playerTurn].dices![index]) return [];

    this.players[this.playerTurn].dices![index].locked =
      !this.players[this.playerTurn].dices![index].locked;

    const newDice = this.players[this.playerTurn].dices;

    if (!newDice) return [];

    this.players[this.playerTurn].dices = newDice;
    return newDice;
  }

  selectScore(rowIndex: number): Score[] {
    if (!this.gameStarted || !this.players || this.playerTurn === undefined)
      return [];

    if (rowIndex > 13) return [];

    const dices = this.players[this.playerTurn].dices;
    if (!dices) return [];
    const diceValues = dices.map((dices) => dices.value);
    const calculatedScore = scoringRulesTable[rowIndex].getScores(diceValues);

    this.players[this.playerTurn].scores = this.players[
      this.playerTurn
    ].scores?.map((score, index) => {
      if (index === rowIndex)
        return {
          score: calculatedScore,
          state: "SELECTED",
        };
      if (score.state === "SELECTED") return score;
      return {
        score: 0,
        state: "DEFAULT",
      };
    });
    const newScore = this.players[this.playerTurn].scores;
    if (!newScore) return [];
    this.prepareNext();
    return newScore;
  }

  private prepareNext(): boolean {
    if (!this.gameStarted || !this.players || this.playerTurn === undefined)
      return false;
    this.players[this.playerTurn].dices = this.players[
      this.playerTurn
    ].dices?.map((dice) => ({ value: dice.value, locked: false }));
    this.diceRolled = 0;
    this.playerTurn++;
    if (this.playerTurn >= this.players.length) this.playerTurn = 0;
    if (this.players[this.playerTurn].disconnected) {
      return this.prepareNext();
    }
    return true;
  }

  skip(): boolean {
    if (!this.gameStarted || !this.players || this.playerTurn === undefined)
      return false;
    if (this.diceRolled === 0) return false;
    return this.prepareNext();
  }

  getPlayerTurn(): number | undefined {
    return this.playerTurn;
  }

  getPlayerByName(name: string): Player | undefined {
    if (!this.players) return;
    return this.players?.find((player) => player.name === name);
  }

  disconnectPlayerInGame(leavingPlayer: Player) {
    if (!this.gameStarted || !this.players) return;
    this.players = this.players?.map((player) => {
      if (player.name === leavingPlayer.name) {
        return { ...player, disconnected: true };
      }
      return player;
    });
  }

  addPlayer(player: Player) {
    if (this.gameStarted) return;

    this.lobbyPlayers?.push(player);
  }

  removePlayer(deletePlayer: Player) {
    if (this.gameStarted) {
      this.players = this.players?.filter(
        (player) => player.name !== deletePlayer.name
      );
      return this.players?.length;
    } else {
      this.lobbyPlayers = this.lobbyPlayers?.filter(
        (player) => player.name !== deletePlayer.name
      );
      if (this.lobbyPlayers?.length === 0 || !this.lobbyPlayers) return 0;
      if (deletePlayer.isHost) {
        this.lobbyPlayers[0].isHost = true;
      }
      return this.lobbyPlayers.length;
    }
  }

  startGame() {
    this.players = this.lobbyPlayers?.map((player, i) => ({
      id: i,
      name: player.name,
      color: player.color,
      dices: [
        { value: 1, locked: false },
        { value: 2, locked: false },
        { value: 3, locked: false },
        { value: 4, locked: false },
        { value: 5, locked: false },
      ],
      scores: Array(13).fill({ score: 0, state: "DEFAULT" }),
      disconnected: false,
    }));
    this.gameStarted = true;
    this.playerTurn = 0;
    this.diceRolled = 0;
  }

  getGame(): Lobby {
    return {
      gameCode: this.gameCode,
      players: (this.gameStarted ? this.players : this.lobbyPlayers) || [],
    };
  }
}
