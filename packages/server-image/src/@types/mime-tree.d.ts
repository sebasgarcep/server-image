import { MimeType } from "@sebasgarcep/server-image-core";

declare module "mime-tree" {
  const mimeFromBuffer: (buffer: Uint8Array) => MimeType;
  export = MimeFromBuffer;
}
