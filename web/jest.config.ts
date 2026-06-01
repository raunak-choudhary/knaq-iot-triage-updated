import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customConfig: Config = {
  coverageProvider: "v8",
  testEnvironment: "<rootDir>/jest.environment.ts",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts", "<rootDir>/src/__tests__/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: [
    "<rootDir>/src/**/*.test.{ts,tsx}",
    "<rootDir>/src/__tests__/**/*.test.{ts,tsx}",
  ],
};

// Must export an async function to override transformIgnorePatterns after next/jest applies its own
async function config(): Promise<Config> {
  const nextConfig = await createJestConfig(customConfig)();
  return {
    ...nextConfig,
    testEnvironment: "<rootDir>/jest.environment.ts",
    // MSW v2 and all its dependencies are ESM-only; transform all node_modules
    transformIgnorePatterns: [],
  };
}

export default config;
