const sharp = require('sharp');
const { functionHandleBars } = require('./handleBars');

// export type typeWatermarkOptions = {
//   stringWatermarkFile: string;
//   numberOpacity: number;
//   objectResizeOptions?: ResizeOptions;
//   stringGravity?: 'centre' | 'northwest' | 'northeast' | 'southeast' | 'southwest';
// };

// type typeParameters = {
//   parSharp: Sharp;
//   parWatermarkOptions?: typeWatermarkOptions;
// };

const functionWatermark = async function ({ parSharp, parWatermarkOptions }) {
  if (parWatermarkOptions === undefined) {
    return parSharp;
  }
  if (parWatermarkOptions.numberOpacity > 1) {
    return parSharp;
  }
  if (parWatermarkOptions.numberOpacity < 0) {
    return parSharp;
  }

  const { width: numberImageWidth, height: numberImageHeight } = await parSharp.metadata();
  if (numberImageWidth === undefined) {
    return parSharp;
  }
  if (numberImageHeight === undefined) {
    return parSharp;
  }

  parWatermarkOptions.stringWatermarkFile = functionHandleBars(parWatermarkOptions.stringWatermarkFile);

  let sharpWatermark = sharp(parWatermarkOptions.stringWatermarkFile);

  const functionProccessWatermarkResizeOptions = async function () {
    const temp = parWatermarkOptions.objectResizeOptions;
    const objectReturn = { ...temp };
    // IF PERCENTUAL WIDTH THEN MAKE WATERMARK WIDTH AS PERCENTUAL OF IMAGE WIDTH
    if (objectReturn.width !== undefined) {
      if (objectReturn.width <= 1) {
        objectReturn.width = Math.floor(objectReturn.width * numberImageWidth);
      }
    }
    /////
    // IF PERCENTUAL HEIGHT THEN MAKE WATERMARK HEIGHT AS PERCENTUAL OF IMAGE WIDTH
    if (objectReturn.height !== undefined) {
      if (objectReturn.height <= 1) {
        objectReturn.height = Math.floor(objectReturn.height * numberImageHeight);
      }
    }
    /////
    return objectReturn;
  };
  const objectNewWatermarkResizeOptions = await functionProccessWatermarkResizeOptions();

  sharpWatermark = sharp(await sharpWatermark.clone().resize(objectNewWatermarkResizeOptions).withMetadata().toBuffer());

  const functionFitWatermarkWidth = async function () {
    const { width } = await sharpWatermark.metadata();
    if (width === undefined) {
      return sharpWatermark;
    }
    if (width > numberImageWidth) {
      return sharp(await sharpWatermark.clone().resize({ width: numberImageWidth }).withMetadata().toBuffer());
    }
    return sharpWatermark;
  };
  sharpWatermark = await functionFitWatermarkWidth();

  const functionFitWatermarkHeight = async function () {
    const { height } = await sharpWatermark.metadata();
    if (height === undefined) {
      return sharpWatermark;
    }
    if (height > numberImageHeight) {
      return sharp(await sharpWatermark.clone().resize({ height: numberImageHeight }).withMetadata().toBuffer());
    }
    return sharpWatermark;
  };
  sharpWatermark = await functionFitWatermarkHeight();

  sharpWatermark.composite([
    {
      input: Buffer.from([0, 0, 0, 255 * parWatermarkOptions.numberOpacity]),
      raw: {
        width: 1,
        height: 1,
        channels: 4,
      },
      tile: true,
      blend: 'dest-in',
    },
  ]);
  const bufferWatermark = await sharpWatermark.withMetadata().toBuffer();

  return parSharp.composite([{ input: bufferWatermark, gravity: parWatermarkOptions.stringGravity }]);
};

module.exports = functionWatermark