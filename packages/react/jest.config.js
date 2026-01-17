module.exports = {
  moduleFileExtensions: ["js", "ts", "jsx", "tsx"],
  moduleDirectories: ["node_modules", "src", "test"],
  moduleNameMapper: {
    "^react$": require.resolve("react"),
    "^react-dom$": require.resolve("react-dom"),
    "\\.(css|less|scss|sass)$": "<rootDir>/test/config/styles.ts",
  },
  transform: {
    "\\.tsx?$": "ts-jest",
    "\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  collectCoverage: false,
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/test/**/*.test.ts", "<rootDir>/test/**/*.test.tsx"],
};
