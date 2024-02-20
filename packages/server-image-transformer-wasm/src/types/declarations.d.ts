/* eslint-disable no-var */
declare module "*.wasm";

declare global {
  var AVIF_ENC_WASM: "node_modules/server-image-transformer-wasm/dist/avif_enc.wasm" | undefined;
  var AVIF_DEC_WASM: "node_modules/server-image-transformer-wasm/dist/avif_dec.wasm" | undefined;
  var JPEG_ENC_WASM: "node_modules/server-image-transformer-wasm/dist/jpeg_enc.wasm" | undefined;
  var JPEG_DEC_WASM: "node_modules/server-image-transformer-wasm/dist/jpeg_dec.wasm" | undefined;
  var PNG_WASM: "node_modules/server-image-transformer-wasm/dist/png.wasm" | undefined;
  var WEBP_ENC_WASM: "node_modules/server-image-transformer-wasm/dist/webp_enc.wasm" | undefined;
  var WEBP_DEC_WASM: "node_modules/server-image-transformer-wasm/dist/webp_dec.wasm" | undefined;
  var RESIZE_WASM: "node_modules/server-image-transformer-wasm/dist/resize.wasm" | undefined;
}

export {};
