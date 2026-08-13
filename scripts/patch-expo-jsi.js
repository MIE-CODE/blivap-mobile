/**
 * Expo SDK 57 requires Xcode 26.4+ (Swift 6.3).
 * On older Xcode 26.0–26.3 this patches expo-modules-jsi so local iOS builds work.
 * Remove this once Xcode is upgraded to 26.4+.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(
  __dirname,
  "..",
  "node_modules",
  "expo-modules-jsi",
  "apple",
  "Sources",
);

if (!fs.existsSync(root)) {
  process.exit(0);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.name.endsWith(".swift")) continue;

    let src = fs.readFileSync(full, "utf8");
    let next = src;

    // Swift 6.2 rejects `weak let`; Swift 6.3 allows it.
    next = next.replace(
      /\bweak let runtime:/g,
      "nonisolated(unsafe) weak var runtime:",
    );

    // C++ interop makes `abs` ambiguous with Swift.abs on older toolchains.
    next = next.replace(/\babs\(milliseconds\)/g, "Swift.abs(milliseconds)");

    if (next !== src) {
      fs.writeFileSync(full, next);
      console.log(
        `[patch-expo-jsi] patched ${path.relative(process.cwd(), full)}`,
      );
    }
  }
}

walk(root);
