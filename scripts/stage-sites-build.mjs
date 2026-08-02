import {
  cpSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

function materializeSymlinks(directory) {
  for (const entry of readdirSync(directory)) {
    const entryPath = join(directory, entry);
    const stat = lstatSync(entryPath);

    if (stat.isSymbolicLink()) {
      const target = realpathSync(entryPath);
      const targetStat = lstatSync(target);
      rmSync(entryPath, { recursive: targetStat.isDirectory(), force: true });
      cpSync(target, entryPath, {
        recursive: targetStat.isDirectory(),
        dereference: true,
      });
    }

    if (lstatSync(entryPath).isDirectory()) {
      materializeSymlinks(entryPath);
    }
  }
}

rmSync("dist", { recursive: true, force: true });
cpSync(".open-next", "dist", { recursive: true, dereference: true });
materializeSymlinks("dist");
mkdirSync("dist/server", { recursive: true });
writeFileSync("dist/server/index.js", 'export { default } from "../worker.js";\n', "utf8");
cpSync(".openai", "dist/.openai", { recursive: true });
