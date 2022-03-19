import chalk from "chalk";
import { exec } from "child_process";
import { program } from "commander";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path, { dirname } from "path";
import prompts from "prompts";
import ejs from "ejs";
program
  .version("0.0.1")
  .description("Templateer CLI")
  .argument("<template>", "Template to use")
  //   .option("-t <name> --template <name>", "Template name")
  .parse(process.argv);
if (process.argv.length < 3) {
  program.outputHelp();
  process.exit(1);
}

const [template] = program.args;
const cwd = (dir: string) => path.resolve(process.cwd(), dir);
const templatePath = cwd(`.template/${template}`);
if (!existsSync(templatePath)) {
  console.log(chalk.red(`no template found at ${templatePath}`));
  process.exit(1);
}
let info: Record<string, any> = {
  Root: templatePath,
};
let meta: {
  insertAt: string;
  files: string[];
  postCreationActions?: string[];
  prompts: Array<prompts.PromptObject>;
  defaultPlaceholders?: Record<string, any>;
};
try {
  meta = require(cwd(`.template/${template}/.meta.json`));
} catch (e) {
  try {
    meta = require(cwd(`.template/${template}/.meta.js`));
  } catch (e) {
    console.log(chalk.red(`no meta found at ${templatePath}`));
    process.exit(1);
  }
}
if (meta.defaultPlaceholders) {
  info = { ...info, ...meta.defaultPlaceholders };
}
function fixup(str: string) {
  Object.entries(info).forEach(([key, value]) => {
    str = str.replace(new RegExp(`\\$${key}`, "g"), String(value));
  });
  return str;
}
prompts(meta.prompts || [], {
  onCancel() {
    console.log(chalk.red("cancelled"));
    process.exit(0);
  },
}).then(async (answers) => {
  info = { ...info, ...answers };
  info.Target = cwd(fixup(meta.insertAt));
  mkdirSync(info.Target, { recursive: true });
  for (const file of meta.files) {
    const name = fixup(file);
    const target = path.resolve(info.Target, name);
    mkdirSync(dirname(target), { recursive: true });
    const source = path.resolve(templatePath, file);
    writeFileSync(
      target,
      ejs.render(
        readFileSync(source, "utf8"),
        Object.fromEntries(Object.entries(info).map((_) => ["$" + _[0], _[1]])),
        {
          async: false,
        }
      )
    );
  }
  if (meta.postCreationActions) {
    for (const action of meta.postCreationActions) {
      const cmd = fixup(action);
      console.log(chalk.green(`running ${cmd}`));
      await new Promise((resolve, reject) => {
        const cp = exec(cmd, { cwd: info.Target });
        cp.stdout.on("data", (data) => {
          process.stdout.write(data);
        });
        cp.stderr.on("data", (data) => {
          process.stderr.write(data);
        });
        cp.on("close", (code) => {
          if (code !== 0) {
            console.log(chalk.red(`error running ${cmd}`));
            reject();
          }
          resolve(code);
        });
      });
    }
  }
});
