const readline = require("readline");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { replaceBundlerPort } = require("./replaceBundlerPort");

const buildWithPort = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    "Please specify the port number and iPhone simulator device you'd like to build for, separated by a comma. Eg: 8082,iPhone X\n>> ",
    (portAndPhone) => {
      let port = 8081;
      let sim = "iPhone X";

      const split = portAndPhone.split(",");

      port = split[0].trim();

      if (split.length === 2) {
        sim = split[1].trim();
      }

      console.log(`split`, split);

      console.log(`Preparing to build for port: ${port} on device: ${sim}\n`);

      const buildCommand = () =>
        exec(`react-native run-ios --simulator "${sim}" --port ${port}`);

      rl.close();
      return replaceBundlerPort(port, buildCommand);
    },
  );
};

buildWithPort();
