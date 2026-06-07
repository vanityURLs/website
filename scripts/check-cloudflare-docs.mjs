import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const files = {
  defaults: "data/cloudflare-protection-defaults.json",
  products: "content/docs/reference/cloudflare-products.en.md",
  accessEn: "content/docs/customize/access-control.en.md",
  accessFr: "content/docs/customize/access-control.fr.md",
  networkEn: "content/docs/customize/network-protection.en.md",
  networkFr: "content/docs/customize/network-protection.fr.md",
  terraformReadme: "terraform/cloudflare-baseline/README.md",
  terraformMain: "terraform/cloudflare-baseline/main.tf",
};

function readText(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function fail(message) {
  console.error(`cloudflare docs check failed: ${message}`);
  process.exitCode = 1;
}

function assertIncludes(haystack, needle, context) {
  if (!haystack.includes(needle)) {
    fail(`${context} is missing ${JSON.stringify(needle)}`);
  }
}

const defaults = JSON.parse(readText(files.defaults));
const inventory = defaults["Cloudflare product inventory"];
const products = readText(files.products);
const accessDocs = [readText(files.accessEn), readText(files.accessFr)];
const networkDocs = [readText(files.networkEn), readText(files.networkFr)];
const terraformReadme = readText(files.terraformReadme);
const terraformMain = readText(files.terraformMain);

for (const product of inventory.required_baseline) {
  assertIncludes(products, product, files.products);
}

for (const product of inventory.baseline_protection_surfaces) {
  assertIncludes(products, product, files.products);
}

for (const [index, doc] of accessDocs.entries()) {
  const context = index === 0 ? files.accessEn : files.accessFr;
  assertIncludes(doc, "terraform/cloudflare-baseline", context);
  assertIncludes(doc, "CF_ACCESS_AUD", context);
}

for (const [index, doc] of networkDocs.entries()) {
  const context = index === 0 ? files.networkEn : files.networkFr;
  assertIncludes(doc, "terraform/cloudflare-baseline", context);
  assertIncludes(doc, "Rate limit short-link candidates", context);
  assertIncludes(doc, "Block scanner probes", context);
  assertIncludes(doc, "Block unexpected methods", context);
}

for (const protectedPath of ["*/_stats", "*/_stats/*", "_tests", "_tests/*"]) {
  assertIncludes(terraformMain, protectedPath, files.terraformMain);
}

for (const ruleName of [
  "Redirect www to apex",
  "Rate limit short-link candidates",
  "Block scanner probes",
  "Block unexpected methods",
  "Challenge suspicious clients",
  "Block unwanted AI crawlers",
]) {
  assertIncludes(terraformMain, ruleName, files.terraformMain);
}

assertIncludes(terraformReadme, "terraform apply", files.terraformReadme);
