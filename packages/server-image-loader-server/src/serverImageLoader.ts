import { ClientLoader } from "../types/client";
import { encodeQuery } from "../utils/url";

export const serverImageLoader: ClientLoader = (
  src,
  loaderUrl,
  loaderOptions
) => {
  return encodeQuery(loaderUrl, {
    src: encodeURI(src),
    ...loaderOptions,
  });
};
