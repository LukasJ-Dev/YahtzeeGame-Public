export interface Scoring {
  getScores: (dices: number[]) => number;
}

export class NumberScoring implements Scoring {
  private number: number;
  constructor(number: number) {
    this.number = number;
  }
  getScores(dices: number[]): number {
    let scores = 0;
    for (let i = 0; i < dices.length; i++) {
      if (dices[i] == this.number) {
        scores += this.number;
      }
    }
    return scores;
  }
}

export class ThreeOfKind implements Scoring {
  getScores(dices: number[]): number {
    const first = 0;
    const middle = 2;
    const last = 4;

    dices.sort();

    let scores = 0;

    let t = 0;

    if (dices[middle] == dices[middle - 1]) {
      t += 1;
    } else if (dices[middle] == dices[last]) {
      t += 1;
    }
    if (dices[middle] == dices[middle + 1]) {
      t += 1;
    } else if (dices[middle] == dices[first]) {
      t += 1;
    }

    if (t >= 2) {
      for (let i = 0; i < dices.length; i++) {
        scores += dices[i];
      }
    }

    return scores;
  }
}

export class FourOfKind implements Scoring {
  getScores(dices: number[]): number {
    const first = 0;
    const middle = 2;
    const last = 4;
    dices.sort();

    let scores = 0;

    if (dices[middle - 1] == dices[middle + 1]) {
      if (dices[middle] == dices[first] || dices[middle] == dices[last]) {
        for (let i = 0; i < dices.length; i++) {
          scores += dices[i];
        }
      }
    }

    return scores;
  }
}

export class FullHouse implements Scoring {
  getScores(dices: number[]): number {
    const first = 0;
    const middle = 2;
    const last = 4;
    dices.sort();
    if (dices[last] == dices[middle + 1] && dices[first] == dices[middle - 1]) {
      if (dices[middle] == dices[first] || dices[middle] == dices[last]) {
        return 50;
      }
    }
    return 0;
  }
}

export class SmallStraight implements Scoring {
  getScores(dices: number[]): number {
    dices.sort();

    const fDices = dices.filter((dice, index) => dice !== dices[index - 1]);

    if (fDices.length < 4) return 0;

    for (let i = 1; i < fDices.length; i++) {
      if (fDices[i - 1] + 1 != fDices[i]) {
        return 0;
      }
    }

    return 30;
  }
}

export class LargeStraight implements Scoring {
  getScores(dices: number[]): number {
    dices.sort();

    for (let i = 1; i < dices.length; i++) {
      if (dices[i - 1] + 1 != dices[i]) {
        return 0;
      }
    }

    return 40;
  }
}

export class Yahtzee implements Scoring {
  getScores(dices: number[]): number {
    const first = 0;
    //const middle = 2;
    const last = 4;
    dices.sort();
    if (dices[first] == dices[last]) {
      return 50;
    }
    return 0;
  }
}

export class Chance implements Scoring {
  getScores(dices: number[]): number {
    let scores = 0;

    for (let i = 0; i < dices.length; i++) {
      scores += dices[i];
    }
    return scores;
  }
}
