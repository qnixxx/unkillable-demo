import { writeFileSync } from "node:fs";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const withBase = (path) => `${basePath}${path}` || path;
const manifest = {
  name: "Unkillable",
  short_name: "Unkillable",
  description: "Build a life that doesn’t break under pressure.",
  start_url: withBase("/app/"),
  scope: withBase("/"),
  display: "standalone",
  background_color: "#0a0b0c",
  theme_color: "#0a0b0c",
  icons: [
    { src: withBase("/icon.svg"), sizes: "any", type: "image/svg+xml", purpose: "any maskable" }
  ]
};

writeFileSync("public/manifest.webmanifest", `${JSON.stringify(manifest, null, 2)}\n`);
