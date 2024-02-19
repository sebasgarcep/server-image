import { HandlerConfig } from "@sebasgarcep/server-image";

export type RemixHandlerConfig = HandlerConfig & {
  /** Redirect image to original source if RemixImage fails. (optional, default false) */
  redirectOnFail?: boolean;
};

export type RemixHandler = (config: RemixHandlerConfig, request: Request) => Promise<Response>;
