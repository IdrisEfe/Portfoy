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
import { dirname, join, resolve } from "node:path";
import { buildSync } from "esbuild";

function patchNextBrowserLogger() {
  const handlerPath = ".open-next/server-functions/default/handler.mjs";
  let handler = readFileSync(handlerPath, "utf8");
  const knownBuiltins = new Set(
    builtinModules.map((specifier) => specifier.replace(/^node:/, "")),
  );
  const requirePattern =
    /\brequire\((["'])((?:node:)?[@a-zA-Z0-9_./-]+)\1\)/g;
  const turbopackExternalPattern =
    /\b[a-zA-Z_$][\w$]*\.x\((["'])([@a-zA-Z0-9_./:-]+)\1,\(\)=>[a-zA-Z_$][\w$]*\((["'])\2\3\)(?:,!0|,true|,!1|,false)?\)/g;
  const replacements = new Map();

  const registerExternal = (specifier) => {
    const normalized = specifier.replace(/^node:/, "");
    const isBuiltin = knownBuiltins.has(normalized);
    const isPackageImport =
      !specifier.startsWith(".") &&
      !specifier.startsWith("/") &&
      !/^[a-zA-Z]:/.test(specifier);

    if ((isBuiltin || isPackageImport) && !replacements.has(specifier)) {
      replacements.set(specifier, {
        identifier: `__iesyExternal${replacements.size}`,
        isBuiltin,
        normalized,
      });
    }
  };

  const turbopackRuntimeExternals = [
    "next/dist/compiled/@opentelemetry/api",
    "next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",
    "next/dist/compiled/next-server/app-route-turbo.runtime.prod.js",
    "next/dist/server/app-render/action-async-storage.external.js",
    "next/dist/server/app-render/after-task-async-storage.external.js",
    "next/dist/server/app-render/dynamic-access-async-storage.external.js",
    "next/dist/server/app-render/work-async-storage.external.js",
    "next/dist/server/app-render/work-unit-async-storage.external.js",
    "next/dist/shared/lib/no-fallback-error.external.js",
  ];

  for (const specifier of turbopackRuntimeExternals) {
    registerExternal(specifier);
  }

  for (const match of handler.matchAll(requirePattern)) {
    registerExternal(match[2]);
  }

  for (const match of handler.matchAll(turbopackExternalPattern)) {
    registerExternal(match[2]);
  }

  if (replacements.size === 0) {
    return;
  }

  const imports = [];
  const packageExternals = [];
  for (const [specifier, replacement] of replacements) {
    const { identifier, isBuiltin, normalized } = replacement;
    const escapedSpecifier = specifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const externalRequirePattern = new RegExp(
      `\\b[a-zA-Z_$][\\w$]*\\.x\\((["'])${escapedSpecifier}\\1,\\(\\)=>[a-zA-Z_$][\\w$]*\\((["'])${escapedSpecifier}\\2\\)(?:,!0|,true|,!1|,false)?\\)`,
      "g",
    );
    handler = handler.replace(externalRequirePattern, identifier);

    const pattern = new RegExp(
      `\\brequire\\((["'])${escapedSpecifier}\\1\\)`,
      "g",
    );
    handler = handler.replace(pattern, identifier);

    if (isBuiltin && normalized === "inspector") {
      imports.push(`const ${identifier} = { url: () => undefined };`);
    } else if (isBuiltin) {
      imports.push(
        `import * as ${identifier}Module from "node:${normalized}";`,
        `const ${identifier} = { ...(${identifier}Module.default ?? ${identifier}Module) };`,
      );
    } else {
      const exportName = `iesyBundledExternal${packageExternals.length}`;
      packageExternals.push({ exportName, specifier });
      imports.push(
        `import { ${exportName} as ${identifier} } from "./__iesy-externals.mjs";`,
      );
    }
  }

  if (packageExternals.length > 0) {
    const entrySource = packageExternals
      .flatMap(({ exportName, specifier }, index) => [
        `import * as iesyPackage${index} from ${JSON.stringify(specifier)};`,
        `export const ${exportName} = iesyPackage${index}.default ?? iesyPackage${index};`,
      ])
      .join("\n");
    buildSync({
      stdin: {
        contents: entrySource,
        resolveDir: resolve(dirname(handlerPath)),
        sourcefile: "iesy-externals-entry.mjs",
      },
      outfile: resolve(dirname(handlerPath), "__iesy-externals.mjs"),
      bundle: true,
      format: "esm",
      minify: true,
      platform: "node",
      target: "es2022",
      banner: {
        js: 'import { createRequire as __iesyCreateRequire } from "node:module"; const require = __iesyCreateRequire(import.meta.url);',
      },
      alias: {
        "@opentelemetry/api": "next/dist/compiled/@opentelemetry/api",
      },
      external: [
        ...knownBuiltins,
        ...[...knownBuiltins].map((specifier) => `node:${specifier}`),
      ],
    });
  }

  const externalEntries = [...replacements].map(
    ([specifier, { identifier }]) =>
      `[${JSON.stringify(specifier)}, ${identifier}]`,
  );
  imports.push(
    `const __iesyExternalModules = new Map([${externalEntries.join(",")}]);`,
  );

  handler = handler.replace(
    /function externalRequire\([^)]*\)\s*\{/,
    (match) =>
      `${match}if (__iesyExternalModules.has(arguments[0])) return __iesyExternalModules.get(arguments[0]);console.error("IESY_EXTERNAL_REQUIRE_MISS", arguments[0]);`,
  );
  if (!handler.includes("__iesyExternalModules.has(arguments[0])")) {
    throw new Error("Could not patch the Turbopack external module loader.");
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
