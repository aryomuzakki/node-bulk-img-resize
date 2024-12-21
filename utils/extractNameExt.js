const path = require("path");

const functionExtractNameAndExtension = function (parFullFileName) {
  const arrayReturn = path.basename(parFullFileName || '').split('.');
  return {
    stringFileName: arrayReturn[0],
    stringFileExtension: arrayReturn[1],
  };
};

module.exports = functionExtractNameAndExtension;