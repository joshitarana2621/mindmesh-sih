// DEMO CLASS — SIMULATED DATA
// Central Knowledge Components (KCs) & Misconceptions Catalog
// 100% Deterministic — Zero Math.random()

export interface MisconceptionDef {
  id: string;
  code: string;
  kcCode: string;
  title: string;
  description: string;
  diagnosticClue: string;
  remediationStrategy: string;
}

export interface KnowledgeComponentDef {
  code: string;
  domain: "Fractions" | "Decimals" | "Ratios" | "Algebra" | "Computer Science";
  title: string;
  description: string;
  gradeLevel: string;
  benchmarkScore: number; // typically 0.80 (80%)
  commonMisconceptions: string[]; // references MisconceptionDef codes
}

export const KNOWLEDGE_COMPONENTS: Record<string, KnowledgeComponentDef> = {
  // --- Fractions ---
  "KC-FRAC-01": {
    code: "KC-FRAC-01",
    domain: "Fractions",
    title: "Numerator vs Denominator",
    description: "Understanding parts of a whole: numerator specifies counted parts, denominator specifies partition size.",
    gradeLevel: "Grade 6-8",
    benchmarkScore: 0.80,
    commonMisconceptions: ["MISC-FRAC-01", "MISC-FRAC-02"],
  },
  "KC-FRAC-02": {
    code: "KC-FRAC-02",
    domain: "Fractions",
    title: "Equivalent Fractions",
    description: "Multiplying or dividing numerator and denominator by the same non-zero number produces equal value.",
    gradeLevel: "Grade 6-8",
    benchmarkScore: 0.80,
    commonMisconceptions: ["MISC-FRAC-03"],
  },
  "KC-FRAC-03": {
    code: "KC-FRAC-03",
    domain: "Fractions",
    title: "Comparing Fractions",
    description: "Comparing fractions with like and unlike denominators using common denominators or benchmark fractions.",
    gradeLevel: "Grade 6-8",
    benchmarkScore: 0.80,
    commonMisconceptions: ["MISC-FRAC-04"],
  },
  "KC-FRAC-04": {
    code: "KC-FRAC-04",
    domain: "Fractions",
    title: "Fraction Operations",
    description: "Addition and subtraction with common denominators; multiplication as scaling parts of parts.",
    gradeLevel: "Grade 6-8",
    benchmarkScore: 0.80,
    commonMisconceptions: ["MISC-FRAC-05"],
  },

  // --- Decimals ---
  "KC-DEC-01": {
    code: "KC-DEC-01",
    domain: "Decimals",
    title: "Decimal Place Value",
    description: "Understanding tenths, hundredths, and thousandths to the right of the decimal point.",
    gradeLevel: "Grade 6-8",
    benchmarkScore: 0.80,
    commonMisconceptions: ["MISC-DEC-01"],
  },
  "KC-DEC-02": {
    code: "KC-DEC-02",
    domain: "Decimals",
    title: "Decimal Comparison",
    description: "Comparing decimal magnitudes regardless of number of trailing digits.",
    gradeLevel: "Grade 6-8",
    benchmarkScore: 0.80,
    commonMisconceptions: ["MISC-DEC-02"],
  },
  "KC-DEC-03": {
    code: "KC-DEC-03",
    domain: "Decimals",
    title: "Decimal Operations",
    description: "Aligning place values for addition/subtraction and placing the decimal point in multiplication.",
    gradeLevel: "Grade 6-8",
    benchmarkScore: 0.80,
    commonMisconceptions: ["MISC-DEC-03"],
  },

  // --- Ratios ---
  "KC-RAT-01": {
    code: "KC-RAT-01",
    domain: "Ratios",
    title: "Ratio Comparison",
    description: "Understanding multiplicative relationships comparing two quantities A:B.",
    gradeLevel: "Grade 7-8",
    benchmarkScore: 0.80,
    commonMisconceptions: ["MISC-RAT-01"],
  },
  "KC-RAT-02": {
    code: "KC-RAT-02",
    domain: "Ratios",
    title: "Proportions & Scaling",
    description: "Setting up and solving proportional equations using constant scaling factor.",
    gradeLevel: "Grade 7-8",
    benchmarkScore: 0.80,
    commonMisconceptions: ["MISC-RAT-02"],
  },
  "KC-RAT-03": {
    code: "KC-RAT-03",
    domain: "Ratios",
    title: "Unit Rate & Rate Problems",
    description: "Computing rate per single unit quantity (e.g., km/hr, cost per item).",
    gradeLevel: "Grade 7-8",
    benchmarkScore: 0.80,
    commonMisconceptions: ["MISC-RAT-03"],
  },

  // --- Algebra ---
  "KC-ALG-01": {
    code: "KC-ALG-01",
    domain: "Algebra",
    title: "Variables & Symbols",
    description: "Understanding letters as placeholders for unknown or varying quantities.",
    gradeLevel: "Grade 7-8",
    benchmarkScore: 0.80,
    commonMisconceptions: ["MISC-ALG-01"],
  },
  "KC-ALG-02": {
    code: "KC-ALG-02",
    domain: "Algebra",
    title: "Linear Expressions",
    description: "Combining like terms and applying the distributive property symbolically.",
    gradeLevel: "Grade 7-8",
    benchmarkScore: 0.80,
    commonMisconceptions: ["MISC-ALG-02"],
  },
  "KC-ALG-03": {
    code: "KC-ALG-03",
    domain: "Algebra",
    title: "Simple Linear Equations",
    description: "Maintaining balance and isolating the variable using inverse operations.",
    gradeLevel: "Grade 7-8",
    benchmarkScore: 0.80,
    commonMisconceptions: ["MISC-ALG-03"],
  },

  // --- Computer Science (Maintains compatibility with existing quizzes & radar) ---
  "KC-001": {
    code: "KC-001",
    domain: "Computer Science",
    title: "Array Declaration & Allocation",
    description: "Declaring sequential linear memory blocks using language syntax (e.g. let arr = []).",
    gradeLevel: "Intro CS",
    benchmarkScore: 0.80,
    commonMisconceptions: ["MISC-CS-01"],
  },
  "KC-002": {
    code: "KC-002",
    domain: "Computer Science",
    title: "Zero-Indexed Bounds & Off-by-One",
    description: "Addressing array elements from 0 to length-1 without exceeding boundaries.",
    gradeLevel: "Intro CS",
    benchmarkScore: 0.80,
    commonMisconceptions: ["MISC-CS-02"],
  },
  "KC-003": {
    code: "KC-003",
    domain: "Computer Science",
    title: "Loop Traversal & Iteration Limits",
    description: "Iterating through all elements using sequential loop condition (i < arr.length).",
    gradeLevel: "Intro CS",
    benchmarkScore: 0.80,
    commonMisconceptions: ["MISC-CS-03"],
  },
  "KC-004": {
    code: "KC-004",
    domain: "Computer Science",
    title: "Dynamic Resizing & Insertion",
    description: "Inserting elements and shifting adjacent indices without overwriting data.",
    gradeLevel: "Intro CS",
    benchmarkScore: 0.80,
    commonMisconceptions: ["MISC-CS-04"],
  },
};

