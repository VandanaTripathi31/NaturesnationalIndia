import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.join(__dirname, "..", "logs");

fs.mkdirSync(logDir, { recursive: true });

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const logFile = path.join(logDir, `migration-${stamp}.log`);
const stream = fs.createWriteStream(logFile, { flags: "a" });

function write(level, args) {
  const line = `[${new Date().toISOString()}] [${level}] ${args
    .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
    .join(" ")}`;
  stream.write(line + "\n");
  return line;
}

export const logger = {
  file: logFile,
  info: (...a) => console.log(write("INFO", a)),
  warn: (...a) => console.warn(write("WARN", a)),
  error: (...a) => console.error(write("ERROR", a)),
  ok: (...a) => console.log(write("OK", a)),
};
