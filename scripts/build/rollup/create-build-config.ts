import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import path from "node:path";
import { RollupOptions } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import { PackageInfo } from "../../get-package-list";
import { generateExternal } from "./rollup-externals";
import fg from "fast-glob";

// Create Rollup config for a specific package
export function createPackageConfig(packageInfo: PackageInfo): RollupOptions {
  const external = generateExternal(packageInfo);

  // Determine entry point
  const inputPath = path.resolve(packageInfo.path, "src/*.ts");

  const inputfiles = fg.sync([inputPath]);

  return {
    input: inputfiles,
    treeshake: true,
    output: [
      {
        format: "esm",
        dir: path.resolve(packageInfo.path, "dist"),
        chunkFileNames: "chunks/[name].[hash].js",
        preserveModules: true,
      },
    ],
    external,
    plugins: [
      typescript({
        // Path to tsconfig
        tsconfig: path.resolve(packageInfo.path, "tsconfig.json"),

        // Specify output directory for declaration files
        declarationDir: path.resolve(packageInfo.path, "dist"),
      }),
      nodeResolve({
        preferBuiltins: true,
      }),
      json({ compact: true }),
      commonjs(),
      esbuild({
        target: "node18",
      }),
    ],
    onwarn(warning, warn) {
      // Skip certain warnings
      if (warning.code === "THIS_IS_UNDEFINED") return;
      warn(warning);
    },
  };
}
