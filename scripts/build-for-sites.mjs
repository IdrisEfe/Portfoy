import { spawnSync } from "node:child_process";
import { join } from "node:path";

const isWindows = process.platform === "win32";
const executable = (name) =>
  join("node_modules", ".bin", isWindows ? `${name}.cmd` : name);

function run(command, args, env = process.env) {
  const result = spawnSync(command, args, {
    env,
    stdio: "inherit",
    shell: isWindows,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (process.env.IESY_OPENNEXT_INNER_BUILD === "1") {
  run(executable("next"), ["build", "--webpack"]);
} else {
  run(executable("opennextjs-cloudflare"), ["build"], {
    ...process.env,
    IESY_OPENNEXT_INNER_BUILD: "1",
  });

  if (!process.argv.includes("--no-stage")) {
    run(process.execPath, ["scripts/stage-sites-build.mjs"]);
  }
}
