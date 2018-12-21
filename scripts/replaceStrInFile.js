const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { findStartEndIndices } = require("./findStartEndIndices");

const replaceStrInFile = ({
  pathToFile,
  startStr,
  endStr,
  nToGoBack,
  replacementStr,
  offset,
  sliceOffset = 0,
  addNewLine,
  endIndexOffset = 0,
}) => {
  return new Promise((resolve, reject) => {
    fs.readFile(pathToFile, "utf8", (err, data) => {
      let { startIndex, endIndex } = findStartEndIndices({
        data,
        startStr,
        endStr,
        offset,
      });
      let indexToSliceFrom = startIndex;
      let result = null;

      if (!indexToSliceFrom || !endIndex) {
        // we KNOW there's certain text
        // finding where this ^ text starts
        // going back n indices

        indexToSliceFrom = startIndex - nToGoBack;
        endIndex = startIndex - 1 + endIndexOffset;

        // while (data[endIndex] === "\n" || data[endIndex] === " ") {
        //   endIndex--;
        // }
      }

      // console.log(`indexToSliceFrom`, indexToSliceFrom);
      // console.log(`endIndex`, endIndex);

      let textToReplace = data.slice(indexToSliceFrom, endIndex);

      // console.log(`TEXT TO REPLACE:`, textToReplace);

      if (replacementStr.length === textToReplace.length) {
        result = data.replace(textToReplace, replacementStr);
      } else {
        const newReplacementStr = `${textToReplace.slice(
          0,
          textToReplace.length - replacementStr.length - sliceOffset - 1,
        )}${replacementStr}${addNewLine ? "\n" : ""}`;

        // console.log(`NEW REPLACEMENT STR:`, newReplacementStr);

        result = data.replace(textToReplace, newReplacementStr);
      }

      // resolve(result);

      fs.writeFile(pathToFile, result, "utf8", (err, success) => {
        if (err) {
          const errText = `There has been an error replacing ${startStr} at ${pathToFile}`;
          // console.log(errText);
          // console.log(`Error:`, err);

          reject(new Error(errText));
        }

        console.log(
          `Success! Checkout ${pathToFile} to see the change in effect`,
        );

        resolve(true);
      });
    });
  });
};

module.exports = {
  replaceStrInFile,
};
