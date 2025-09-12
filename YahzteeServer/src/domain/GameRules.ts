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
} from "../utils/Scoring";

export interface ScoreCalculation {
  score: number;
  isValid: boolean;
  description: string;
}

export class GameRules {
  private static readonly SCORING_RULES: Scoring[] = [
    new NumberScoring(1), // Ones
    new NumberScoring(2), // Twos
    new NumberScoring(3), // Threes
    new NumberScoring(4), // Fours
    new NumberScoring(5), // Fives
    new NumberScoring(6), // Sixes
    new ThreeOfKind(), // Three of a Kind
    new FourOfKind(), // Four of a Kind
    new FullHouse(), // Full House
    new SmallStraight(), // Small Straight
    new LargeStraight(), // Large Straight
    new Yahtzee(), // Yahtzee
    new Chance(), // Chance
  ];

  private static readonly SCORE_NAMES = [
    "Ones",
    "Twos",
    "Threes",
    "Fours",
    "Fives",
    "Sixes",
    "Three of a Kind",
    "Four of a Kind",
    "Full House",
    "Small Straight",
    "Large Straight",
    "Yahtzee",
    "Chance",
  ];

  /**
   * Calculate score for a specific category
   */
  static calculateScore(
    diceValues: number[],
    categoryIndex: number
  ): ScoreCalculation {
    if (categoryIndex < 0 || categoryIndex >= this.SCORING_RULES.length) {
      return {
        score: 0,
        isValid: false,
        description: "Invalid category",
      };
    }

    if (diceValues.length !== 5) {
      return {
        score: 0,
        isValid: false,
        description: "Must have exactly 5 dice",
      };
    }

    // Validate dice values
    for (const value of diceValues) {
      if (value < 1 || value > 6) {
        return {
          score: 0,
          isValid: false,
          description: "Invalid dice value",
        };
      }
    }

    const score = this.SCORING_RULES[categoryIndex].getScores([...diceValues]);
    const description = this.SCORING_RULES[categoryIndex].constructor.name;

    return {
      score,
      isValid: true,
      description: this.SCORE_NAMES[categoryIndex],
    };
  }

  /**
   * Calculate all possible scores for given dice
   */
  static calculateAllScores(diceValues: number[]): ScoreCalculation[] {
    return this.SCORING_RULES.map((_, index) =>
      this.calculateScore(diceValues, index)
    );
  }

  /**
   * Get the name of a scoring category
   */
  static getCategoryName(categoryIndex: number): string {
    if (categoryIndex < 0 || categoryIndex >= this.SCORE_NAMES.length) {
      return "Unknown";
    }
    return this.SCORE_NAMES[categoryIndex];
  }

  /**
   * Get total number of scoring categories
   */
  static getCategoryCount(): number {
    return this.SCORING_RULES.length;
  }

  /**
   * Validate if a game is complete
   */
  static isGameComplete(selectedScores: { state: string }[]): boolean {
    return selectedScores.every((score) => score.state === "SELECTED");
  }

  /**
   * Calculate bonus for upper section (1-6)
   */
  static calculateUpperSectionBonus(
    selectedScores: { score: number; state: string }[]
  ): number {
    const upperSection = selectedScores.slice(0, 6);
    const upperTotal = upperSection
      .filter((score) => score.state === "SELECTED")
      .reduce((total, score) => total + score.score, 0);

    return upperTotal >= 63 ? 35 : 0;
  }

  /**
   * Calculate final score including bonus
   */
  static calculateFinalScore(
    selectedScores: { score: number; state: string }[]
  ): number {
    const totalScore = selectedScores
      .filter((score) => score.state === "SELECTED")
      .reduce((total, score) => total + score.score, 0);

    const bonus = this.calculateUpperSectionBonus(selectedScores);

    return totalScore + bonus;
  }

  /**
   * Get scoring rules for a specific category
   */
  static getScoringRule(categoryIndex: number): Scoring | null {
    if (categoryIndex < 0 || categoryIndex >= this.SCORING_RULES.length) {
      return null;
    }
    return this.SCORING_RULES[categoryIndex];
  }
}
