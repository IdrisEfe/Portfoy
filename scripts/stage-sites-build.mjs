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
import { join } from "node:path";

function patchNextBrowserLogger() {
  const handlerPath = ".open-next/server-functions/default/handler.mjs";
  let handler = readFileSync(handlerPath, "utf8");
  const replacements = [
    [/(?:\brequire\()(["'])(?:node:)?fs\1\)/g, "__iesyNodeFs"],
    [/(?:\brequire\()(["'])(?:node:)?path\1\)/g, "__iesyNodePath"],
    [/(?:\brequire\()(["'])(?:node:)?util\1\)/g, "__iesyNodeUtil"],
    [/(?:\brequire\()(["'])node:crypto\1\)/g, "__iesyNodeCrypto"],
    [/(?:\brequire\()(["'])node:timers\1\)/g, "__iesyNodeTimers"],
    [
      /(?:\brequire\()(["'])node:timers\/promises\1\)/g,
      "__iesyNodeTimersPromises",
    ],
    [/(?:\brequire\()(["'])node:inspector\1\)/g, "__iesyNodeInspector"],
  ];

  if (!replacements.some(([pattern]) => pattern.test(handler))) {
    return;
  }

  for (const [pattern, replacement] of replacements) {
    handler = handler.replace(pattern, replacement);
  }
  handler =
    'import * as __iesyNodeFs from "node:fs";\n' +
    'import * as __iesyNodePath from "node:path";\n' +
    'import * as __iesyNodeUtil from "node:util";\n' +
    'import * as __iesyNodeCrypto from "node:crypto";\n' +
    'import * as __iesyNodeTimersModule from "node:timers";\n' +
    'import * as __iesyNodeTimersPromisesModule from "node:timers/promises";\n' +
    "const __iesyNodeTimers = { ...__iesyNodeTimersModule };\n" +
    "const __iesyNodeTimersPromises = { ...__iesyNodeTimersPromisesModule };\n" +
    "const __iesyNodeInspector = { url: () => undefined };\n" +
    handler;
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
