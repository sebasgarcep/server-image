import { ClientLoader, encodeQuery } from "@sebasgarcep/server-image-core";

export const serverImageLoader: ClientLoader = (src, loaderUrl, loaderOptions) => {
  return encodeQuery(loaderUrl, {
    src: encodeURI(src),
    ...loaderOptions,
  });
};
