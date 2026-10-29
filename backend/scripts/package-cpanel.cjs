// Collects the runtime files for cPanel's Node.js app into ./cpanel-deploy.
// Excludes node_modules (run "NPM Install" on the server), .env, migration
// tooling and test scripts.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const out = path.join(root, "cpanel-deploy");

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const dir of ["config", "src", "utils"]) {
  fs.cpSync(path.join(root, dir), path.join(out, dir), { recursive: true });
}
for (const file of [
  "app.cjs",
  "server.js",
  "dbConnection.js",
  "package.json",
  "package-lock.json",
]) {
  fs.copyFileSync(path.join(root, file), path.join(out, file));
}

console.log(`Ready: ${out}\nZip its contents (not the folder) and upload.`);
