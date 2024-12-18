import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { join } from "node:path";
import { RollupOptions } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import { PackageInfo } from "../../get-package-list";
import { generateExternal } from "./rollup-externals";

// Create Rollup config for a specific package
export function createPackageConfig(packageInfo: PackageInfo): RollupOptions {
  const external = generateExternal(packageInfo);

  // Determine entry point
  const inputFile = join(packageInfo.path, "src/index.ts");

  return {
    input: inputFile,
    output: [
      {
        format: "esm",
        dir: join(packageInfo.path, "dist"),
        chunkFileNames: "chunks/[name].[hash].js",
        sourcemap: true,
        preserveModules: true,
      },
    ],
    external,
    plugins: [
      typescript({
        // Path to tsconfig
        tsconfig: join(packageInfo.path, "tsconfig.json"),

        // Specify output directory for declaration files
        declarationDir: join(packageInfo.path, "dist/types"),

        // Generate declaration files
        declaration: true,

        // Optional: create declaration source maps
        declarationMap: true,

        // Specify source map generation
        sourceMap: true,
      }),
      nodeResolve({
        preferBuiltins: true,
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      }),
      json({ compact: true }),
      commonjs(),
      esbuild({
        target: "node18",
        sourceMap: true,
        tsconfig: join(packageInfo.path, "tsconfig.json"),
      }),
    ],
    onwarn(warning, warn) {
      // Skip certain warnings
      if (warning.code === "THIS_IS_UNDEFINED") return;
      warn(warning);
    },
  };
}
