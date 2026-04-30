import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, parse } from "node:path";

const outputDir = "public";
const staticFiles = ["index.html", "manifest.webmanifest"];
const staticDirs = [
  "css",
  "img",
  "js",
  "music",
  "music_one_year",
];

const audioExtensions = new Set([".mp3", ".m4a", ".aac", ".ogg", ".wav", ".webm"]);

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

async function readAudioTracks(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  const files = await readdir(dir, { withFileTypes: true });
  return files
    .filter((file) => file.isFile() && audioExtensions.has(extname(file.name).toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name, "es"))
    .map((file) => ({
      title: parse(file.name).name.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim(),
      src: `${dir}/${encodeURIComponent(file.name).replace(/%2F/g, "/")}`,
    }));
}

const oneYearTracks = [
  ...(await readAudioTracks("music/music_one_year")),
  ...(await readAudioTracks("music_one_year")),
];
const fallbackTracks = await readAudioTracks("music");
const tracks = oneYearTracks.length ? oneYearTracks : fallbackTracks;
await writeFile(
  `${outputDir}/js/one_year_tracks.js`,
  `window.ONE_YEAR_TRACKS = ${JSON.stringify(tracks, null, 2)};\n`,
  "utf8",
);

console.log(`Prepared ${outputDir} for Vercel.`);
