export default {
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".jsx"],
  transform: {
    "^.+\\.jsx?$": [
      "babel-jest",
      {
        babelrc: false,
        presets: ["@babel/preset-typescript"],
        plugins: ["@babel/plugin-proposal-optional-chaining"],
      },
    ],
  },
  moduleNameMapper: {
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/mocks/fileMock.js",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transformIgnorePatterns: ["/node_modules/(?!node-fetch)/"],
  setupFiles: ["./jest.setup.js"],
};
