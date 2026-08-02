import {
  cpSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { builtinModules } from "node:module";
import { join } from "node:path";

function patchNextBrowserLogger() {
  const handlerPath = ".open-next/server-functions/default/handler.mjs";
  let handler = readFileSync(handlerPath, "utf8");
  const knownBuiltins = new Set(
    builtinModules.map((specifier) => specifier.replace(/^node:/, "")),
  );
  const requirePattern =
    /\brequire\((["'])((?:node:)?[a-zA-Z0-9_./-]+)\1\)/g;
  const replacements = new Map();

  for (const match of handler.matchAll(requirePattern)) {
    const normalized = match[2].replace(/^node:/, "");
    if (knownBuiltins.has(normalized) && !replacements.has(normalized)) {
      replacements.set(normalized, `__iesyNodeBuiltin${replacements.size}`);
    }
  }

  if (replacements.size === 0) {
    return;
  }

  const imports = [];
  for (const [specifier, identifier] of replacements) {
    const escapedSpecifier = specifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(
      `\\brequire\\((["'])(?:node:)?${escapedSpecifier}\\1\\)`,
      "g",
    );
    handler = handler.replace(pattern, identifier);

    if (specifier === "inspector") {
      imports.push(`const ${identifier} = { url: () => undefined };`);
    } else {
      imports.push(
        `import * as ${identifier}Module from "node:${specifier}";`,
        `const ${identifier} = { ...${identifier}Module };`,
      );
    }
  }
  handler = imports.join("\n") + "\n" + handler;
  writeFileSync(handlerPath, handler, "utf8");
}

function materializeSymlinks(directory) {
  for (const entry of readdirSync(directory)) {
    const entryPath = join(directory, entry);
    const stat = lstatSync(entryPath);

    if (stat.isSymbolicLink()) {
      let target;
      try {
        target = realpathSync(entryPath);
      } catch (error) {
        if (error?.code === "ENOENT") {
          rmSync(entryPath, { force: true });
          continue;
        }
        throw error;
      }
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

patchNextBrowserLogger();
rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/server", { recursive: true });
cpSync(".open-next", "dist/server", { recursive: true, dereference: true });
materializeSymlinks("dist/server");
writeFileSync("dist/server/index.js", 'export { default } from "./worker.js";\n', "utf8");
cpSync(".open-next/assets", "dist/assets", { recursive: true, dereference: true });
cpSync(".openai", "dist/.openai", { recursive: true });
