const findStartEndIndices = ({ data, startStr, endStr, offset = 0 }) => {
  const startIndex = data.indexOf(startStr);

  if (!endStr) {
    return {
      startIndex,
      endIndex: null,
    };
  }
  let endIndex = data.slice(startIndex).indexOf(endStr) + startIndex + offset;

  if (startIndex === -1 || endIndex === -1) {
    throw new Error("Strings are invalid based on data argument passed in.");
  }

  let lastChar = data[endIndex];

  while (lastChar === "\n" || lastChar === " ") {
    endIndex--;
    lastChar = data[endIndex];
  }

  return {
    startIndex,
    endIndex,
  };
};

module.exports = {
  findStartEndIndices,
};
