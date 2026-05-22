/* eslint-disable @typescript-eslint/no-require-imports */

const originalAdapterPath = process.env.NEXT_ADAPTER_PATH;

if (!originalAdapterPath) {
  throw new Error("NEXT_ADAPTER_PATH is required for the Vercel adapter bridge.");
}

const originalAdapter = require(originalAdapterPath);
const adapter = originalAdapter.default || originalAdapter;

module.exports = {
  ...adapter,
  name: adapter.name || "Vercel",
  async modifyConfig(config, ctx = {}) {
    if (typeof adapter.modifyConfig !== "function") {
      return config;
    }

    return adapter.modifyConfig(config, {
      projectDir: process.cwd(),
      ...ctx,
    });
  },
};
