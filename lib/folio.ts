import { promises as fs } from "fs";
import path from "path";

const COUNTER_FILE = path.join(process.cwd(), "data", "expedientes", "_counter.json");

async function readCounter() {
  try {
    const raw = await fs.readFile(COUNTER_FILE, "utf8");
    const parsed = JSON.parse(raw) as { year: number; seq: number };
    return parsed;
  } catch {
    return { year: new Date().getFullYear(), seq: 0 };
  }
}

async function writeCounter(counter: { year: number; seq: number }) {
  await fs.mkdir(path.dirname(COUNTER_FILE), { recursive: true });
  await fs.writeFile(COUNTER_FILE, JSON.stringify(counter), "utf8");
}

export async function generateFolio() {
  const year = new Date().getFullYear();
  const counter = await readCounter();
  const seq = counter.year === year ? counter.seq + 1 : 1;
  await writeCounter({ year, seq });
  return `IG-${year}-${String(seq).padStart(6, "0")}`;
}
