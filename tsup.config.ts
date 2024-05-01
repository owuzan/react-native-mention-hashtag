import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  format: ["cjs", "esm"],
  outDir: "dist",
  shims: true,
  entry: ["src/index.tsx"],
});
