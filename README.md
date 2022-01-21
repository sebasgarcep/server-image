# Remix-Image

## 👋 Intro

A React component for responsive images in Remix.

This library turns:

```typescript jsx
<Image
  src="https://i.imgur.com/5cQnAQC.png"
  responsive={[{
    size: {
      width: 100,
      height: 100,
    },
    maxWidth: 200,
  }]}
/>
```

Into:

```typescript jsx
<img
  class="Image-module_root__56rgX"
  src="/api/image?src=https%253A%252F%252Fi.imgur.com%252F5cQnAQC.png&amp;width=100&amp;height=100%2520100w"
  srcset="/api/image?src=https%253A%252F%252Fi.imgur.com%252F5cQnAQC.png&amp;width=100&amp;height=100%2520100w"
  sizes="(max-width: 200px) 100px"
>
```

Where the `responsive` sizes provided through the props are turned into image URLs served by the local server that are cached for fast and performant loading.

## 🚀 How to use

### Install

To install this library and its peer deps, use on of the following commands:
```bash
npm install -S remix-image hybrid-disk-cache sharp
yarn add remix-image hybrid-disk-cache sharp
```

---

### Loader

Create a new resource route that imports the `imageLoader` function and exports as `loader`.
By default, the image component uses the route `"/api/image"`, but any route can be used.
```typescript jsx
import type { LoaderFunction } from "remix";
import { imageLoader, DiskCache, MemoryCache } from "remix-image/server";

const config = {
  selfUrl: "http://localhost:3000",
  whitelistedDomains: ["i.imgur.com"],
  cache: new DiskCache(),
};

export const loader: LoaderFunction = ({ request }) => {
  return imageLoader(config, request);
};
```

#### Options
|        Name        |           Type           | Required | Default |                                                    Description                                                     |
|:------------------:|:------------------------:|:--------:|:-------:|:------------------------------------------------------------------------------------------------------------------:|
|       selfUrl      |          string          |    X     |         |                                            The URL of the local server.                                            |
| whitelistedDomains |         string[]         |          |   []    | Valid domains responsive images can be served from. selfUrl is automatically added at runtime and is not required. |
|        cache       | DiskCache or MemoryCache |          |  null   |                  The configuration for the local image cache. Setting this to null will disable the cache.         |

#### Cache Types

| Name        | Description                                                                                                            | Options                                               |
|-------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|
| DiskCache   | A cache that stores images in memory and on disk (depending on size) for the best efficiency.                          | { path: string, ttl: number, tbd: number }            |
| MemoryCache | A cache that only stores images in memory. Designed for platforms that do not have native disk access like Cloudflare. | { maxSize: number (bytes), ttl: number, tbd: number } |

**Note:**
Due to [remix request purging](https://remix.run/docs/en/v1.1.1/other-api/serve), `MemoryCache` will clear itself automatically on each request in development. This will not occur during production, and it will perform as expected.

---

### Component

Import the `Image` component and specify the url to the resource route used by the `imageLoader` function.
The `loaderUrl` prop is optional if the resource route has been created at the path `"/api/image"`.
```typescript jsx
import { Image } from "remix-image";

<Image
  loaderUrl="/api/image"
  src="..."
  width="..."
  height="..."
  alt="..."
  responsive={[
    {
      size: {
        width: 100,
        height: 100,
      },
      maxWidth: 200,
    },
  ]}
/>
```

#### PropTypes
|    Name    |                                Type                                | Required |   Default    |                                         Description                                          |
|:----------:|:------------------------------------------------------------------:|:--------:|:------------:|:--------------------------------------------------------------------------------------------:|
|  loaderUrl |                               string                               |          | "/api/image" |                         The path of the image loader resource route.                         |
| responsive | { size: { width: number; height: number; }; maxWidth?: number; }[] |          |      []      | An array of responsive sizes. The resource route is not called if this prop is not provided. |

---

### Hook

Optionally, this library also exports the hook used to generate responsive props for images.
In most use cases you can simply use the `Image` component, but you might need the hook for custom components.

```typescript jsx
import { useResponsiveImage } from "remix-image";

const Image: React.FC<ImageProps> = ({
  className,
  loaderUrl = "/api/image",
  responsive = [],
  ...imgProps
}) => {
  const responsiveProps = useResponsiveImage(imgProps, loaderUrl, responsive);

  return (
    <img
      className={clsx(classes.root, className)}
      {...imgProps}
      {...responsiveProps}
    />
  );
};
```

#### Parameters
|    Name    |                                Type                                | Required | Default |                   Description                   |
|:----------:|:------------------------------------------------------------------:|:--------:|:-------:|:-----------------------------------------------:|
|  imgProps  |                   ComponentPropsWithoutRef<"img">                  |     X    |         | The props to be passed to the base img element. |
|  loaderUrl |                               string                               |     X    |    []   |   The path of the image loader resource route.  |
| responsive | { size: { width: number; height: number; }; maxWidth?: number; }[] |          |    []   |          An array of responsive sizes.          |

## Other

### Status

At the moment this library is experimental and has not been used in a production environment.
Further development is ongoing, but I welcome all pull-requests and issues created on GitHub.

### Credit

This repo expands on the following gists by:

- [jacob-ebey](https://gist.github.com/jacob-ebey/3a37a86307de9ef22f47aae2e593b56f)
- [olikami](https://gist.github.com/olikami/236e3c57ca73d145984ec6c127416340)
