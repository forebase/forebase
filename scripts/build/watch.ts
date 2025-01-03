import { RollupWatchOptions } from "rollup";
import { watch } from "rollup";
import chalk from "chalk";
import path from "node:path";

/**
 * Set up Rollup watch mode and log events with detailed status updates.
 * @param config - Rollup watch configuration (single or array of configs)
 * @returns Promise when the watch process starts
 */
export async function buildWatch(config: RollupWatchOptions | RollupWatchOptions[]): Promise<void> {
  // Ensure config is an array
  const configArray = Array.isArray(config) ? config : [config];

  // Event listener to log different stages of the build process
  const listern = async (event) => {
    // // Extract package name from path segments
    let segment = "packages";
    const segments =
      event.input && Array.isArray(event.input) ? event.input[0] || event.input : null;

    if (segments) {
      const packagesIndex = segments.split(path.sep).indexOf("packages");
      segment = segments.split(path.sep).slice(packagesIndex + 1)[0];
    }

    // Handle different Rollup event types
    switch (event.code) {
      case "START":
        // Watch process has started
        console.log(chalk.cyan("Starting watch..."));
        break;

      case "BUNDLE_START":
        // Rebuild has started
        console.log(`Bundling ${chalk.cyan(segment)}: Building...`);
        break;

      case "BUNDLE_END":
        // Rebuild is successful
        console.log(`Bundling ${chalk.cyan(segment)}: ${chalk.green("Build successful!")}`);
        break;

      case "END":
        // Watching for file changes
        console.log(chalk.cyan("Watching for changes..."));
        break;

      case "ERROR":
        // Error occurred during the build
        console.error(`${chalk.red("Bundling Watch:")} Error:`, event.error);
        break;

      default:
        // Unknown event type
        console.error(`${chalk.red("Bundling Watch:")} Unknown event:`, event);
        break;
    }
  };

  // Start Rollup watcher with provided config
  const watcher = watch(configArray);

  // Attach event listener to watcher
  watcher.on("event", listern); // Listen to all events
}
