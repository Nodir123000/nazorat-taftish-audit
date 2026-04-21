const fs = require('fs');
const path = require('path');

const mapDir = path.join(__dirname, 'components/map-data');

// Helper to update bbox with a coordinate
function updateBBox(bbox, x, y) {
    if (x < bbox.minX) bbox.minX = x;
    if (x > bbox.maxX) bbox.maxX = x;
    if (y < bbox.minY) bbox.minY = y;
    if (y > bbox.maxY) bbox.maxY = y;
}

// Simple regex to extract coordinates from SVG path d attribute
// Matches numbers that might be coordinates
function getBounds(pathData) {
    const bbox = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    const numbers = pathData.match(/-?[\d\.]+/g);

    if (!numbers) return null;

    // SVG paths usually alternate x, y, but commands make it tricky.
    // For bbox estimation, treating all numbers as potential coords is a heuristic,
    // but relative commands (lowercase) would break this. 
    // Assuming mostly absolute coordinates (uppercase commands) based on previous file views.

    // Better regex for absolute commands M, L, H, V, C, Q, S, T, Z
    // Actually, simpler: if the files predominantly use absolute coords, we can scan pairs.
    // Most of the path data I saw was "M..., L..., C...".

    // Let's assume absolute coordinates for safety based on the files seen.
    // We will parse tokens.

    let currentX = 0;
    let currentY = 0;

    // Minimal parser to handle simple absolute paths.
    // Splitting by command letters
    const commands = pathData.split(/([a-zA-Z])/).filter(Boolean);

    for (let i = 0; i < commands.length; i += 2) {
        const cmd = commands[i];
        const args = commands[i + 1];
        if (!args) continue;

        const nums = args.match(/-?[\d\.]+/g)?.map(Number) || [];

        // Handle common absolute commands
        if (cmd === 'M' || cmd === 'L') {
            for (let j = 0; j < nums.length; j += 2) {
                updateBBox(bbox, nums[j], nums[j + 1]);
            }
        } else if (cmd === 'H') {
            for (let x of nums) updateBBox(bbox, x, bbox.minY === Infinity ? 0 : bbox.minY); // Rough
        } else if (cmd === 'V') {
            for (let y of nums) updateBBox(bbox, bbox.minX === Infinity ? 0 : bbox.minX, y);
        } else if (cmd === 'C') {
            for (let j = 0; j < nums.length; j += 2) {
                updateBBox(bbox, nums[j], nums[j + 1]);
            }
        } else if (cmd === 'Z' || cmd === 'z') {
            // close path
        }
        // Add others if needed
    }

    // Fallback: Just min/max of all numbers if absolute logic fails or is too complex?
    // The previous simple heuristic "all numbers" matches relative offsets too, which is bad.
    // But since the files seemed to be "M x y L x y", mostly absolute...

    // Check if bbox is still Infinity
    if (bbox.minX === Infinity) {
        // Fallback to simple regex if parser failed
        const allNums = pathData.match(/-?[\d\.]+/g).map(Number);
        for (let j = 0; j < allNums.length; j += 2) {
            if (j + 1 < allNums.length) updateBBox(bbox, allNums[j], allNums[j + 1]);
        }
    }

    return bbox;
}

const files = fs.readdirSync(mapDir).filter(f => f.endsWith('.ts'));

console.log('Region, MinX, MinY, MaxX, MaxY, Width, Height');

files.forEach(file => {
    const content = fs.readFileSync(path.join(mapDir, file), 'utf8');
    const regionName = file.replace('-district-paths.ts', '');

    // Extract paths object content
    // Looks for: export const ... = { ... };
    const match = content.match(/=\s*{([\s\S]*?)};/);
    if (!match) return;

    const body = match[1];

    // Extract individual path strings: key: "path",
    // Regex: \w+:\s*"([^"]+)"
    const pathRegex = /\w+:\s*"([^"]+)"/g;
    let pathMatch;

    const regionBBox = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    let hasPaths = false;

    while ((pathMatch = pathRegex.exec(body)) !== null) {
        const d = pathMatch[1];
        const bbox = getBounds(d);
        if (bbox) {
            hasPaths = true;
            if (bbox.minX < regionBBox.minX) regionBBox.minX = bbox.minX;
            if (bbox.minY < regionBBox.minY) regionBBox.minY = bbox.minY;
            if (bbox.maxX > regionBBox.maxX) regionBBox.maxX = bbox.maxX;
            if (bbox.maxY > regionBBox.maxY) regionBBox.maxY = bbox.maxY;
        }
    }

    if (hasPaths) {
        const w = regionBBox.maxX - regionBBox.minX;
        const h = regionBBox.maxY - regionBBox.minY;
        // Adding a larger padding (e.g. 25 units) to prevent clipping
        const padding = 25;
        const viewBox = `${Math.floor(regionBBox.minX - padding)} ${Math.floor(regionBBox.minY - padding)} ${Math.ceil(w + padding * 2)} ${Math.ceil(h + padding * 2)}`;

        console.log(`"${regionName}": "${viewBox}", // ${Math.floor(regionBBox.minX)}, ${Math.floor(regionBBox.minY)} -> ${Math.floor(regionBBox.maxX)}, ${Math.floor(regionBBox.maxY)}`);

    } else {
        console.log(`"${regionName}": No paths found`);
    }
});

// Added logic for Global Country View
const countryFile = 'uzbekistan-region-paths.ts';
if (fs.existsSync(path.join(mapDir, countryFile))) {
    const content = fs.readFileSync(path.join(mapDir, countryFile), 'utf8');
    const regionBBox = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    const pathRegex = /\w+:\s*"([^"]+)"/g;
    let pathMatch;
    let hasPaths = false;

    // We scan the whole file. It contains keys like UZTK, UZTO etc.
    // matches "UZTK": "..."
    // Because the file format is slightly different (export const regionPaths = { ... }), 
    // we need to match inside the object.

    // Naive match of all path strings in the file should work since they are all part of the country map.
    while ((pathMatch = pathRegex.exec(content)) !== null) {
        const d = pathMatch[1];
        const bbox = getBounds(d);
        if (bbox) {
            hasPaths = true;
            if (bbox.minX < regionBBox.minX) regionBBox.minX = bbox.minX;
            if (bbox.minY < regionBBox.minY) regionBBox.minY = bbox.minY;
            if (bbox.maxX > regionBBox.maxX) regionBBox.maxX = bbox.maxX;
            if (bbox.maxY > regionBBox.maxY) regionBBox.maxY = bbox.maxY;
        }
    }

    if (hasPaths) {
        const w = regionBBox.maxX - regionBBox.minX;
        const h = regionBBox.maxY - regionBBox.minY;
        const padding = 20;
        const viewBox = `${Math.floor(regionBBox.minX - padding)} ${Math.floor(regionBBox.minY - padding)} ${Math.ceil(w + padding * 2)} ${Math.ceil(h + padding * 2)}`;
        console.log(`"COUNTRY_VIEW_TOTAL": "${viewBox}", // ${Math.floor(regionBBox.minX)}, ${Math.floor(regionBBox.minY)} -> ${Math.floor(regionBBox.maxX)}, ${Math.floor(regionBBox.maxY)}`);
    }
}
