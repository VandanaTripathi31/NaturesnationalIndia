/* eslint-disable @typescript-eslint/no-require-imports */
// Collects everything cPanel's Node.js app needs into ./cpanel-deploy/build
// and zips it to ./cpanel-deploy/dashboard.zip.
// Run after `npm run build`. node_modules is NOT copied: run "NPM Install"
// in cPanel so native modules (sharp) are built for the Linux server.
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.join(__dirname, "..");
const deploy = path.join(root, "cpanel-deploy");
const out = path.join(deploy, "build");

if (!fs.existsSync(path.join(root, ".next", "BUILD_ID"))) {
  console.error("No production build found. Run `npm run build` first.");
  process.exit(1);
}

fs.rmSync(deploy, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

fs.cpSync(path.join(root, ".next"), path.join(out, ".next"), {
  recursive: true,
  filter: (src) => !src.includes(`${path.sep}.next${path.sep}cache`),
});
fs.cpSync(path.join(root, "public"), path.join(out, "public"), {
  recursive: true,
});
for (const file of ["server.js", "next.config.ts"]) {
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

// Zip build/'s contents (not the folder itself) into cpanel-deploy/dashboard.zip.
// Windows ships bsdtar (writes zip with forward slashes, unlike
// Compress-Archive in PowerShell 5.1); elsewhere use the `zip` CLI.
// Use the system bsdtar explicitly: Git Bash puts GNU tar first on PATH, which
// reads "D:" as a remote host.
const winTar = path.join(process.env.SystemRoot || "C:/Windows", "System32", "tar.exe");
const zipPath = path.join(deploy, "dashboard.zip");
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
