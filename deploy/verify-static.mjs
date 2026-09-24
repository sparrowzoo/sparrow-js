#!/usr/bin/env node
// Run after successful production builds: node deploy/verify-static.mjs [www admin im passport]
// Checks exported application pages, locale HTML, RSC data and referenced local resources.
import {existsSync, readFileSync, readdirSync, statSync} from "node:fs";
import {dirname, join, relative, resolve, sep} from "node:path";
import {fileURLToPath} from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const projects = {
    www: "common",
    admin: "react-next-admin",
    im: "react-next-im",
    passport: "react-next-passport",
};
const hosts = Object.fromEntries(Object.keys(projects).map((site) => [`${site}.sparrowzoo.com`, site]));
hosts["sparrowzoo.com"] = "www";
hosts["coder.sparrowzoo.com"] = "admin";
const selected = process.argv.slice(2);
const sites = selected.length ? selected : Object.keys(projects);
const errors = new Set();
let pageCount = 0;
let referenceCount = 0;

function* files(directory) {
    for (const entry of readdirSync(directory, {withFileTypes: true})) {
        const file = join(directory, entry.name);
        if (entry.isDirectory()) {
            if (!entry.name.startsWith("_")) yield* files(file);
        } else if (entry.isFile()) {
            yield file;
        }
    }
}

function isFile(file) {
    return existsSync(file) && statSync(file).isFile();
}

function exportedFile(site, pathname) {
    const out = join(root, projects[site], "out");
    const file = resolve(out, `.${decodeURIComponent(pathname)}`);
    if (file !== out && !file.startsWith(out + sep)) return undefined;
    if (isFile(file)) return file;
    const index = join(file, "index.html");
    return isFile(index) ? index : undefined;
}

function decodeAttribute(value) {
    return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"')
        .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
        .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

for (const site of sites) {
    if (!(site in projects)) {
        errors.add(`Unknown site: ${site}`);
        continue;
    }
    const project = join(root, projects[site]);
    const app = join(project, "src/app");
    const out = join(project, "out");
    if (!existsSync(out)) {
        errors.add(`${site}: missing out/; run a successful production build first`);
        continue;
    }
    for (const required of ["index.html", "404.html"]) {
        if (!isFile(join(out, required))) errors.add(`${site}: missing out/${required}`);
    }
    const next = JSON.parse(readFileSync(join(project, "node_modules/next/package.json"), "utf8"));
    if (!next.version.startsWith("15.")) errors.add(`${site}: installed Next.js ${next.version}, expected 15.x`);

    const routes = new Set(["/"]);
    for (const file of files(app)) {
        if (!/[/\\]page\.[jt]sx?$/.test(file)) continue;
        const segments = relative(app, dirname(file)).split(sep).filter(Boolean)
            .filter((segment) => !segment.startsWith("("));
        if (segments.some((segment) => segment.includes("[") && segment !== "[locale]")) {
            errors.add(`${site}: verifier needs explicit static params for ${relative(app, file)}`);
            continue;
        }
        for (const locale of segments.includes("[locale]") ? ["zh", "en"] : [undefined]) {
            const path = segments.map((segment) => segment === "[locale]" ? locale : segment).join("/");
            routes.add(path ? `/${path}/` : "/");
        }
    }

    for (const route of routes) {
        const file = exportedFile(site, route);
        if (!file) {
            errors.add(`${site}: missing application route ${route}`);
            continue;
        }
        pageCount++;
        if (!isFile(join(dirname(file), "index.txt"))) errors.add(`${site}: missing App Router data for ${route}`);
        const html = readFileSync(file, "utf8");
        const locale = /^\/(zh|en)\//.exec(route)?.[1];
        if (locale && !new RegExp(`<html\\b[^>]*\\blang=["']${locale}["']`).test(html)) {
            errors.add(`${site}: wrong or missing html lang on ${route}`);
        }
        for (const match of html.matchAll(/\b(?:src|href)=(['"])(.*?)\1/g)) {
            const value = decodeAttribute(match[2]);
            if (!value || value.startsWith("#") || /^(?:data|mailto|tel|javascript):/i.test(value)) continue;
            let url;
            try {
                url = new URL(value, `http://${site}.sparrowzoo.com${route}`);
            } catch {
                errors.add(`${site}${route}: malformed URL ${value}`);
                continue;
            }
            if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
                errors.add(`${site}${route}: development URL ${value}`);
                continue;
            }
            const target = hosts[url.hostname];
            if (!target) continue;
            referenceCount++;
            if (url.protocol !== "http:") errors.add(`${site}${route}: expected HTTP site URL ${value}`);
            if (url.pathname.startsWith("/_next/image")) errors.add(`${site}${route}: runtime image optimizer URL ${value}`);
            try {
                if (!exportedFile(target, url.pathname)) errors.add(`${site}${route}: missing ${target} resource ${url.pathname}`);
            } catch {
                errors.add(`${site}${route}: invalid escaped pathname ${url.pathname}`);
            }
        }
    }
    console.log(`${site}: ${routes.size} application routes checked (Next ${next.version})`);
}

if (errors.size) {
    for (const error of errors) console.error(`ERROR ${error}`);
    console.error(`${errors.size} failure(s); checked ${pageCount} HTML pages and ${referenceCount} site references`);
    process.exitCode = 1;
} else {
    console.log(`PASS ${pageCount} HTML pages, locale markers, route data and ${referenceCount} site references`);
}
