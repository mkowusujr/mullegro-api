/** @type {import('jest').Config} */
const config = {
  restoreMocks: true /** resets the behaviour of the mocks */,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10
    }
  }
};

module.exports = config;
