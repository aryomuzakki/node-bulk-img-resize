const functionResize = async function ({ parSharp, parResizeOptions, funcResizeOptions }) {
  if (parResizeOptions === undefined) {
    return parSharp;
  }
  const objectNewResizeOptions = { ...parResizeOptions };

  if (funcResizeOptions?.useLongestSize) {
    if (parResizeOptions?.size < 1) {
      const objectMetadata = await parSharp.metadata();
      if (objectMetadata.width > objectMetadata.height) {
        objectNewResizeOptions.width = Math.round(parResizeOptions.size * objectMetadata.width);
      } else {
        objectNewResizeOptions.height = Math.round(parResizeOptions.size * objectMetadata.height);
      }
    } else {
      const objectMetadata = await parSharp.metadata();
      if (objectMetadata.width > objectMetadata.height) {
        objectNewResizeOptions.width = parResizeOptions.size;
      } else {
        objectNewResizeOptions.height = parResizeOptions.size;
      }
    }
  } else {
    if (parResizeOptions.width !== undefined) {
      if (parResizeOptions.width < 1) {
        const objectMetadata = await parSharp.metadata();
        if (objectMetadata.width !== undefined) {
          objectNewResizeOptions.width = Math.round(parResizeOptions.width * objectMetadata.width);
        }
      }
    }
  }
  return parSharp.resize(objectNewResizeOptions);

};

module.exports = functionResize;