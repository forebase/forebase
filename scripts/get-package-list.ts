import fs from "fs/promises";
import path from "path";

import fg from "fast-glob";

// Types for better type safety
interface PackageInfo {
  name: string;
  path: string;
  packageJson: Record<string, unknown>;
}

interface PackagesListOptions {
  basePath?: string;
  scopes?: string[];
}

/**
 * Discover packages with advanced filtering and metadata extraction
 * @param options Configurable discovery options
 * @returns Promise of discovered package information
 */
async function getPackagesList(options: PackagesListOptions = {}): Promise<PackageInfo[]> {
  const { basePath = path.resolve(process.cwd(), "packages"), scopes = [] } = options;

  // Generate search patterns
  const patterns =
    scopes.length > 0 ? scopes.map((scope) => `${basePath}/${scope}*`) : [`${basePath}/*`];

  try {
    // Find all package directories
    const packagePaths = await fg(patterns, {
      onlyDirectories: true,
      absolute: true,
    });

    // Process and filter packages
    const packages: PackageInfo[] = [];
    for (const packagePath of packagePaths) {
      const packageName = path.basename(packagePath);

      // Try to read package.json
      let packageJson;
      try {
        const packageJsonPath = path.join(packagePath, "package.json");
        packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
      } catch (err) {
        console.warn(`Could not read package.json for ${packageName}:`, err);
      }

      packages.push({
        name: packageName,
        path: packagePath,
        packageJson,
      });
    }

    return packages;
  } catch (error) {
    console.error("Package discovery failed:", error);
    return [];
  }
}

// Export functions for use in other modules
export { getPackagesList, PackageInfo, PackagesListOptions };
