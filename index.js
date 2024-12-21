const functionOptimizeImages = require("./optImages");

functionOptimizeImages({
  stringOriginFolder: 'static/images/test',
  stringDestinationFolder: 'static/images/test-result',
  arrayOriginFormats: ['jpg', "JPG"],
  arrayDestinationFormats: ['jpg'],
  objectResizeOptions: {
    // width: 1920, // WHEN THE WIDTH IS SMALLER THAN 1, IT CORRESPONDS TO A PERCENTAGE OF THE ORIGINAL WIDTH AND HEIGHT (IN THIS CASE 50%)
    size: 1920,
  },
  funcResizeOptions: {
    useLongestSize: true,
  },
  objectJpegOptions: {
    quality: 100,
  },
}).then((results) => {
  console.table(results);
});
