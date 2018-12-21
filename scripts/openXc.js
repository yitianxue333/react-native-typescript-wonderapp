const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { name: appName } = require("../app.json");

const openXc = async () => {
  const { stdout: pwd } = await exec("pwd");

  const iosDir = pwd
    .replace("\n", "")
    .replace("/scripts", "")
    .concat("/ios");

  const { stdout: iosDirOutput } = await exec(`cd ${iosDir} && ls`);

  const hasXcodeWorkspace = iosDirOutput.indexOf(`${appName}.xcworkspace`) > -1;
  const hasXcodeProj = iosDirOutput.indexOf(`${appName}.xcodeproj`) > -1;

  if (hasXcodeWorkspace) {
    return exec(`open ios/${appName}.xcworkspace`);
  }

  if (hasXcodeProj) {
    return exec(`open ios/${appName}.xcodeproj`);
  }

  console.log(
    `Not a valid react-native project setup. No ios/${appName} Xcode project or workspace.`,
  );
};

openXc();
