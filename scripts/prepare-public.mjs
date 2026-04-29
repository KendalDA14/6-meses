import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";

const outputDir = "public";
const staticFiles = [
  "index.html",
  "one_year.html",
  "six_months.html",
  "CNAME",
];
const staticDirs = [
  "css",
  "img",
  "js",
  "music",
];

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

for (const file of staticFiles) {
  if (existsSync(file)) {
    await cp(file, `${outputDir}/${file}`);
  }
}

for (const dir of staticDirs) {
  if (existsSync(dir)) {
    await cp(dir, `${outputDir}/${dir}`, { recursive: true });
  }
}

console.log(`Prepared ${outputDir} for Vercel.`);
