// Minimal parser for phpMyAdmin/mysqldump-style `INSERT INTO ... VALUES
// (...), (...), ...;` statements, used to migrate blog data from a static
// .sql export (no live MySQL connection available for that source, unlike
// the product/category migration which reads from a live Magento DB).
//
// Handles exactly what this class of dump produces:
//   - multiple VALUES tuples per statement, across multiple INSERT
//     statements for the same table
//   - single-quoted strings with backslash escapes (\', \\, \n, \r, \t) and
//     doubled '' escapes
//   - NULL / numeric / bare literals
// It does not attempt to be a general SQL parser — anything outside this
// shape (sub-selects, function calls, etc.) will not appear in this kind of
// dump.

function parseValueList(text) {
  // text is the inside of one "(...)" tuple, e.g. `1, 'foo, bar', NULL`
  const values = [];
  let i = 0;
  const n = text.length;
  while (i < n) {
    while (i < n && /[\s,]/.test(text[i])) i++;
    if (i >= n) break;

    if (text[i] === "'") {
      let out = "";
      i++;
      while (i < n) {
        const ch = text[i];
        if (ch === "\\" && i + 1 < n) {
          const next = text[i + 1];
          const map = { n: "\n", r: "\r", t: "\t", "0": "\0" };
          out += next in map ? map[next] : next;
          i += 2;
          continue;
        }
        if (ch === "'") {
          if (text[i + 1] === "'") {
            out += "'";
            i += 2;
            continue;
          }
          i++;
          break;
        }
        out += ch;
        i++;
      }
      values.push(out);
    } else {
      let start = i;
      while (i < n && text[i] !== ",") i++;
      const raw = text.slice(start, i).trim();
      if (raw.toUpperCase() === "NULL") values.push(null);
      else if (raw !== "" && !Number.isNaN(Number(raw))) values.push(Number(raw));
      else values.push(raw);
    }
  }
  return values;
}

// Splits "(a, 'b, c'), (d, 'e')" into ["a, 'b, c'", "d, 'e'"] respecting
// quoted strings/escapes so commas and parens inside string values don't
// break tuple boundaries.
function splitTuples(valuesBlock) {
  const tuples = [];
  let depth = 0;
  let inString = false;
  let start = -1;
  for (let i = 0; i < valuesBlock.length; i++) {
    const ch = valuesBlock[i];
    if (inString) {
      if (ch === "\\") i++;
      else if (ch === "'") inString = false;
      continue;
    }
    if (ch === "'") {
      inString = true;
    } else if (ch === "(") {
      if (depth === 0) start = i + 1;
      depth++;
    } else if (ch === ")") {
      depth--;
      if (depth === 0 && start !== -1) {
        tuples.push(valuesBlock.slice(start, i));
        start = -1;
      }
    }
  }
  return tuples;
}

/**
 * Parses every `INSERT INTO \`tableName\` (\`col1\`, \`col2\`, ...) VALUES
 * (...), (...);` statement for the given table out of a raw SQL dump and
 * returns an array of plain objects keyed by column name.
 */
export function parseInserts(sql, tableName) {
  const stmtRe = new RegExp(
    "INSERT INTO `" +
      tableName +
      "` \\(([^)]*)\\)\\s*VALUES\\s*\\n([\\s\\S]*?);\\s*(?:\\n|$)",
    "g",
  );

  const rows = [];
  let match;
  while ((match = stmtRe.exec(sql))) {
    const columns = match[1].split(",").map((c) => c.trim().replace(/`/g, ""));
    const tuples = splitTuples(match[2]);
    for (const tuple of tuples) {
      const values = parseValueList(tuple);
      const row = {};
      columns.forEach((col, idx) => {
        row[col] = values[idx] ?? null;
      });
      rows.push(row);
    }
  }
  return rows;
}
