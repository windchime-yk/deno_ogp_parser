import { $ } from "jsr:@david/dax@^0.40.1";
import { parseArgs } from "jsr:@std/cli@^0.224.0";

const args = parseArgs(Deno.args);
const version = args._[0].toString().replace("v", "");

const config = {
  name: "@whyk/ogp-parser",
  version,
  exports: "./mod.ts",
};

const encoder = new TextEncoder();
await Deno.writeFile(
  "jsr.json",
  encoder.encode(JSON.stringify(config)),
);
await $`deno fmt jsr.json`;
