# server-image-transformer-wasm

![](https://badgen.net/npm/v/server-image-transformer-wasm)
![](https://badgen.net/npm/license/server-image-transformer-wasm)
![](https://badgen.net/npm/types/server-image-transformer-wasm)
![](https://badgen.net/bundlephobia/min/server-image-transformer-wasm)
![](https://badgen.net/npm/dt/server-image-transformer-wasm)

## 👋 Intro

A WebAssembly transformer for Remix-Image

## 🚀 How to use

### Install

To install this library, use one of the following commands:
```bash
npm install -S server-image-transformer-wasm
yarn add server-image-transformer-wasm
```

### Implement

To use this transformer, set the `transformer` property in your ImageLoader API route:
```typescript
import type { LoaderFunction } from "remix";
import { wasmTransformer } from "server-image-transformer-wasm";
import { imageLoader, DiskCache } from "remix-image/server";

const config = {
  selfUrl: "http://localhost:3000",
  cache: new DiskCache(),
  transformer: wasmTransformer,
};

export const loader: LoaderFunction = ({ request }) => {
  return imageLoader(config, request);
};
```

Then make sure the wasm files are accessible in your environment.

#### Cloudflare:

Add the following lines to the bottom of your `wrangler.toml` file:
```
[wasm_modules]
AVIF_ENC_WASM = "node_modules/server-image-transformer-wasm/dist/avif_enc.wasm"
AVIF_DEC_WASM = "node_modules/server-image-transformer-wasm/dist/avif_dec.wasm"
JPEG_ENC_WASM = "node_modules/server-image-transformer-wasm/dist/jpeg_enc.wasm"
JPEG_DEC_WASM = "node_modules/server-image-transformer-wasm/dist/jpeg_dec.wasm"
PNG_WASM = "node_modules/server-image-transformer-wasm/dist/png.wasm"
WEBP_ENC_WASM = "node_modules/server-image-transformer-wasm/dist/webp_enc.wasm"
WEBP_DEC_WASM = "node_modules/server-image-transformer-wasm/dist/webp_dec.wasm"
```

### Docs

- Documentation for this library can be found at: [https://remix-image.mcfarl.in](https://remix-image.mcfarl.in)
