/* eslint @typescript-eslint/no-var-requires: "off" */
const { downloadFile } = require("cypress-downloadfile/lib/addPlugin");

module.exports = (on, config) => {
  on("task", { downloadFile });

  return Object.assign({}, config, {
    fixturesFolder: "tests/e2e/fixtures",
    integrationFolder: "tests/e2e/specs",
    screenshotsFolder: "tests/e2e/screenshots",
    videosFolder: "tests/e2e/videos",
    supportFile: "tests/e2e/support/index.js",
  });
};
