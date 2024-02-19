import * as React from "react";
import { useResponsiveImage } from "../hooks";
import { BaseImageProps } from "./types";

export const BaseImage = React.forwardRef<HTMLImageElement, BaseImageProps>(
  (
    {
      loaderUrl = "/api/image",
      loader,
      responsive = [],
      options = {},
      dprVariants = 1,
      decoding = "async",
      loading = "lazy",
      ...imgProps
    },
    ref,
  ) => {
    const responsiveProps = useResponsiveImage(imgProps, responsive, options, dprVariants, loaderUrl, loader);

    return <img ref={ref} decoding={decoding} loading={loading} {...imgProps} {...responsiveProps} />;
  },
);

BaseImage.displayName = "BaseImage";
