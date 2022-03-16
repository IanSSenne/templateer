const path = require("path");
const barrelPath = path.resolve(process.argv[2], "index.ts");
const name = process.argv[3];
const fs = require("fs");
if (!fs.existsSync(barrelPath)) {
  fs.writeFileSync(barrelPath, ``);
}
const barrel = new Set(fs.readFileSync(barrelPath, "utf8").split("\n"));
barrel.add(`export * from "./${name}";`);
fs.writeFileSync(barrelPath, [...barrel].join("\n"));
