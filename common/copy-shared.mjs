#!/usr/bin/env node
import {cp, readdir, readFile, stat} from "node:fs/promises";
import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// 分发目标只在此维护。Sparrow 业务菜单分发给仓库内四站，不分发给凌卓。
const targets = {
    "sparrow-admin": {directory: "sparrow-admin", modules: ["common", "sparrow"]},
    "sparrow-coder": {directory: "sparrow-coder", modules: ["common", "sparrow"]},
    "sparrow-chat": {directory: "sparrow-chat", modules: ["common", "sparrow"]},
    "sparrow-passport": {directory: "sparrow-passport", modules: ["common", "sparrow"]},
    "ling-admin": {
        directory: "../shenzhen/everythingstore/lingcheuk-admin/front",
        modules: ["common"],
    },
    "ling-www": {
        directory: "../shenzhen/everythingstore/lingcheuk-www/front/www",
        modules: ["common"],
    },
};
const defaultTargets = Object.keys(targets);

async function requireDirectory(directory) {
    try {
        if ((await stat(directory)).isDirectory()) return;
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
    }
    throw new Error(`目录不存在：${directory}`);
}

async function verifyDirectory(source, destination) {
    let count = 0;
    for (const entry of await readdir(source, {withFileTypes: true})) {
        const sourcePath = resolve(source, entry.name);
        const destinationPath = resolve(destination, entry.name);
        if (entry.isDirectory()) {
            count += await verifyDirectory(sourcePath, destinationPath);
        } else if (entry.isFile()) {
            const [expected, actual] = await Promise.all([readFile(sourcePath), readFile(destinationPath)]);
            if (!expected.equals(actual)) throw new Error(`文件核对失败：${destinationPath}`);
            count++;
        } else {
            throw new Error(`源目录包含不支持的文件类型：${sourcePath}`);
        }
    }
    return count;
}

async function main() {
    const args = process.argv.slice(2);
    if (args.includes("--help")) {
        console.log(`用法：yarn --cwd common copy [站点 ...] [--dry-run]
站点：${Object.keys(targets).join(", ")}
不指定站点时，分发到全部六个站点；也可传入站点名称只分发指定站点。
源目录：common/src/common 与 common/src/sparrow；下游副本请勿手改。`);
        return;
    }
    const dryRun = args.includes("--dry-run");
    const names = args.filter(arg => arg !== "--dry-run");
    const selected = [...new Set(names.length ? names : defaultTargets)];
    const copies = [];

    // Validate the entire request before writing any target, including sources
    // that may have been omitted from a fresh checkout.
    for (const name of selected) {
        if (!Object.hasOwn(targets, name)) {
            throw new Error(`未知站点：${name}。可选：${Object.keys(targets).join(", ")}`);
        }
        const target = targets[name];
        const targetSrc = resolve(root, target.directory, "src");
        await requireDirectory(targetSrc);
        for (const module of target.modules) {
            const source = resolve(root, "common/src", module);
            await requireDirectory(source);
            copies.push({name, source, destination: resolve(targetSrc, module)});
        }
    }

    // 在写入前遍历源文件，拒绝链接等无法逐文件核对的内容。
    for (const source of new Set(copies.map(copy => copy.source))) {
        await verifyDirectory(source, source);
    }

    let verifiedFiles = 0;
    for (const {name, source, destination} of copies) {
        if (!dryRun) {
            // Copy into the explicit module directory: never nest src/src and
            // never remove unrelated files or application-owned directories.
            await cp(source, destination, {recursive: true, force: true});
            verifiedFiles += await verifyDirectory(source, destination);
        }
        console.log(`${dryRun ? "预览" : "已同步并核对"} ${name}: ${source} -> ${destination}`);
    }
    console.log(dryRun ? `预览完成：${selected.length} 个站点，未写入文件。`
        : `分发完成：${selected.length} 个站点，${copies.length} 个目录，${verifiedFiles} 个文件已核对。`);
}

main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
});