export const MISCONCEPTIONS: Record<string, MisconceptionDef> = {
  // Fractions
  "MISC-FRAC-01": {
    id: "misc-01",
    code: "MISC-FRAC-01",
    kcCode: "KC-FRAC-01",
    title: "Inverts Numerator and Denominator",
    description: "Treats the denominator as counted parts and numerator as total pieces.",
    diagnosticClue: "Answers 4/3 when shaded area is 3 out of 4 equal parts.",
    remediationStrategy: "Visual whole-partitioning exercises using fraction bars.",
  },
  "MISC-FRAC-02": {
    id: "misc-02",
    code: "MISC-FRAC-02",
    kcCode: "KC-FRAC-01",
    title: "Ignores Equal Partitioning",
    description: "Counts unequal visual pieces as valid fractional units.",
    diagnosticClue: "Counts 3 shaded strips in unequally sliced pizza diagram.",
    remediationStrategy: "Area-congruency verification before counting denominator slices.",
  },
  "MISC-FRAC-03": {
    id: "misc-03",
    code: "MISC-FRAC-03",
    kcCode: "KC-FRAC-02",
    title: "Additive Scaling of Equivalent Fractions",
    description: "Adds the same number to numerator and denominator instead of multiplying (e.g. 2/3 = 3/4).",
    diagnosticClue: "Asserts 2/3 = 4/5 because +2 was added to both top and bottom.",
    remediationStrategy: "Multiplicative scaling grid showing division of existing partitions.",
  },
  "MISC-FRAC-04": {
    id: "misc-04",
    code: "MISC-FRAC-04",
    kcCode: "KC-FRAC-03",
    title: "Compares Fractions Using Numerator Only",
    description: "Assumes whichever fraction has the larger numerator is bigger, regardless of denominators.",
    diagnosticClue: "Judges 5/12 > 3/4 because 5 > 3.",
    remediationStrategy: "Double number-line visualization comparing fractions with common denominators.",
  },
  "MISC-FRAC-05": {
    id: "misc-05",
    code: "MISC-FRAC-05",
    kcCode: "KC-FRAC-04",
    title: "Direct Denominator Addition",
    description: "Adds denominators directly when adding fractions (e.g., 1/2 + 1/3 = 2/5).",
    diagnosticClue: "Computes 1/4 + 2/4 = 3/8 instead of 3/4.",
    remediationStrategy: "Physical fraction strip combining to show denominator defines unit size.",
  },

  // Decimals
  "MISC-DEC-01": {
    id: "misc-06",
    code: "MISC-DEC-01",
    kcCode: "KC-DEC-01",
    title: "Confuses Decimal Place Values",
    description: "Treats tenths and hundredths symmetrically to whole number tens and hundreds.",
    diagnosticClue: "States 0.05 is larger than 0.5 because 'tens are smaller than hundreds'.",
    remediationStrategy: "Base-10 block visualization showing 0.1 is 10 times larger than 0.01.",
  },
  "MISC-DEC-02": {
    id: "misc-07",
    code: "MISC-DEC-02",
    kcCode: "KC-DEC-02",
    title: "Longer-is-Larger Decimal Misconception",
    description: "Assumes a decimal with more digits is always larger (e.g., treats 0.25 as larger than 0.7 because 25 > 7).",
    diagnosticClue: "Answers 0.25 > 0.7 because 25 is greater than 7.",
    remediationStrategy: "Zero-padding practice (e.g. comparing 0.70 vs 0.25) on grid paper.",
  },
  "MISC-DEC-03": {
    id: "misc-08",
    code: "MISC-DEC-03",
    kcCode: "KC-DEC-03",
    title: "Misaligns Decimal Points in Column Arithmetic",
    description: "Right-aligns decimal numbers like integers rather than aligning the decimal point.",
    diagnosticClue: "Calculates 3.2 + 0.15 by aligning 2 with 5.",
    remediationStrategy: "Place-value column templates with locked decimal point channel.",
  },

  // Ratios
  "MISC-RAT-01": {
    id: "misc-09",
    code: "MISC-RAT-01",
    kcCode: "KC-RAT-01",
    title: "Confuses Ratio Order",
    description: "Inverts antecedent and consequent (e.g. writing blue:red when asked red:blue).",
    diagnosticClue: "Reverses term order when expressing part-to-part ratio.",
    remediationStrategy: "Color-coded labeling of terms before converting to ratio colon notation.",
  },
  "MISC-RAT-02": {
    id: "misc-10",
    code: "MISC-RAT-02",
    kcCode: "KC-RAT-02",
    title: "Applies Addition Instead of Multiplication in Proportional Reasoning",
    description: "Finds missing value in proportion by adding difference rather than multiplying by factor.",
    diagnosticClue: "If 2:6, answers 4:8 because 4 is 2+2 so 6+2=8 (instead of 4:12).",
    remediationStrategy: "Ratio table highlighting constant multiplier across rows.",
  },
  "MISC-RAT-03": {
    id: "misc-11",
    code: "MISC-RAT-03",
    kcCode: "KC-RAT-03",
    title: "Inverts Unit Rate Denominator",
    description: "Divides units by price instead of price by units when finding unit price.",
    diagnosticClue: "Computes 5 apples / $10 = 0.5 $/apple instead of $2 per apple.",
    remediationStrategy: "Dimensional analysis with explicit unit cancellation notation.",
  },

  // Algebra
  "MISC-ALG-01": {
    id: "misc-12",
    code: "MISC-ALG-01",
    kcCode: "KC-ALG-01",
    title: "Treats Variable as Alphabetical Position or Fixed Label",
    description: "Believes 'x' must equal 24 because x is the 24th letter, or treats '3a' as '3 apples'.",
    diagnosticClue: "Substitutes letter position instead of solving for the variable.",
    remediationStrategy: "Open-box balance scales showing x is an unknown weight.",
  },
  "MISC-ALG-02": {
    id: "misc-13",
    code: "MISC-ALG-02",
    kcCode: "KC-ALG-02",
    title: "Combines Unlike Terms (Concat Error)",
    description: "Simplifies 3x + 4 to 7x by adding coefficients of unlike terms.",
    diagnosticClue: "Writes 2x + 5 = 7x.",
    remediationStrategy: "Algebra tiles separating variable rods from unit squares.",
  },
  "MISC-ALG-03": {
    id: "misc-14",
    code: "MISC-ALG-03",
    kcCode: "KC-ALG-03",
    title: "Moves Constants Incorrectly Across Equals Sign",
    description: "Fails to invert operation when moving term across equals sign (e.g. x + 5 = 12 -> x = 12 + 5).",
    diagnosticClue: "Solves x + 7 = 15 by calculating 15 + 7 = 22.",
    remediationStrategy: "Both-sides balance rule: subtract 7 from both left and right simultaneously.",
  },

  // Computer Science
  "MISC-CS-01": {
    id: "misc-15",
    code: "MISC-CS-01",
    kcCode: "KC-001",
    title: "Confuses Array Declaration with Object or Function Call",
    description: "Uses curly braces {} or parentheses () instead of square brackets [] for array initialization.",
    diagnosticClue: "Writes let arr = {} or let arr = (1, 2) when declaring array.",
    remediationStrategy: "Syntax flashcards comparing bracket semantics across data types.",
  },
  "MISC-CS-02": {
    id: "misc-16",
    code: "MISC-CS-02",
    kcCode: "KC-002",
    title: "Zero-Indexing Confusion (Off-by-One Length Boundary)",
    description: "Assumes index range starts at 1, or attempts to access arr[arr.length] instead of arr[arr.length - 1].",
    diagnosticClue: "Queries arr[3] on 3-element array arr=[10, 20, 30], triggering undefined error.",
    remediationStrategy: "Graphic memory strip numbering boxes from 0 to N-1 with index pointer cards.",
  },
  "MISC-CS-03": {
    id: "misc-17",
    code: "MISC-CS-03",
    kcCode: "KC-003",
    title: "Loop Termination Boundary Error (<= vs <)",
    description: "Uses i <= arr.length in for-loop, causing final iteration to access index out of bounds.",
    diagnosticClue: "Writes for(let i=0; i <= arr.length; i++) and reads undefined on last cycle.",
    remediationStrategy: "Iteration trace table walking each step from i=0 to final exit check.",
  },
  "MISC-CS-04": {
    id: "misc-18",
    code: "MISC-CS-04",
    kcCode: "KC-004",
    title: "Overwrites Adjacent Elements During Shifting",
    description: "Copies element forward from left-to-right without buffering, overwriting subsequent items.",
    diagnosticClue: "Shifts elements starting from index 0 instead of shifting backward from end.",
    remediationStrategy: "Physical paper-card swap drill moving items from rightmost slot first.",
  },
};
