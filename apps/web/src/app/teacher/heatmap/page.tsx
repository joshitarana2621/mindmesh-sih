"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InitialAvatar, ProgressBar } from "@/components/ui/progress";
import { Toaster, toast } from "@/components/ui/toast";

interface StudentData {
  id: string;
  name: string;
  seat: string;
  score: number; // 0 to 100
  status: "GREEN" | "YELLOW" | "RED";
  learningDNA: {
    confidence: number;
    cognitiveStyle: string;
    errorPattern: string;
    retentionRate: number;
  };
  weakTopics: Array<{
    code: string;
    name: string;
    mastery: number;
    severity: "CRITICAL" | "HIGH" | "MODERATE";
  }>;
  intervention: {
    strategy: string;
    action: string;
    peerBuddy: string;
    drill: string;
  };
}

const STUDENTS_40: StudentData[] = [
  {
    id: "st-01",
    name: "Aarav Patel",
    seat: "Seat 01",
    score: 92,
    status: "GREEN",
    learningDNA: {
      confidence: 94,
      cognitiveStyle: "Deductive & High Pacing",
      errorPattern: "Zero syntax errors; strong memory allocation comprehension.",
      retentionRate: 96,
    },
    weakTopics: [
      { code: "KC-004", name: "Dynamic Resizing", mastery: 0.82, severity: "MODERATE" },
    ],
    intervention: {
      strategy: "Peer Mentorship Leadership",
      action: "Assign Aarav as mentor for KC-002 peer pods with struggling students.",
      peerBuddy: "Rohan Gupta (Mentee)",
      drill: "Advanced 2D memory layouts challenge",
    },
  },
  {
    id: "st-02",
    name: "Diya Sharma",
    seat: "Seat 02",
    score: 68,
    status: "YELLOW",
    learningDNA: {
      confidence: 65,
      cognitiveStyle: "Visual & Step-by-Step",
      errorPattern: "Occasionally confuses array length with last valid index.",
      retentionRate: 72,
    },
    weakTopics: [
      { code: "KC-002", name: "Zero-Indexed Bounds", mastery: 0.58, severity: "MODERATE" },
      { code: "KC-003", name: "Loop Traversal Conditions", mastery: 0.64, severity: "MODERATE" },
    ],
    intervention: {
      strategy: "Guided Visual Boundary Check",
      action: "Review index range [0, N-1] using a graphic memory strip.",
      peerBuddy: "Meera Nair (Mentor)",
      drill: "3-Question Offset Practice",
    },
  },
  {
    id: "st-03",
    name: "Rohan Gupta",
    seat: "Seat 03",
    score: 44,
    status: "RED",
    learningDNA: {
      confidence: 38,
      cognitiveStyle: "Experimental / Trial-and-Error",
      errorPattern: "Consistently accesses arr[N] instead of arr[N-1] causing out-of-bounds.",
      retentionRate: 48,
    },
    weakTopics: [
      { code: "KC-002", name: "Array Indexing & Boundaries", mastery: 0.35, severity: "CRITICAL" },
      { code: "KC-003", name: "Loop Termination Operators", mastery: 0.42, severity: "HIGH" },
    ],
    intervention: {
      strategy: "Immediate 1-on-1 Whiteboard Trace",
      action: "Conduct a 2-minute physical pointer trace from index 0 to 4 before next quiz.",
      peerBuddy: "Aarav Patel (Mentor)",
      drill: "Boundary Misconception Micro-drill (3 mins)",
    },
  },
  {
    id: "st-04",
    name: "Ananya Rao",
    seat: "Seat 04",
    score: 41,
    status: "RED",
    learningDNA: {
      confidence: 34,
      cognitiveStyle: "Analytical but Low Processing Speed",
      errorPattern: "Off-by-one loops; repeatedly uses '<=' instead of '<' in termination.",
      retentionRate: 44,
    },
    weakTopics: [
      { code: "KC-003", name: "Array Traversal & Conditions", mastery: 0.32, severity: "CRITICAL" },
      { code: "KC-002", name: "Zero-Indexed Offsets", mastery: 0.44, severity: "HIGH" },
    ],
    intervention: {
      strategy: "Targeted Scaffolded Remediation",
      action: "Assign tabular code-tracing exercise with color-coded index counters.",
      peerBuddy: "Arjun Verma (Mentor)",
      drill: "Loop condition visualizer module",
    },
  },
  {
    id: "st-05",
    name: "Kabir Singh",
    seat: "Seat 05",
    score: 72,
    status: "YELLOW",
    learningDNA: {
      confidence: 70,
      cognitiveStyle: "Kinesthetic / Code-First",
      errorPattern: "Understands loops but makes erratic boundary syntax typos under time limits.",
      retentionRate: 75,
    },
    weakTopics: [
      { code: "KC-004", name: "Element Insertion & Shifting", mastery: 0.60, severity: "MODERATE" },
    ],
    intervention: {
      strategy: "Low-Stakes Untimed Practice",
      action: "Provide untimed micro-scaffold for shifting elements rightwards.",
      peerBuddy: "Sara Khan (Mentor)",
      drill: "In-place array shifting puzzle",
    },
  },
  {
    id: "st-06",
    name: "Meera Nair",
    seat: "Seat 06",
    score: 88,
    status: "GREEN",
    learningDNA: {
      confidence: 89,
      cognitiveStyle: "Structural & Methodical",
      errorPattern: "Rare errors; occasional delay on nested traversal logic.",
      retentionRate: 92,
    },
    weakTopics: [
      { code: "KC-003", name: "Nested Traversal", mastery: 0.78, severity: "MODERATE" },
    ],
    intervention: {
      strategy: "Peer Pod Mentor Assignment",
      action: "Assign Meera to lead Pod KC-003 with Diya Sharma.",
      peerBuddy: "Diya Sharma (Mentee)",
      drill: "Matrix traversal extension question",
    },
  },
  {
    id: "st-07",
    name: "Arjun Verma",
    seat: "Seat 07",
    score: 94,
    status: "GREEN",
    learningDNA: {
      confidence: 96,
      cognitiveStyle: "Abstract Reasoning",
      errorPattern: "Flawless on basic structures; fast completion speed.",
      retentionRate: 97,
    },
    weakTopics: [],
    intervention: {
      strategy: "Advanced Algorithmic Extension",
      action: "Unlock binary search and two-pointer challenge problem set.",
      peerBuddy: "Ananya Rao (Mentee)",
      drill: "Two-pointer array reversal drill",
    },
  },
  {
    id: "st-08",
    name: "Ishaan Joshi",
    seat: "Seat 08",
    score: 46,
    status: "RED",
    learningDNA: {
      confidence: 40,
      cognitiveStyle: "Verbal / Needs Concrete Analogy",
      errorPattern: "Struggles with memory abstraction; thinks index starts from 1.",
      retentionRate: 46,
    },
    weakTopics: [
      { code: "KC-001", name: "Array Declaration & Base Memory", mastery: 0.42, severity: "CRITICAL" },
      { code: "KC-002", name: "Array Indexing", mastery: 0.45, severity: "HIGH" },
    ],
    intervention: {
      strategy: "Physical Metaphor Intervention",
      action: "Show apartment mailbox analogy (Box #0 is ground floor).",
      peerBuddy: "Kavya Pillai (Mentor)",
      drill: "Mailbox index mapping quiz",
    },
  },
  {
    id: "st-09",
    name: "Tanya Reddy",
    seat: "Seat 09",
    score: 65,
    status: "YELLOW",
    learningDNA: {
      confidence: 62,
      cognitiveStyle: "Sequential Learner",
      errorPattern: "Drops accuracy when loops iterate backwards.",
      retentionRate: 68,
    },
    weakTopics: [
      { code: "KC-003", name: "Reverse Traversal Loops", mastery: 0.52, severity: "MODERATE" },
    ],
    intervention: {
      strategy: "Reverse Pointer Walkthrough",
      action: "Trace loop `for (let i = arr.length - 1; i >= 0; i--)` line-by-line.",
      peerBuddy: "Yash Choudhury (Mentor)",
      drill: "Reverse indexing micro-quiz",
    },
  },
  {
    id: "st-10",
    name: "Aditya Kumar",
    seat: "Seat 10",
    score: 85,
    status: "GREEN",
    learningDNA: {
      confidence: 86,
      cognitiveStyle: "Iterative & Persistent",
      errorPattern: "Consistent grasp of core primitives.",
      retentionRate: 90,
    },
    weakTopics: [
      { code: "KC-004", name: "Array Insertion Bounds", mastery: 0.76, severity: "MODERATE" },
    ],
    intervention: {
      strategy: "Reinforcement Practice",
      action: "Practice shift-right array insertion without overwriting.",
      peerBuddy: "Self-Paced Extension",
      drill: "Insertion challenge 2",
    },
  },
  {
    id: "st-11",
    name: "Riya Sen",
    seat: "Seat 11",
    score: 74,
    status: "YELLOW",
    learningDNA: {
      confidence: 71,
      cognitiveStyle: "Visual Learner",
      errorPattern: "Solid on declarations; hesitant on loop boundary conditions.",
      retentionRate: 74,
    },
    weakTopics: [
      { code: "KC-003", name: "Boundary Edge Cases", mastery: 0.63, severity: "MODERATE" },
    ],
    intervention: {
      strategy: "Boundary Highlight Drill",
      action: "Highlight array ends visually on canvas before writing condition.",
      peerBuddy: "Aman Tripathi",
      drill: "Edge case diagnostic check",
    },
  },
  {
    id: "st-12",
    name: "Vihaan Malhotra",
    seat: "Seat 12",
    score: 89,
    status: "GREEN",
    learningDNA: {
      confidence: 90,
      cognitiveStyle: "Fast Analytic",
      errorPattern: "Strong syntax control; high first-attempt accuracy.",
      retentionRate: 93,
    },
    weakTopics: [],
    intervention: {
      strategy: "Peer Pod Mentor",
      action: "Support Devansh Das on fundamental array bounds.",
      peerBuddy: "Devansh Das (Mentee)",
      drill: "Advanced memory allocation test",
    },
  },
  {
    id: "st-13",
    name: "Sara Khan",
    seat: "Seat 13",
    score: 91,
    status: "GREEN",
    learningDNA: {
      confidence: 93,
      cognitiveStyle: "Systematic & Thorough",
      errorPattern: "Near-zero mistakes; explains solutions clearly.",
      retentionRate: 95,
    },
    weakTopics: [],
    intervention: {
      strategy: "Co-Teacher Role in Pods",
      action: "Lead station 3 collaborative review for KC-003.",
      peerBuddy: "Kabir Singh (Mentee)",
      drill: "Algorithmic thinking card",
    },
  },
  {
    id: "st-14",
    name: "Devansh Das",
    seat: "Seat 14",
    score: 38,
    status: "RED",
    learningDNA: {
      confidence: 30,
      cognitiveStyle: "Struggling with Mental Models",
      errorPattern: "High latency (>45s per item); randomly guessing on array boundaries.",
      retentionRate: 35,
    },
    weakTopics: [
      { code: "KC-001", name: "Array Definition & Size", mastery: 0.32, severity: "CRITICAL" },
      { code: "KC-002", name: "0-Indexed Offsets", mastery: 0.35, severity: "CRITICAL" },
      { code: "KC-003", name: "Traversal Loops", mastery: 0.40, severity: "HIGH" },
    ],
    intervention: {
      strategy: "Urgent Teacher Station Direct Instruction",
      action: "Pull Devansh to Teacher Station for tactile 1-on-1 foundational reteaching.",
      peerBuddy: "Vihaan Malhotra (Mentor)",
      drill: "Tactile card sorting drill (5 mins)",
    },
  },
  {
    id: "st-15",
    name: "Pooja Iyer",
    seat: "Seat 15",
    score: 69,
    status: "YELLOW",
    learningDNA: {
      confidence: 68,
      cognitiveStyle: "Reflective",
      errorPattern: "Understands theory but misses edge cases (empty arrays, 1-element arrays).",
      retentionRate: 70,
    },
    weakTopics: [
      { code: "KC-002", name: "Empty / Single-Item Arrays", mastery: 0.55, severity: "MODERATE" },
    ],
    intervention: {
      strategy: "Edge Case Diagnostic",
      action: "Assign boundary edge case checks for single-item arrays.",
      peerBuddy: "Siddharth Roy",
      drill: "Edge case practice 1",
    },
  },
  {
    id: "st-16",
    name: "Siddharth Roy",
    seat: "Seat 16",
    score: 84,
    status: "GREEN",
    learningDNA: {
      confidence: 85,
      cognitiveStyle: "Practical & Applied",
      errorPattern: "Good execution; minor slip on 0-based syntax occasionally.",
      retentionRate: 88,
    },
    weakTopics: [
      { code: "KC-004", name: "Element Shifting", mastery: 0.74, severity: "MODERATE" },
    ],
    intervention: {
      strategy: "Self-Check Review",
      action: "Provide self-correcting unit test for array manipulation.",
      peerBuddy: "Pooja Iyer",
      drill: "Self-checking test suite",
    },
  },
  {
    id: "st-17",
    name: "Kavya Pillai",
    seat: "Seat 17",
    score: 93,
    status: "GREEN",
    learningDNA: {
      confidence: 95,
      cognitiveStyle: "Top Performer / Conceptual",
      errorPattern: "High speed, 100% accuracy on foundational indexing.",
      retentionRate: 98,
    },
    weakTopics: [],
    intervention: {
      strategy: "Peer Mentorship for Ishaan",
      action: "Pair with Ishaan Joshi on mailbox memory model.",
      peerBuddy: "Ishaan Joshi (Mentee)",
      drill: "Mentor explanation rubric",
    },
  },
  {
    id: "st-18",
    name: "Manav Mehta",
    seat: "Seat 18",
    score: 61,
    status: "YELLOW",
    learningDNA: {
      confidence: 58,
      cognitiveStyle: "Slightly Hesitant",
      errorPattern: "Slow response times on loops; double-checks conditions frequently.",
      retentionRate: 64,
    },
    weakTopics: [
      { code: "KC-003", name: "Loop Traversal Pacing", mastery: 0.54, severity: "MODERATE" },
    ],
    intervention: {
      strategy: "Confidence Building Micro-Quiz",
      action: "Assign 3 quick automated recognition tasks to build speed.",
      peerBuddy: "Aryan Saxena",
      drill: "Pacing booster quiz",
    },
  },
  {
    id: "st-19",
    name: "Shreya Bose",
    seat: "Seat 19",
    score: 45,
    status: "RED",
    learningDNA: {
      confidence: 41,
      cognitiveStyle: "Intuitive Guessing Pattern",
      errorPattern: "Frequently inverts index and element values (e.g. using value as index).",
      retentionRate: 47,
    },
    weakTopics: [
      { code: "KC-002", name: "Index vs. Value Distinction", mastery: 0.38, severity: "CRITICAL" },
      { code: "KC-003", name: "Array Traversal Values", mastery: 0.44, severity: "HIGH" },
    ],
    intervention: {
      strategy: "Index vs Value Scaffolding",
      action: "Use color-coded table differentiating 'House Number' (index) from 'Resident' (value).",
      peerBuddy: "Tanvi Pandey (Mentor)",
      drill: "Index vs Value sorting cards",
    },
  },
  {
    id: "st-20",
    name: "Aryan Saxena",
    seat: "Seat 20",
    score: 87,
    status: "GREEN",
    learningDNA: {
      confidence: 88,
      cognitiveStyle: "Consistent & Steady",
      errorPattern: "Very solid grasp across all 4 KCs.",
      retentionRate: 91,
    },
    weakTopics: [],
    intervention: {
      strategy: "Station Group Leader",
      action: "Lead Group 2 peer station during rotation cycles.",
      peerBuddy: "Manav Mehta",
      drill: "Station leadership task",
    },
  },
  {
    id: "st-21",
    name: "Neha Bhatia",
    seat: "Seat 21",
    score: 77,
    status: "YELLOW",
    learningDNA: {
      confidence: 75,
      cognitiveStyle: "Methodical",
      errorPattern: "Occasionally forgets that array size is fixed in standard declarations.",
      retentionRate: 78,
    },
    weakTopics: [
      { code: "KC-001", name: "Array Memory Bounds", mastery: 0.68, severity: "MODERATE" },
    ],
    intervention: {
      strategy: "Memory Structure Review",
      action: "Complete 2 quick visual exercises on contiguous memory allocation.",
      peerBuddy: "Pranav Kulkarni",
      drill: "Memory strip worksheet",
    },
  },
  {
    id: "st-22",
    name: "Pranav Kulkarni",
    seat: "Seat 22",
    score: 82,
    status: "GREEN",
    learningDNA: {
      confidence: 83,
      cognitiveStyle: "Practical Problem Solver",
      errorPattern: "Reliable mastery; minimal assistance required.",
      retentionRate: 86,
    },
    weakTopics: [],
    intervention: {
      strategy: "Algorithmic Expansion",
      action: "Explore array searching techniques (Linear vs Binary).",
      peerBuddy: "Neha Bhatia",
      drill: "Search algorithm drill",
    },
  },
  {
    id: "st-23",
    name: "Anika Deshmukh",
    seat: "Seat 23",
    score: 66,
    status: "YELLOW",
    learningDNA: {
      confidence: 64,
      cognitiveStyle: "Detail-Oriented but Slow",
      errorPattern: "Gets confused between forward and backward index offsets.",
      retentionRate: 67,
    },
    weakTopics: [
      { code: "KC-002", name: "Index Calculations", mastery: 0.59, severity: "MODERATE" },
    ],
    intervention: {
      strategy: "Visual Number Line Reinforcement",
      action: "Use digital number-line tool to practice indexing steps.",
      peerBuddy: "Kunal Chopra",
      drill: "Number line offset quiz",
    },
  },
  {
    id: "st-24",
    name: "Yash Choudhury",
    seat: "Seat 24",
    score: 95,
    status: "GREEN",
    learningDNA: {
      confidence: 98,
      cognitiveStyle: "Advanced Analytical",
      errorPattern: "Perfect scores across all recent diagnostic quizzes.",
      retentionRate: 99,
    },
    weakTopics: [],
    intervention: {
      strategy: "Peer Pod Lead Mentor",
      action: "Lead Pod KC-002; mentor Tanya Reddy and Simran Kaur.",
      peerBuddy: "Simran Kaur (Mentee)",
      drill: "Competitive programming micro-challenge",
    },
  },
  {
    id: "st-25",
    name: "Simran Kaur",
    seat: "Seat 25",
    score: 42,
    status: "RED",
    learningDNA: {
      confidence: 35,
      cognitiveStyle: "Visual Learner with Syntax Anxiety",
      errorPattern: "Confuses bracket notation `arr[i]` with function call syntax `arr(i)`.",
      retentionRate: 45,
    },
    weakTopics: [
      { code: "KC-001", name: "Array Syntax & Declaration", mastery: 0.36, severity: "CRITICAL" },
      { code: "KC-002", name: "Bracket Index Notation", mastery: 0.41, severity: "HIGH" },
    ],
    intervention: {
      strategy: "Syntax Demystification Drill",
      action: "5-minute syntax contrast card: `arr[i]` vs `fn(x)`.",
      peerBuddy: "Yash Choudhury (Mentor)",
      drill: "Bracket syntax matching game",
    },
  },
  {
    id: "st-26",
    name: "Hrithik Menon",
    seat: "Seat 26",
    score: 71,
    status: "YELLOW",
    learningDNA: {
      confidence: 69,
      cognitiveStyle: "Hands-on Trial",
      errorPattern: "Good at writing code, but makes arithmetic errors in array sizing.",
      retentionRate: 72,
    },
    weakTopics: [
      { code: "KC-004", name: "Array Insertion Boundaries", mastery: 0.62, severity: "MODERATE" },
    ],
    intervention: {
      strategy: "Boundary Arithmetic Micro-Check",
      action: "Practice calculating required capacity before insertion.",
      peerBuddy: "Priya Nambiar",
      drill: "Capacity calculation sheet",
    },
  },
  {
    id: "st-27",
    name: "Priya Nambiar",
    seat: "Seat 27",
    score: 86,
    status: "GREEN",
    learningDNA: {
      confidence: 87,
      cognitiveStyle: "Structured Thinker",
      errorPattern: "High consistency; dependable understanding of loop flows.",
      retentionRate: 90,
    },
    weakTopics: [],
    intervention: {
      strategy: "Co-operative Learning Pod",
      action: "Guide Hrithik Menon through array resizing logic.",
      peerBuddy: "Hrithik Menon",
      drill: "Peer coaching challenge",
    },
  },
  {
    id: "st-28",
    name: "Nikhil Agarwal",
    seat: "Seat 28",
    score: 64,
    status: "YELLOW",
    learningDNA: {
      confidence: 60,
      cognitiveStyle: "Verbal / Abstract",
      errorPattern: "Understands concept verbally but misplaces semicolons in loop headers.",
      retentionRate: 65,
    },
    weakTopics: [
      { code: "KC-003", name: "Loop Syntax Precision", mastery: 0.56, severity: "MODERATE" },
    ],
    intervention: {
      strategy: "Syntax Block Scaffolding",
      action: "Use draggable visual code blocks before typing raw syntax.",
      peerBuddy: "Tanvi Pandey",
      drill: "Code block reordering task",
    },
  },
  {
    id: "st-29",
    name: "Tanvi Pandey",
    seat: "Seat 29",
    score: 90,
    status: "GREEN",
    learningDNA: {
      confidence: 92,
      cognitiveStyle: "Intuitive & Expressive",
      errorPattern: "Very high concept mastery; excellent communication skills.",
      retentionRate: 94,
    },
    weakTopics: [],
    intervention: {
      strategy: "Peer Pod Lead for Shreya",
      action: "Mentor Shreya Bose on Index vs Value distinction.",
      peerBuddy: "Shreya Bose (Mentee)",
      drill: "Pedagogical tutoring review",
    },
  },
  {
    id: "st-30",
    name: "Kunal Chopra",
    seat: "Seat 30",
    score: 83,
    status: "GREEN",
    learningDNA: {
      confidence: 84,
      cognitiveStyle: "Practical Builder",
      errorPattern: "Reliable execution with fast recall.",
      retentionRate: 87,
    },
    weakTopics: [],
    intervention: {
      strategy: "Independent Problem Solving",
      action: "Work on array rotation algorithms.",
      peerBuddy: "Anika Deshmukh",
      drill: "Array cyclic shift drill",
    },
  },
  {
    id: "st-31",
    name: "Divya Tiwari",
    seat: "Seat 31",
    score: 75,
    status: "YELLOW",
    learningDNA: {
      confidence: 73,
      cognitiveStyle: "Methodical & Thoughtful",
      errorPattern: "Occasionally confuses `<` with `<=` when iterating up to length.",
      retentionRate: 76,
    },
    weakTopics: [
      { code: "KC-003", name: "Termination Operator Accuracy", mastery: 0.65, severity: "MODERATE" },
    ],
    intervention: {
      strategy: "Operator Distinction Practice",
      action: "Complete 5 rapid comparison cards on `<` vs `<= length`.",
      peerBuddy: "Rahul Singhania",
      drill: "Operator rapid test",
    },
  },
  {
    id: "st-32",
    name: "Rahul Singhania",
    seat: "Seat 32",
    score: 89,
    status: "GREEN",
    learningDNA: {
      confidence: 91,
      cognitiveStyle: "Fast Analytic",
      errorPattern: "High accuracy; eager to tackle extension puzzles.",
      retentionRate: 92,
    },
    weakTopics: [],
    intervention: {
      strategy: "Peer Pod Mentor",
      action: "Partner with Divya Tiwari on condition verification.",
      peerBuddy: "Divya Tiwari",
      drill: "Condition verification drill",
    },
  },
  {
    id: "st-33",
    name: "Sneha Mishra",
    seat: "Seat 33",
    score: 63,
    status: "YELLOW",
    learningDNA: {
      confidence: 59,
      cognitiveStyle: "Visual & Careful",
      errorPattern: "Hesitant when indexing array elements from end.",
      retentionRate: 64,
    },
    weakTopics: [
      { code: "KC-002", name: "Negative / End-Offset Indices", mastery: 0.54, severity: "MODERATE" },
    ],
    intervention: {
      strategy: "End-Offset Stepping Strategy",
      action: "Trace formula `arr[arr.length - 1 - i]` with diagram.",
      peerBuddy: "Varun Jain",
      drill: "End offset calculator check",
    },
  },
  {
    id: "st-34",
    name: "Varun Jain",
    seat: "Seat 34",
    score: 81,
    status: "GREEN",
    learningDNA: {
      confidence: 82,
      cognitiveStyle: "Consistent Worker",
      errorPattern: "Steady performance across standard problems.",
      retentionRate: 85,
    },
    weakTopics: [],
    intervention: {
      strategy: "Peer Collaboration",
      action: "Assist Sneha Mishra with offset formulas.",
      peerBuddy: "Sneha Mishra",
      drill: "Formula peer check",
    },
  },
  {
    id: "st-35",
    name: "Anjali Yadav",
    seat: "Seat 35",
    score: 94,
    status: "GREEN",
    learningDNA: {
      confidence: 96,
      cognitiveStyle: "High Mastery & Fast Learner",
      errorPattern: "Flawless on quizzes; helps peers explain code.",
      retentionRate: 97,
    },
    weakTopics: [],
    intervention: {
      strategy: "Classroom Assistant Role",
      action: "Serve as student teaching assistant for Station 3.",
      peerBuddy: "Aman Tripathi",
      drill: "Advanced algorithm challenge",
    },
  },
  {
    id: "st-36",
    name: "Aman Tripathi",
    seat: "Seat 36",
    score: 67,
    status: "YELLOW",
    learningDNA: {
      confidence: 65,
      cognitiveStyle: "Practical Experimenter",
      errorPattern: "Occasionally forgets to initialize loop counter variable `i`.",
      retentionRate: 68,
    },
    weakTopics: [
      { code: "KC-003", name: "Loop Variable Initialization", mastery: 0.58, severity: "MODERATE" },
    ],
    intervention: {
      strategy: "Header Syntax Checklist",
      action: "Apply 3-part loop initialization checklist: Init, Condition, Increment.",
      peerBuddy: "Anjali Yadav",
      drill: "Loop header checklist quiz",
    },
  },
  {
    id: "st-37",
    name: "Kriti Sengupta",
    seat: "Seat 37",
    score: 92,
    status: "GREEN",
    learningDNA: {
      confidence: 93,
      cognitiveStyle: "Analytical & Creative",
      errorPattern: "Consistently excellent scores; solves problems in multiple ways.",
      retentionRate: 95,
    },
    weakTopics: [],
    intervention: {
      strategy: "Peer Pod Mentor",
      action: "Support Chetan Rawat during rotation station.",
      peerBuddy: "Chetan Rawat",
      drill: "Multi-solution comparison drill",
    },
  },
  {
    id: "st-38",
    name: "Chetan Rawat",
    seat: "Seat 38",
    score: 70,
    status: "YELLOW",
    learningDNA: {
      confidence: 68,
      cognitiveStyle: "Visual & Step-by-Step",
      errorPattern: "Understands array traversal but hesitates on edge element handling.",
      retentionRate: 71,
    },
    weakTopics: [
      { code: "KC-004", name: "Array Edge Insertion", mastery: 0.61, severity: "MODERATE" },
    ],
    intervention: {
      strategy: "Edge Element Hands-On Step",
      action: "Trace inserting at index 0 vs index N.",
      peerBuddy: "Kriti Sengupta",
      drill: "Edge insertion worksheet",
    },
  },
  {
    id: "st-39",
    name: "Barkha Bansal",
    seat: "Seat 39",
    score: 86,
    status: "GREEN",
    learningDNA: {
      confidence: 87,
      cognitiveStyle: "Calm & Structured",
      errorPattern: "Very stable retention; few syntax errors.",
      retentionRate: 89,
    },
    weakTopics: [],
    intervention: {
      strategy: "Self-Paced Progress",
      action: "Advance to multi-dimensional arrays.",
      peerBuddy: "Mayank Dixit",
      drill: "2D array intro worksheet",
    },
  },
  {
    id: "st-40",
    name: "Mayank Dixit",
    seat: "Seat 40",
    score: 88,
    status: "GREEN",
    learningDNA: {
      confidence: 89,
      cognitiveStyle: "Logical Thinker",
      errorPattern: "Strong understanding across all fundamentals.",
      retentionRate: 91,
    },
    weakTopics: [],
    intervention: {
      strategy: "Peer Collaboration",
      action: "Co-lead peer practice session on array operations.",
      peerBuddy: "Barkha Bansal",
      drill: "Array operations synthesis",
    },
  },
];

