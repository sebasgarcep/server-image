import { RemixImageError, decodeQuery, decodeTransformQuery, parseURL } from "@sebasgarcep/server-image-core";
import { imageTransformationHandler } from "@sebasgarcep/server-image";
import { RemixHandler } from "./types";
import { imageResponse, redirectResponse, textResponse } from "./utils";

export const remixHandler: RemixHandler = async (config, request) => {
  const { cache, redirectOnFail } = config;
  let src: string | null = null;

  try {
    const reqUrl = parseURL(request.url);
    const cacheKey = reqUrl.search;

    src = decodeQuery(reqUrl.searchParams, "src");

    if (!src) {
      throw new RemixImageError("An image URL must be provided!", 400);
    }
    try {
      src = decodeURI(src);
    } catch (error) {
      throw new RemixImageError("An invalid image URL was provided!", 400);
    }

    const decodedQuery = decodeTransformQuery(reqUrl.search);
    const { outputContentType, data: resultImg } = await imageTransformationHandler(config, {
      transform: decodedQuery,
      src,
      cacheKey,
    });

    return imageResponse(
      resultImg,
      200,
      outputContentType,
      cache
        ? `private, max-age=${cache.config.ttl}, max-stale=${cache.config.tbd}`
        : `public, max-age=${60 * 60 * 24 * 365}`,
    );
  } catch (error: unknown) {
    if (typeof process !== "undefined" && process?.env?.NODE_ENV === "test") {
      throw error;
    }

    let message = "";
    if (error instanceof Error) {
      message = error.message;
    }

    console.error("RemixImage loader error:", message);
    console.error(error);

    if (redirectOnFail && src) {
      return redirectResponse(src);
    }

    if (error instanceof RemixImageError) {
      return textResponse(error.errorCode || 500, error.message);
    } else {
      return textResponse(500, "RemixImage encountered an unknown error!");
    }
  }
};
