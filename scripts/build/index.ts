// build.ts

import { createPackageConfig } from "./rollup/create-build-config";
import path from "node:path";
import minimist from "minimist";
import { getPackagesList, PackageInfo } from "../get-package-list";
import { compile } from "./compile";
import { buildWatch } from "./watch";
import chalk from "chalk";

// Define build modes
type BuildMode = "dev" | "prod";

interface BuildOptions {
  mode?: BuildMode;
  package?: string;
  watch?: boolean;
}
// Main build function

(async () => {
  try {
    // Parse command line arguments using minimist
    const args = minimist(process.argv.slice(2)) as BuildOptions;

    let packages: PackageInfo[] = await getPackagesList();

    if (packages.length === 0) {
      console.error("No packages found to build");
      process.exit(1);
    }

    // console.log("Packages:", packages.map((p) => p.name).join(", "));

    // Generate configs for each package
    const configs = await Promise.all(packages.map((pkg) => createPackageConfig(pkg)));

    if (args.watch) {
      // Watch mode
      await buildWatch(configs);
    } else {
      // Build mode
      await compile(configs);

      console.log(chalk.green("Build completed successfully"));
    }
  } catch (error) {
    console.error("Build process failed:", error);
    process.exit(1);
  }
})();
