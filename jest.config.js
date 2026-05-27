/** @type {import('jest').Config} */
const config = {
  projects: [
    {
      displayName: "frontend",
      testEnvironment: "jest-environment-jsdom",
      transform: {
        "^.+\\.tsx?$": [
          "ts-jest",
          {
            tsconfig: {
              jsx: "react",
              esModuleInterop: true,
              resolveJsonModule: true,
              strict: true,
              lib: ["ES2020", "DOM"],
            },
          },
        ],
      },
      testMatch: [
        "<rootDir>/tests/frontend/**/*.tsx",
        "<rootDir>/tests/frontend/**/*.ts",
      ],
    },
    {
      displayName: "backend",
      testEnvironment: "node",
      transform: {
        "^.+\\.tsx?$": [
          "ts-jest",
          {
            tsconfig: {
              esModuleInterop: true,
              resolveJsonModule: true,
              strict: true,
              lib: ["ES2020"],
            },
          },
        ],
      },
      testMatch: [
        "<rootDir>/tests/backend/test_simulate_endpoint.ts",
        "<rootDir>/tests/backend/test_simulate_random.ts",
      ],
    },
  ],
};

module.exports = config;
