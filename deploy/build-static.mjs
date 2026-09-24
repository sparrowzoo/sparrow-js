#!/usr/bin/env node
import {spawnSync} from "node:child_process";
import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const projects = ["common", "react-next-admin", "react-next-im", "react-next-passport"];
const args = process.argv.slice(2);
if (args.some((arg) => arg !== "--skip-install")) throw new Error("Usage: node deploy/build-static.mjs [--skip-install]");
if (Number(process.versions.node.split(".")[0]) < 22) throw new Error("Node.js 22 or newer is required");
function run(command, args, cwd = root) {
    const result = spawnSync(command, args, {cwd, stdio: "inherit", env: {...process.env, NEXT_TELEMETRY_DISABLED: "1"}});
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status || 1);
}
for (const project of projects) {
    const cwd = resolve(root, project);
    if (!args.includes("--skip-install")) run("npm", ["ci", "--no-audit", "--no-fund"], cwd);
    if (project !== "common") run("npm", ["run", "copy"], cwd);
    run("npm", ["run", "build"], cwd);
}
run(process.execPath, ["scripts/check-storage-protocol.cjs"]);
run(process.execPath, ["deploy/verify-static.mjs"]);