export default function TeacherHeatmapPage() {
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [filter, setFilter] = useState<"ALL" | "GREEN" | "YELLOW" | "RED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const greenCount = STUDENTS_40.filter((s) => s.status === "GREEN").length;
  const yellowCount = STUDENTS_40.filter((s) => s.status === "YELLOW").length;
  const redCount = STUDENTS_40.filter((s) => s.status === "RED").length;

  const filteredStudents = STUDENTS_40.filter((s) => {
    const matchesFilter = filter === "ALL" ? true : s.status === filter;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.seat.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAssignIntervention = (student: StudentData) => {
    toast({
      kind: "success",
      title: `Intervention Assigned: ${student.name}`,
      body: `Scheduled: ${student.intervention.action}`,
    });
  };

  const handleQueuePeerPod = (student: StudentData) => {
    toast({
      kind: "info",
      title: `Queued to Peer Pod`,
      body: `Assigned partner: ${student.intervention.peerBuddy}`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sticky Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shadow-md shadow-violet-500/30">
              <Icon name="radar" className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-slate-900">Teacher Heatmap</h1>
                <Badge variant="brand">Cohort Live Grid</Badge>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Grade 8 · Section A · 40 Students Live Mastery
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/teacher"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors"
            >
              <Icon name="arrowLeft" className="w-3.5 h-3.5" /> Back to Radar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 flex-1 w-full">
        {/* Top Summary Banner */}
        <div className="bg-brand rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-violet-500/20 animate-fade-up">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/20 text-sky-200 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Real-Time Telemetry Matrix
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight">
                Classroom Heatmap (40 Students)
              </h2>
              <p className="text-white/80 text-sm mt-1 max-w-xl">
                Click any student tile to inspect their AI Learning DNA, pinpoint cognitive gaps, and deploy 1-click interventions before the class ends.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-xl px-4 py-2.5 text-center">
                <p className="text-2xl font-extrabold text-emerald-300">{greenCount}</p>
                <p className="text-[11px] font-bold text-white/80 uppercase">Strong (≥80%)</p>
              </div>
              <div className="bg-amber-500/20 border border-amber-400/30 rounded-xl px-4 py-2.5 text-center">
                <p className="text-2xl font-extrabold text-amber-300">{yellowCount}</p>
                <p className="text-[11px] font-bold text-white/80 uppercase">Average (50-79%)</p>
              </div>
              <div className="bg-rose-500/20 border border-rose-400/30 rounded-xl px-4 py-2.5 text-center">
                <p className="text-2xl font-extrabold text-rose-300">{redCount}</p>
                <p className="text-[11px] font-bold text-white/80 uppercase">Needs Help (&lt;50%)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === "ALL"
                  ? "bg-brand text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All (40)
            </button>
            <button
              onClick={() => setFilter("GREEN")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filter === "GREEN"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Strong ({greenCount})
            </button>
            <button
              onClick={() => setFilter("YELLOW")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filter === "YELLOW"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-amber-700 bg-amber-50 hover:bg-amber-100"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Average ({yellowCount})
            </button>
            <button
              onClick={() => setFilter("RED")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filter === "RED"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-rose-700 bg-rose-50 hover:bg-rose-100"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Needs Help ({redCount})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icon name="search" className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search student or seat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* 40-Student Heatmap Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3">
          {filteredStudents.map((st) => {
            const isSelected = selectedStudent?.id === st.id;
            const cardColor =
              st.status === "GREEN"
                ? "bg-emerald-50/70 border-emerald-200 text-emerald-950 hover:border-emerald-400 hover:shadow-emerald-500/10"
                : st.status === "YELLOW"
                ? "bg-amber-50/70 border-amber-200 text-amber-950 hover:border-amber-400 hover:shadow-amber-500/10"
                : "bg-rose-50/90 border-rose-300 text-rose-950 hover:border-rose-400 hover:shadow-rose-500/20 ring-1 ring-rose-200";

            const badgeVariant =
              st.status === "GREEN" ? "success" : st.status === "YELLOW" ? "warning" : "destructive";

            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStudent(st)}
                className={`text-left rounded-2xl border p-3.5 transition-all duration-200 flex flex-col justify-between relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500 ${cardColor} ${
                  isSelected ? "ring-2 ring-violet-600 scale-[1.02] shadow-md" : "hover:scale-[1.02] shadow-sm"
                }`}
                aria-pressed={isSelected}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      {st.seat}
                    </span>
                    <span
                      className={`text-xs font-extrabold ${
                        st.status === "GREEN"
                          ? "text-emerald-700"
                          : st.status === "YELLOW"
                          ? "text-amber-700"
                          : "text-rose-700"
                      }`}
                    >
                      {st.score}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <InitialAvatar name={st.name} className="w-7 h-7 text-xs shrink-0" />
                    <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                      {st.name}
                    </p>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between">
                  <Badge variant={badgeVariant} className="text-[9px] px-1.5 py-0">
                    {st.status === "GREEN"
                      ? "Strong"
                      : st.status === "YELLOW"
                      ? "Average"
                      : "Intervene"}
                  </Badge>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-700 font-semibold transition-colors">
                    Details →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Slide-out Side Panel for Selected Student */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedStudent(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="side-panel-name"
        >
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 overflow-y-auto p-6 flex flex-col justify-between animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Panel Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <InitialAvatar name={selectedStudent.name} className="w-12 h-12 text-base" />
                  <div>
                    <h2 id="side-panel-name" className="text-lg font-extrabold text-slate-900 leading-snug">
                      {selectedStudent.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400 font-medium">
                        {selectedStudent.seat}
                      </span>
                      <span className="text-xs text-slate-300">·</span>
                      <Badge
                        variant={
                          selectedStudent.status === "GREEN"
                            ? "success"
                            : selectedStudent.status === "YELLOW"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {selectedStudent.score}% Mastery
                      </Badge>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
                  aria-label="Close side panel"
                >
                  <Icon name="close" className="w-4 h-4" />
                </button>
              </div>

              {/* 1. Learning DNA Profile Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Icon name="brain" className="w-4 h-4 text-violet-600" />
                    Learning DNA
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {selectedStudent.learningDNA.confidence}% Confidence
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <p className="text-slate-400 font-semibold">Cognitive Learning Style</p>
                    <p className="text-slate-800 font-medium mt-0.5">
                      {selectedStudent.learningDNA.cognitiveStyle}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold">Misconception & Error Pattern</p>
                    <p className="text-slate-800 font-medium mt-0.5 bg-white p-2.5 rounded-xl border border-slate-200 leading-relaxed">
                      {selectedStudent.learningDNA.errorPattern}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400 font-semibold">Concept Retention Rate</span>
                    <span className="font-bold text-slate-800">
                      {selectedStudent.learningDNA.retentionRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Weak Topics (Knowledge Components) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Icon name="target" className="w-4 h-4 text-rose-500" />
                    Weak Topics & Gaps
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {selectedStudent.weakTopics.length} detected
                  </span>
                </div>

                {selectedStudent.weakTopics.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center">
                    ✓ No critical gaps detected. Student is performing at or above benchmark!
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {selectedStudent.weakTopics.map((wt) => (
                      <div
                        key={wt.code}
                        className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                              {wt.code}
                            </span>
                            {wt.name}
                          </span>
                          <span
                            className={`text-xs font-bold ${
                              wt.severity === "CRITICAL"
                                ? "text-rose-600"
                                : wt.severity === "HIGH"
                                ? "text-amber-600"
                                : "text-sky-600"
                            }`}
                          >
                            {Math.round(wt.mastery * 100)}%
                          </span>
                        </div>
                        <ProgressBar
                          value={wt.mastery}
                          barClassName={
                            wt.severity === "CRITICAL"
                              ? "bg-rose-500"
                              : wt.severity === "HIGH"
                              ? "bg-amber-500"
                              : "bg-sky-500"
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Recommended Intervention */}
              <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Icon name="sparkles" className="w-4 h-4 text-sky-600" />
                    Recommended Intervention
                  </h3>
                  <Badge variant="info">AI Prescribed</Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <p className="text-sky-800/80 font-bold">{selectedStudent.intervention.strategy}</p>
                    <p className="text-slate-700 leading-relaxed mt-1">
                      {selectedStudent.intervention.action}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-sky-200/60 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white p-2 rounded-lg border border-sky-100">
                      <p className="text-slate-400 font-semibold">Suggested Peer</p>
                      <p className="text-slate-800 font-bold truncate mt-0.5">
                        {selectedStudent.intervention.peerBuddy}
                      </p>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-sky-100">
                      <p className="text-slate-400 font-semibold">Target Drill</p>
                      <p className="text-slate-800 font-bold truncate mt-0.5">
                        {selectedStudent.intervention.drill}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons in Drawer */}
            <div className="pt-6 border-t border-slate-100 space-y-2 mt-6">
              <Button
                variant="brand"
                className="w-full gap-2 text-xs py-2.5"
                onClick={() => handleAssignIntervention(selectedStudent)}
              >
                <Icon name="check" className="w-4 h-4" /> Assign 1-on-1 Practice
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full text-xs gap-1.5"
                  onClick={() => handleQueuePeerPod(selectedStudent)}
                >
                  <Icon name="users" className="w-3.5 h-3.5" /> Queue to Peer Pod
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-xs text-slate-500 hover:text-slate-800"
                  onClick={() => setSelectedStudent(null)}
                >
                  Dismiss Panel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Toaster */}
      <Toaster />
    </div>
  );
}
