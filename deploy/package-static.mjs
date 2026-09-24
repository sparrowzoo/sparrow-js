#!/usr/bin/env node
import {spawnSync} from "node:child_process";
import {cpSync, existsSync, mkdirSync, readFileSync, writeFileSync} from "node:fs";
import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {createHash} from "node:crypto";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const release = process.argv[2] || new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(release) || release.includes("..") || process.argv.length > 3) {
    throw new Error("Usage: node deploy/package-static.mjs [unique-release-id]");
}
const target = resolve(root, "artifacts", release);
const archive = target + ".tar.gz";
const serverScript = resolve(root, "deploy/server-release.sh");
const serverHelper = resolve(root, "artifacts/server-release.sh");
if (!existsSync(serverScript)) throw new Error("Missing deploy/server-release.sh");
if ([target, archive, archive + ".sha256"].some(existsSync)) throw new Error(`Release already exists: ${release}`);
function run(command, args) {
    const result = spawnSync(command, args, {
        cwd: root,
        stdio: "inherit",
        // macOS metadata entries (._*) are not deployment files.
        env: command === "tar" ? {...process.env, COPYFILE_DISABLE: "1"} : process.env
    });
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status || 1);
}
run(process.execPath, ["deploy/verify-static.mjs"]);
mkdirSync(target, {recursive: true});
const projects = {www: "common", admin: "react-next-admin", im: "react-next-im", passport: "react-next-passport"};
const manifest = {release, createdAt: new Date().toISOString(), sites: {}};
for (const [site, project] of Object.entries(projects)) {
    const base = resolve(root, project);
    const buildId = readFileSync(resolve(base, ".next/BUILD_ID"), "utf8").trim();
    const next = JSON.parse(readFileSync(resolve(base, "node_modules/next/package.json"), "utf8")).version;
    cpSync(resolve(base, "out"), resolve(target, site), {recursive: true});
    manifest.sites[site] = {project, next, buildId};
}
cpSync(resolve(root, "deploy/nginx"), resolve(target, "nginx"), {recursive: true});
mkdirSync(resolve(target, "tools"));
cpSync(serverScript, resolve(target, "tools/server-release.sh"));
writeFileSync(resolve(target, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
run("tar", ["--exclude=.DS_Store", "-czf", archive, "-C", target, "."]);
const hash = createHash("sha256").update(readFileSync(archive)).digest("hex");
writeFileSync(archive + ".sha256", `${hash}  ${release}.tar.gz\n`);
cpSync(serverScript, serverHelper);
console.log(`发布编号：${release}\n请将以下三个文件上传到服务器同一个目录：\n${archive}\n${archive}.sha256\n${serverHelper}\nSHA-256: ${hash}`);
