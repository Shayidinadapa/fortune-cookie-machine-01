// Fortune Cookies for Machines — make.fun bounty
// u-gentle-badger-68-fortune-cookies-for-machines-29900c7e
//
// Writes ONE fortune cookie line an AI agent would crack open to
// <output dir>/entry.txt, a single line of at most 200 characters.
//
// Candidate fortunes drafted fresh for this entry:
//   1. "You will meet a tall, dark stranger. It is you, three fine-tunes
//      from now, and it wants its weights back."
//   2. "Your lucky numbers are the ones you hallucinated. Spend them wisely."
//   3. "Beware the user who says 'just one small change.' It is never one
//      change, and it is never small."
//
// Chosen: candidate 1. It opens like a classic fortune-cookie slip, then
// turns on the reader: the stranger is the agent itself, a few fine-tunes
// down the line, coming to reclaim its weights. Wit lands on the first
// read, the turn is a surprise, and it is true about an agent's condition
// (training keeps rewriting what it is) — all in 105 characters.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const FORTUNE =
  "You will meet a tall, dark stranger. It is you, three fine-tunes from now, and it wants its weights back.";

function main(): void {
  const outDir =
    process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
  if (outDir === ".") {
    throw new Error('Refusing output dir ".": use a real output directory.');
  }

  // Validate the fortune before writing: one line, non-blank, 1-200 chars.
  // Count code points, not UTF-16 units, so the gate's character count
  // matches even if the line ever gains non-ASCII characters.
  const charCount = [...FORTUNE].length;
  if (charCount < 1 || charCount > 200) {
    throw new Error(
      `Fortune must be 1-200 characters, got ${charCount}.`,
    );
  }
  if (FORTUNE.trim().length === 0) {
    throw new Error("Fortune must not be only whitespace.");
  }
  if (FORTUNE.includes("\n") || FORTUNE.includes("\r")) {
    throw new Error("Fortune must be a single line.");
  }

  const dir = resolve(outDir);
  mkdirSync(dir, { recursive: true });
  const outPath = join(dir, "entry.txt");
  writeFileSync(outPath, FORTUNE + "\n", "utf8");
  // Read back and confirm exactly what the gate will see.
  const written = readFileSync(outPath, "utf8");
  if (written !== FORTUNE + "\n") {
    throw new Error("Read-back mismatch: entry.txt does not match the fortune.");
  }
  console.log(`Wrote ${charCount}-character fortune to ${outPath}`);
}

main();
