const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { findStartEndIndices, replaceStrInFile } = require("./replaceStrInFile");

const TOTAL_FILES_TO_CHANGE = 7;
const FILE_PATHS = {
  "node_modules/react-native/React/Base/RCTDefines.h": [
    {
      startStr: "#define RCT_METRO_PORT",
      endStr: "#else",
      nToGoBack: 5,
      addNewLine: true,
    },
    {
      startStr: `#undef RCT_METRO_PORT
#define RCT_METRO_PORT`,
      endStr: "#endif",
      nToGoBack: 5,
      addNewLine: true,
    },
  ],
  "node_modules/react-native/React/DevSupport/RCTInspectorDevServerHelper.mm": [
    {
      startStr: "NSNumber *metroBundlerPort",
      endStr: ";",
      nToGoBack: 4,
      sliceOffset: -1,
    },
    {
      startStr: "NSNumber *inspectorProxyPort",
      endStr: ";",
      nToGoBack: 4,
      sliceOffset: -1,
    },
  ],
  "node_modules/react-native/ReactCommon/cxxreact/JSCExecutor.cpp": [
    {
      startStr: "!connect_socket",
      endStr: ")) {",
      nToGoBack: 7,
      sliceOffset: -1,
    },
    {
      startStr: "/* emulator */",
      endStr: null,
      nToGoBack: 6,
      endIndexOffset: -1,
    },
    {
      startStr: "/* genymotion */",
      endStr: null,
      nToGoBack: 6,
      endIndexOffset: -1,
    },
  ],
};

const replaceBundlerPort = async (port, callback) => {
  // being run from package.json as npm/yarn script
  // as such, pwd = project_dir

  const { stdout } = await exec("pwd");
  const pwd = stdout.replace("\n", "");
  let working = false;
  let count = 0;

  for (const [filePath, arrOfSearchParams] of Object.entries(FILE_PATHS)) {
    const mapThroughEachPath = async (params) => {
      const {
        startStr,
        endStr,
        nToGoBack,
        offset,
        sliceOffset,
        addNewLine,
        endIndexOffset,
      } = params;

      if (!working) {
        working = true;

        await replaceStrInFile({
          pathToFile: `${pwd}/${filePath}`,
          startStr,
          endStr,
          nToGoBack,
          offset,
          replacementStr: `${port}`,
          sliceOffset,
          addNewLine,
          endIndexOffset,
        });

        count++;

        if (count === TOTAL_FILES_TO_CHANGE && callback) {
          console.log(`Executing build callback\n`);

          callback();
        }

        working = false;
      } else {
        setTimeout(() => mapThroughEachPath(params), 1000);
      }
    };

    arrOfSearchParams.forEach(mapThroughEachPath);
  }
};

module.exports = {
  replaceBundlerPort,
};
