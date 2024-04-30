import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  format: ["cjs", "esm"],
  outDir: "dist",
  entry: ["src/index.tsx"],
});
