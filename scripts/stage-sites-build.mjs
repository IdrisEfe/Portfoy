import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
cpSync(".open-next", "dist", { recursive: true });
mkdirSync("dist/server", { recursive: true });
writeFileSync("dist/server/index.js", 'export { default } from "../worker.js";\n', "utf8");
cpSync(".openai", "dist/.openai", { recursive: true });
