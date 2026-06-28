const fs = require("fs");
const path = require("path");

const roots = [
  path.join(__dirname, "..", "components"),
  path.join(__dirname, "..", "src", "views"),
];

const importPattern =
  /import\s+(\w+)\s+from\s+["'](?:\.\.\/)+public\/images\/([^"']+)["'];?\s*\n/g;

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, files);
    else if (entry.name.endsWith(".jsx")) files.push(fullPath);
  }
  return files;
}

for (const root of roots) {
  for (const file of walk(root)) {
    let content = fs.readFileSync(file, "utf8");
    const replacements = [];
    let match;

    while ((match = importPattern.exec(content)) !== null) {
      replacements.push({
        full: match[0],
        name: match[1],
        file: match[2],
      });
    }

    if (!replacements.length) continue;

    for (const item of replacements) {
      content = content.replace(item.full, "");
    }

    const constants = replacements
      .map((item) => `const ${item.name} = "/images/${item.file}";`)
      .join("\n");

    const useClient = content.startsWith('"use client"') || content.startsWith("'use client'");
    if (useClient) {
      const firstLineEnd = content.indexOf("\n") + 1;
      content = content.slice(0, firstLineEnd) + constants + "\n" + content.slice(firstLineEnd);
    } else {
      content = constants + "\n" + content;
    }

    fs.writeFileSync(file, content);
    console.log("fixed", file);
  }
}
