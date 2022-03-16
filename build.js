const esbuild = require("esbuild");
const isDev = process.argv.includes("dev");
esbuild.build({
  entryPoints: ["./src/cli.ts"],
  outfile: "./lib/cli.js",
  bundle: true,
  metafile: true,
  minify: !isDev,
  watch: isDev,
  sourcemap: isDev,
  platform: "node",
  banner: {
    js: "#!/usr/bin/env node",
  },
});
