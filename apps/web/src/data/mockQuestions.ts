// DEMO CLASS — SIMULATED DATA
// Central Diagnostic Question Bank
// 100% Deterministic — Zero Math.random()

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  misconceptionTriggered?: string; // code from MISCONCEPTIONS
  explanation: string;
}

export interface MockQuestion {
  id: string;
  kcCode: string;
  domain: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prompt: string;
  options: QuestionOption[];
  bloomLevel: "Recall" | "Application" | "Analysis";
}

export const MOCK_QUESTIONS: MockQuestion[] = [
  // --- Fractions: Comparing Fractions (KC-FRAC-03) ---
  {
    id: "q-frac-01",
    kcCode: "KC-FRAC-03",
    domain: "Fractions",
    difficulty: "Medium",
    prompt: "Which statement is true when comparing 5/12 and 3/4?",
    options: [
      {
        id: "opt-1",
        text: "5/12 is greater than 3/4 because 5 > 3",
        isCorrect: false,
        misconceptionTriggered: "MISC-FRAC-04",
        explanation: "Error: Compared numerators only without converting to common denominator 12 (3/4 = 9/12).",
      },
      {
        id: "opt-2",
        text: "3/4 is greater than 5/12 because 3/4 = 9/12 and 9/12 > 5/12",
        isCorrect: true,
        explanation: "Correct! With a common denominator of 12, 3/4 converts to 9/12, which is greater than 5/12.",
      },
      {
        id: "opt-3",
        text: "5/12 and 3/4 are equal because 5 + 7 = 12 and 3 + 1 = 4",
        isCorrect: false,
        misconceptionTriggered: "MISC-FRAC-03",
        explanation: "Error: Additive relationship assumed between numerator and denominator.",
      },
      {
        id: "opt-4",
        text: "5/12 is greater because 12 is greater than 4",
        isCorrect: false,
        explanation: "Error: Comparing denominator magnitudes in reverse without considering share sizes.",
      },
    ],
    bloomLevel: "Analysis",
  },

  // --- Fractions: Equivalent Fractions (KC-FRAC-02) ---
  {
    id: "q-frac-02",
    kcCode: "KC-FRAC-02",
    domain: "Fractions",
    difficulty: "Easy",
    prompt: "Which fraction is equivalent to 2/3?",
    options: [
      {
        id: "opt-1",
        text: "4/5",
        isCorrect: false,
        misconceptionTriggered: "MISC-FRAC-03",
        explanation: "Error: Added 2 to both numerator and denominator instead of multiplying by a common factor.",
      },
      {
        id: "opt-2",
        text: "6/9",
        isCorrect: true,
        explanation: "Correct! Multiplying both numerator and denominator by 3 yields 6/9.",
      },
      {
        id: "opt-3",
        text: "3/4",
        isCorrect: false,
        misconceptionTriggered: "MISC-FRAC-03",
        explanation: "Error: Added 1 to both top and bottom.",
      },
      {
        id: "opt-4",
        text: "4/9",
        isCorrect: false,
        explanation: "Error: Multiplied numerator by 2 and denominator by 3 unequally.",
      },
    ],
    bloomLevel: "Application",
  },

  // --- Fractions: Fraction Operations (KC-FRAC-04) ---
  {
    id: "q-frac-03",
    kcCode: "KC-FRAC-04",
    domain: "Fractions",
    difficulty: "Medium",
    prompt: "Calculate: 1/4 + 2/4 = ?",
    options: [
      {
        id: "opt-1",
        text: "3/8",
        isCorrect: false,
        misconceptionTriggered: "MISC-FRAC-05",
        explanation: "Error: Added denominators directly (4 + 4 = 8) instead of preserving the common unit denominator.",
      },
      {
        id: "opt-2",
        text: "3/4",
        isCorrect: true,
        explanation: "Correct! When denominators are equal, add numerators (1 + 2 = 3) over the same denominator (4).",
      },
      {
        id: "opt-3",
        text: "2/16",
        isCorrect: false,
        explanation: "Error: Multiplied numbers instead of adding.",
      },
      {
        id: "opt-4",
        text: "2/4",
        isCorrect: false,
        explanation: "Error: Subtracted or ignored the first term.",
      },
    ],
    bloomLevel: "Application",
  },

  // --- Decimals: Decimal Comparison (KC-DEC-02) ---
  {
    id: "q-dec-01",
    kcCode: "KC-DEC-02",
    domain: "Decimals",
    difficulty: "Medium",
    prompt: "Which number is strictly greater: 0.7 or 0.25?",
    options: [
      {
        id: "opt-1",
        text: "0.25 is greater because 25 is greater than 7",
        isCorrect: false,
        misconceptionTriggered: "MISC-DEC-02",
        explanation: "Error: Treated digits after the decimal point as whole integers without place-value weighting.",
      },
      {
        id: "opt-2",
        text: "0.7 is greater because 0.7 = 0.70 and 70 hundredths > 25 hundredths",
        isCorrect: true,
        explanation: "Correct! Comparing place values, 7 tenths (0.70) exceeds 2 tenths (0.25).",
      },
      {
        id: "opt-3",
        text: "They are equal because 0.7 has 7 and 0.25 has 2+5=7",
        isCorrect: false,
        explanation: "Error: Added digits arbitrarily across different place-value positions.",
      },
      {
        id: "opt-4",
        text: "Cannot be determined without a common base denominator",
        isCorrect: false,
        explanation: "Error: Decimals are base-10 representations and can always be directly compared.",
      },
    ],
    bloomLevel: "Analysis",
  },

  // --- Decimals: Place Value (KC-DEC-01) ---
  {
    id: "q-dec-02",
    kcCode: "KC-DEC-01",
    domain: "Decimals",
    difficulty: "Easy",
    prompt: "In the number 4.05, what is the value of the digit 5?",
    options: [
      {
        id: "opt-1",
        text: "5 tenths (5/10)",
        isCorrect: false,
        misconceptionTriggered: "MISC-DEC-01",
        explanation: "Error: Ignored the zero placeholder in the tenths position.",
      },
      {
        id: "opt-2",
        text: "5 hundredths (5/100)",
        isCorrect: true,
        explanation: "Correct! The digit 5 sits in the second decimal position (hundredths).",
      },
      {
        id: "opt-3",
        text: "5 tens (50)",
        isCorrect: false,
        explanation: "Error: Confused decimal positions with whole integer place values.",
      },
      {
        id: "opt-4",
        text: "5 ones",
        isCorrect: false,
        explanation: "Error: Ones position is occupied by 4.",
      },
    ],
    bloomLevel: "Recall",
  },

  // --- Ratios: Proportions & Scaling (KC-RAT-02) ---
  {
    id: "q-rat-01",
    kcCode: "KC-RAT-02",
    domain: "Ratios",
    difficulty: "Medium",
    prompt: "If 2 pens cost ₹6, how much do 4 pens cost at the same rate?",
    options: [
      {
        id: "opt-1",
        text: "₹8",
        isCorrect: false,
        misconceptionTriggered: "MISC-RAT-02",
        explanation: "Error: Applied additive difference (+2 to pens, so added +2 to price: ₹6 + 2 = ₹8).",
      },
      {
        id: "opt-2",
        text: "₹12",
        isCorrect: true,
        explanation: "Correct! The scaling factor is ×2 (4 = 2 × 2), so total cost is ₹6 × 2 = ₹12.",
      },
      {
        id: "opt-3",
        text: "₹10",
        isCorrect: false,
        explanation: "Error: Computational miscalculation.",
      },
      {
        id: "opt-4",
        text: "₹18",
        isCorrect: false,
        explanation: "Error: Multiplied by 3 instead of 2.",
      },
    ],
    bloomLevel: "Application",
  },

  // --- Algebra: Simple Equations (KC-ALG-03) ---
  {
    id: "q-alg-01",
    kcCode: "KC-ALG-03",
    domain: "Algebra",
    difficulty: "Medium",
    prompt: "Solve for x: x + 7 = 15",
    options: [
      {
        id: "opt-1",
        text: "x = 22",
        isCorrect: false,
        misconceptionTriggered: "MISC-ALG-03",
        explanation: "Error: Moved +7 across the equals sign without inverting to subtraction (15 + 7 = 22).",
      },
      {
        id: "opt-2",
        text: "x = 8",
        isCorrect: true,
        explanation: "Correct! Subtract 7 from both sides: x = 15 - 7 = 8.",
      },
      {
        id: "opt-3",
        text: "x = 105",
        isCorrect: false,
        explanation: "Error: Multiplied 15 by 7.",
      },
      {
        id: "opt-4",
        text: "x = -8",
        isCorrect: false,
        explanation: "Error: Sign inverted incorrectly on the constant side.",
      },
    ],
    bloomLevel: "Application",
  },

  // --- Computer Science: Array Indexing & Bounds (KC-002) ---
  {
    id: "q-cs-01",
    kcCode: "KC-002",
    domain: "Computer Science",
    difficulty: "Easy",
    prompt: "Given arr = [10, 20, 30], what is arr[1]?",
    options: [
      {
        id: "opt-1",
        text: "10",
        isCorrect: false,
        misconceptionTriggered: "MISC-CS-02",
        explanation: "Error: 1-based indexing assumed. In 0-indexed systems, arr[0] is 10, not arr[1].",
      },
      {
        id: "opt-2",
        text: "20",
        isCorrect: true,
        explanation: "Correct! In zero-indexed arrays: arr[0]=10, arr[1]=20, arr[2]=30.",
      },
      {
        id: "opt-3",
        text: "30",
        isCorrect: false,
        explanation: "Error: arr[2] is 30.",
      },
      {
        id: "opt-4",
        text: "undefined",
        isCorrect: false,
        explanation: "Error: arr[1] exists and stores 20.",
      },
    ],
    bloomLevel: "Recall",
  },

  // --- Computer Science: Loop Traversal (KC-003) ---
  {
    id: "q-cs-02",
    kcCode: "KC-003",
    domain: "Computer Science",
    difficulty: "Medium",
    prompt: "To iterate through an array of length N without off-by-one errors, which loop header is correct?",
    options: [
      {
        id: "opt-1",
        text: "for (let i = 0; i <= arr.length; i++)",
        isCorrect: false,
        misconceptionTriggered: "MISC-CS-03",
        explanation: "Error: Using '<=' reaches index arr.length, which is out of bounds and returns undefined.",
      },
      {
        id: "opt-2",
        text: "for (let i = 0; i < arr.length; i++)",
        isCorrect: true,
        explanation: "Correct! Loop runs from index 0 through index length - 1.",
      },
      {
        id: "opt-3",
        text: "for (let i = 1; i <= arr.length; i++)",
        isCorrect: false,
        misconceptionTriggered: "MISC-CS-02",
        explanation: "Error: Skips index 0 and overruns the final valid index.",
      },
      {
        id: "opt-4",
        text: "for (let i = 0; i < arr.length - 1; i++)",
        isCorrect: false,
        explanation: "Error: Skips the last element at index length - 1.",
      },
    ],
    bloomLevel: "Application",
  },
];
