import { OutputOptions } from "rollup";
import { rollup } from "rollup";
import { RollupOptions } from "rollup";

export async function compile(configs: RollupOptions | RollupOptions[]) {
  // Normalize configs to always be an array
  const configArray = Array.isArray(configs) ? configs : [configs];

  // Compile each configuration
  const builds = await Promise.all(
    configArray.map(async (config) => {
      try {
        const bundle = await rollup(config);

        // Normalize outputs to always be an array
        const outputs: OutputOptions[] = Array.isArray(config.output)
          ? config.output
          : [config.output!];

        // Write each output
        return Promise.all(outputs.map((output) => bundle.write(output)));
      } catch (error) {
        console.error(`Error building config:`, config.input);
        throw error;
      }
    }),
  );

  return builds;
}
