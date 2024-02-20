const fs = require("node:fs");

const files = [
  {
    source: "../../node_modules/@jsquash/avif/codec/enc/avif_enc.wasm",
    target: "avif_enc.wasm",
  },
  {
    source: "../../node_modules/@jsquash/avif/codec/dec/avif_dec.wasm",
    target: "avif_dec.wasm",
  },
  {
    source: "../../node_modules/@jsquash/jpeg/codec/enc/mozjpeg_enc.wasm",
    target: "jpeg_enc.wasm",
  },
  {
    source: "../../node_modules/@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm",
    target: "jpeg_dec.wasm",
  },
  {
    source: "../../node_modules/@jsquash/png/codec/squoosh_png_bg.wasm",
    target: "png.wasm",
  },
  {
    source: "../../node_modules/@jsquash/webp/codec/enc/webp_enc.wasm",
    target: "webp_enc.wasm",
  },
  {
    source: "../../node_modules/@jsquash/webp/codec/dec/webp_dec.wasm",
    target: "webp_dec.wasm",
  },
  {
    source: "../../node_modules/@jsquash/resize/lib/resize/squoosh_resize_bg.wasm",
    target: "resize.wasm",
  },
];

for (const item of files) {
  fs.copyFileSync(item.source, "dist/" + item.target);
}
