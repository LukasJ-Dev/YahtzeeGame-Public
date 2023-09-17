import { Dice } from "../types";

export function getRandomNumbers() {
  const randomNumbers = [];
  for (let i = 0; i < 5; i++) {
    randomNumbers.push(Math.floor(Math.random() * 6) + 1);
  }
  return randomNumbers;
}

export const getRandomDices = (): Dice[] => {
  const randomDices = [];
  for (let i = 0; i < 5; i++) {
    randomDices.push({
      value: Math.floor(Math.random() * 6) + 1,
      locked: false,
    });
  }
  return randomDices;
};
