import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.test.ts"],
    // Mock @octokit/* — they're pure ESM and incompatible with ts-jest's CJS transform.
    // Only buildMarkdownFile (a pure function) is unit-tested; pushBlogAsPR is tested via API.
    moduleNameMapper: {
        "^@octokit/(.*)$": "<rootDir>/__mocks__/@octokit/$1.js",
    },
};

export default config;
