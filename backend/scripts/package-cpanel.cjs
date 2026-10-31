// Collects the runtime files for cPanel's Node.js app into
// ./cpanel-deploy/build and zips them to ./cpanel-deploy/backend.zip.
// Excludes node_modules (run "NPM Install" on the server), .env, migration
// tooling and test scripts.
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.join(__dirname, "..");
const deploy = path.join(root, "cpanel-deploy");
const out = path.join(deploy, "build");

fs.rmSync(deploy, { recursive: true, force: true });
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

// Zip build/'s contents (not the folder itself) into cpanel-deploy/backend.zip.
// Windows ships bsdtar (writes zip with forward slashes, unlike
// Compress-Archive in PowerShell 5.1); elsewhere use the `zip` CLI.
// Use the system bsdtar explicitly: Git Bash puts GNU tar first on PATH, which
// reads "D:" as a remote host.
const winTar = path.join(process.env.SystemRoot || "C:/Windows", "System32", "tar.exe");
const zipPath = path.join(deploy, "backend.zip");
const zip =
  process.platform === "win32"
    ? spawnSync(winTar, ["-a", "-c", "-f", zipPath, "-C", out, "."], {
        stdio: "inherit",
      })
    : spawnSync("zip", ["-qr", zipPath, "."], { cwd: out, stdio: "inherit" });
if (zip.error || zip.status !== 0) {
  console.error(`Zip failed. Zip the contents of ${out} manually.`);
  process.exit(1);
}

console.log(`Ready: ${zipPath}\nUpload it to cPanel and extract.`);
