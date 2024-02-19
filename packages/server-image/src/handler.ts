import mimeFromBuffer from "mime-tree";
import {
  MimeType,
  RemixImageError,
  TransformOptions,
  UnsupportedImageError,
  parseURL,
} from "@sebasgarcep/server-image-core";
import { ImageTransformationHandler } from "./types";

export const imageTransformationHandler: ImageTransformationHandler = async (
  {
    selfUrl,
    cache = null,
    resolver,
    transformer,
    fallbackFormat,
    fallbackTransformer,
    defaultOptions = {},
    skipFormats = new Set([MimeType.SVG]),
    basePath = "public",
    whitelistedDomains = null,
    blacklistedDomains = null,
    verbose = false,
  },
  { transform, src, cacheKey },
) => {
  if (!selfUrl) {
    throw new RemixImageError("selfUrl is required in RemixImage loader config!", 500);
  }

  let selfUrlObj;
  try {
    selfUrlObj = new URL(selfUrl);
  } catch (error) {
    throw new RemixImageError("selfUrl is not a valid URL!");
  }
  const whitelist = whitelistedDomains ? new Set([...whitelistedDomains, selfUrlObj.host]) : null;
  const blacklist = blacklistedDomains ? new Set(blacklistedDomains) : null;

  const transformOptions: Required<TransformOptions> = {
    fit: "cover",
    position: "center",
    background: [0x00, 0x00, 0x00, 0x00],
    quality: 80,
    compressionLevel: 9,
    loop: 0,
    delay: 100,
    blurRadius: null,
    rotate: null,
    flip: null,
    crop: null,
    ...defaultOptions,
    ...transform,
  } as Required<TransformOptions>;

  const assetUrl = parseURL(src, selfUrl);

  if (!transformOptions.width) {
    throw new RemixImageError("A width is required!", 400);
  }
  if (transformOptions.width && transformOptions.width > 8000) {
    throw new RemixImageError("Requested Image too large!", 406);
  }
  if (transformOptions.height && transformOptions.height > 8000) {
    throw new RemixImageError("Requested Image too large!", 406);
  }

  let isNewImage = true;
  let shouldTransform = true;
  let loadedImg: Uint8Array | undefined;
  let resultImg: Uint8Array | undefined;
  let inputContentType: MimeType | undefined;
  let outputContentType: MimeType | undefined = transformOptions.contentType;

  if (cache && (await cache.has(cacheKey))) {
    const cacheValue = await cache.get(cacheKey);

    if (cacheValue) {
      if (verbose) {
        console.log(`Retrieved image [${cacheKey}] from cache.`);
      }

      isNewImage = false;
      shouldTransform = false;

      loadedImg = cacheValue;
      inputContentType = mimeFromBuffer(loadedImg);
    }
  }

  if (!loadedImg) {
    if (whitelist && !whitelist.has(assetUrl.host)) {
      throw new RemixImageError("The requested image host is not included on the whitelist!");
    }
    if (blacklist && blacklist.has(assetUrl.host)) {
      throw new RemixImageError("The requested image host is not allowed!");
    }

    const res = await resolver(src, assetUrl.toString(), transformOptions, basePath);

    if (verbose) {
      console.log(`Fetched image [${cacheKey}] directly using resolver: ${resolver.name}.`);
    }

    isNewImage = true;
    shouldTransform = true;

    loadedImg = res.buffer;
    inputContentType = res.contentType;
  }

  if (!loadedImg || !inputContentType) {
    throw new RemixImageError("Failed to transform requested image!", 500);
  }

  if (!outputContentType) {
    outputContentType = inputContentType;
  }

  if (!shouldTransform || skipFormats?.has(inputContentType)) {
    resultImg = loadedImg;
  } else if (transformer != null) {
    let curTransformer = transformer;

    if (!transformer.supportedInputs.has(inputContentType)) {
      if (
        fallbackTransformer !== undefined &&
        transformer !== fallbackTransformer &&
        fallbackTransformer.supportedInputs.has(inputContentType)
      ) {
        console.error(
          `Transformer does not allow this input content type: ${inputContentType}! Falling back to transformer: ${fallbackTransformer.name}`,
        );
        curTransformer = fallbackTransformer;
      } else {
        throw new UnsupportedImageError(`Transformer does not allow this input content type: ${inputContentType}!`);
      }
    }

    if (!curTransformer.supportedOutputs.has(outputContentType)) {
      if (fallbackFormat !== undefined && curTransformer.supportedOutputs.has(fallbackFormat)) {
        console.error(
          `Transformer does not allow this output content type: ${outputContentType}! Falling back to mime type: ${fallbackFormat}`,
        );
        outputContentType = fallbackFormat;
      } else {
        console.error(
          `Transformer does not allow this output content type: ${outputContentType}! Falling back to mime type: ${curTransformer.fallbackOutput}`,
        );
        outputContentType = curTransformer.fallbackOutput;
      }
    }

    resultImg = await curTransformer.transform(
      {
        url: assetUrl.toString(),
        data: loadedImg,
        contentType: inputContentType!,
      },
      {
        ...transformOptions,
        contentType: outputContentType!,
      },
    );

    if (verbose) {
      console.log(`Successfully transformed image using transformer: ${curTransformer.name}`);
    }
  }

  if (!resultImg) {
    throw new RemixImageError("Failed to transform requested image!", 500);
  }

  if (isNewImage && cache) {
    await cache.set(cacheKey, resultImg);
  }

  return {
    contentType: outputContentType,
    data: resultImg,
  };
};
