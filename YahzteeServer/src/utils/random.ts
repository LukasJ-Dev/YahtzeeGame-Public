import { Player } from "../types";

export const getColorsFromPlayers = (players: Player[]): string[] => {
  return players.map((player) => player.color);
};

export const randomColor = (usedColors: string[] = []): string => {
  let colors = [
    "#1976d2", //BLUE
    "#e53935", //RED
    "#8e24aa", //PURPLE
    "#311b92", //DEEP PURPLE
    "#1a237e", //INDIGO
    "#0097a7", //CYAN
    "#43a047", //GREEN
    "#f9a825", //ORANGE
    "#cddc39", //LIME
  ];
  if (usedColors.length > 8) {
    for (let i = 0; i < usedColors.length; i++) {
      colors = colors.filter((color) => color !== usedColors[i]);
    }
  }

  return colors[Math.floor(Math.random() * colors.length)];
};

export const GenerateRandomGameCode = (): string => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    code += letters.charAt(randomIndex);
  }

  return code;
};

export function getRandomNumbers() {
  const randomNumbers = [];
  for (let i = 0; i < 5; i++) {
    randomNumbers.push(Math.floor(Math.random() * 6) + 1);
  }
  return randomNumbers;
}
