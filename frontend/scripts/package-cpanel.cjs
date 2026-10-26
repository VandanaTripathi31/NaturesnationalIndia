/* eslint-disable @typescript-eslint/no-require-imports */
// Collects everything cPanel's Node.js app needs into ./cpanel-deploy.
// Run after `npm run build`. node_modules is NOT copied: run "NPM Install"
// in cPanel so native modules (sharp) are built for the Linux server.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const out = path.join(root, "cpanel-deploy");

if (!fs.existsSync(path.join(root, ".next", "BUILD_ID"))) {
  console.error("No production build found. Run `npm run build` first.");
  process.exit(1);
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

fs.cpSync(path.join(root, ".next"), path.join(out, ".next"), {
  recursive: true,
  filter: (src) => !src.includes(`${path.sep}.next${path.sep}cache`),
});
fs.cpSync(path.join(root, "public"), path.join(out, "public"), {
  recursive: true,
});
for (const file of ["server.js", "next.config.mjs"]) {
  fs.copyFileSync(path.join(root, file), path.join(out, file));
}

// Slim package.json: runtime deps only (build tooling stays on your machine).
const pkg = require(path.join(root, "package.json"));
const slim = {
  name: pkg.name,
  version: pkg.version,
  private: true,
  scripts: { start: "node server.js" },
  dependencies: pkg.dependencies,
};
fs.writeFileSync(
  path.join(out, "package.json"),
  JSON.stringify(slim, null, 2) + "\n",
);

console.log(`Ready: ${out}\nZip its contents (not the folder) and upload.`);
