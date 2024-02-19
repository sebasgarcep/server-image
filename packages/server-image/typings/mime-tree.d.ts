import { MimeType } from "@sebasgarcep/server-image-core";

declare module "mime-tree" {
  export default function mimeFromBuffer(buffer: Uint8Array): MimeType;
}
