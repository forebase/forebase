import { PackageInfo } from "../../get-package-list";

function readPackageJson(packageInfo: PackageInfo) {
  // Since the packageJson is already parsed in the packageInfo object,
  // we can directly return it without reading from the file system
  return packageInfo.packageJson;
}

export function generateExternal(packageInfo: PackageInfo): string[] {
  const pkg = readPackageJson(packageInfo);

  const builtinModules = [
    "node:fs",
    "node:path",
    "node:url",
    "node:worker_threads",
    "node:os",
    "node:stream",
    "node:vm",
    "node:module",
  ];

  if (!pkg) {
    console.error("No packages found to build");
    process.exit(1);
  }

  // Check if dependencies, devDependencies, and peerDependencies exist
  const dependencies = pkg.dependencies ? Object.keys(pkg.dependencies) : [];
  const devDependencies = pkg.devDependencies ? Object.keys(pkg.devDependencies) : [];
  const peerDependencies = pkg.peerDependencies ? Object.keys(pkg.peerDependencies) : [];

  return [
    ...builtinModules,
    ...dependencies,
    ...devDependencies,
    ...peerDependencies,
    "worker_threads", // "worker_threads" is a Node.js built-in module, so we include it explicitly
  ];
}
