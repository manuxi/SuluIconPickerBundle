#!/usr/bin/env node
/* Builds one SVG sprite + names.json per icon pool into src/Resources/public/icon-picker/<pool>/. */
const fs = require('fs');
const path = require('path');

const OUTPUT_ROOT = path.resolve(__dirname, '../src/Resources/public/icon-picker');

const POOLS = [
    {
        key: 'bootstrap-icons',
        package: 'bootstrap-icons',
        iconDir: 'icons',
        license: 'LICENSE',
    },
];

const ROOT_TAG = /<svg\b([^>]*)>([\s\S]*?)<\/svg>\s*$/i;
const VIEW_BOX = /\bviewBox="([^"]+)"/i;

function packageDir(name) {
    return path.dirname(require.resolve(`${name}/package.json`));
}

function toSymbol(poolKey, name, svg) {
    const match = svg.match(ROOT_TAG);
    if (!match) {
        throw new Error(`${poolKey}/${name}.svg: no <svg> root element`);
    }

    const viewBox = match[1].match(VIEW_BOX);
    if (!viewBox) {
        throw new Error(`${poolKey}/${name}.svg: missing viewBox`);
    }

    const body = match[2].replace(/\s*\n\s*/g, '').trim();

    return `<symbol id="${poolKey}-${name}" viewBox="${viewBox[1]}">${body}</symbol>`;
}

function buildPool(pool) {
    const sourceRoot = packageDir(pool.package);
    const sourceDir = path.join(sourceRoot, pool.iconDir);
    const version = require(path.join(sourceRoot, 'package.json')).version;

    const names = fs.readdirSync(sourceDir)
        .filter((file) => file.endsWith('.svg'))
        .map((file) => file.slice(0, -4))
        .sort();

    const symbols = names.map((name) => toSymbol(pool.key, name, fs.readFileSync(path.join(sourceDir, `${name}.svg`), 'utf8')));

    const targetDir = path.join(OUTPUT_ROOT, pool.key);
    fs.mkdirSync(targetDir, {recursive: true});

    fs.writeFileSync(
        path.join(targetDir, 'sprite.svg'),
        `<svg xmlns="http://www.w3.org/2000/svg">\n<!-- ${pool.package} ${version}, MIT, see LICENSE -->\n${symbols.join('\n')}\n</svg>\n`
    );
    fs.writeFileSync(path.join(targetDir, 'names.json'), JSON.stringify(names) + '\n');
    fs.copyFileSync(path.join(sourceRoot, pool.license), path.join(targetDir, 'LICENSE'));

    console.log(`${pool.key}: ${names.length} icons (${pool.package} ${version})`);
}

POOLS.forEach(buildPool);
