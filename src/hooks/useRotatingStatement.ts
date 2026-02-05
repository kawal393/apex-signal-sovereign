import { useState, useEffect, useMemo } from "react";

// Rotating statements - the system speaks differently each time
const STATEMENTS = [
  { primary: "Truth does not need to be sold.", secondary: "It just sells." },
  { primary: "The signal persists.", secondary: null },
  { primary: "You are being considered.", secondary: null },
  { primary: "Verification is not optional.", secondary: null },
  { primary: "What you seek is seeking you.", secondary: null },
  { primary: "The system observes.", secondary: null },
];

interface Statement {
  primary: string;
  secondary: string | null;
}

export function useRotatingStatement(): Statement {
  const [statement, setStatement] = useState<Statement>(STATEMENTS[0]);

  useEffect(() => {
    // Select based on time + some randomness for variety
    const now = new Date();
    const hourSeed = now.getHours();
    const daySeed = now.getDate();
    const index = (hourSeed + daySeed) % STATEMENTS.length;
    
    setStatement(STATEMENTS[index]);
  }, []);

  return statement;
}
