import { TransformOptions } from "@sebasgarcep/server-image-core";
import ImageData from "./ImageData";

export interface ImageHandler {
  decode(buffer: ArrayBuffer): Promise<ImageData>;
  encode(image: ImageData, options: TransformOptions): Promise<ArrayBuffer>;
}
