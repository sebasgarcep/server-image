import type {
  Cache,
  MimeType,
  Resolver,
  SizelessOptions,
  TransformOptions,
  Transformer,
} from "@sebasgarcep/server-image-core";

export interface HandlerConfig {
  /** The URL for this Remix server. */
  selfUrl: string;
  /** A resolver function that handles retrieving image assets. */
  resolver: Resolver;
  /** A transformer function that handles mutations of images. (optional) */
  transformer?: Transformer;
  /** The output mime type the image should fallback to if the provided output type is not supported. (optional, default MimeType.JPEG) */
  fallbackFormat?: MimeType;
  /** The transformer the loader should use if the provided custom transformer fails. */
  fallbackTransformer?: Transformer;
  /** A cache to store computed RemixImage transformations. (optional) */
  cache?: Cache;
  /** Default TransformOptions to use, can be overridden by the client. (optional) */
  defaultOptions?: SizelessOptions;
  /** A set of mime types that should be returned without transformation. (optional, default Set([MimeType.SVG]) */
  skipFormats?: Set<MimeType> | null;
  /** The base file path used for the resolver. (optional, default "public") */
  basePath?: string;
  /** An array of domains that assets can be fetched from. Set to null to disable. (optional, default null) */
  whitelistedDomains?: string[] | null;
  /** An array of domains that assets are not allowed to be fetched from. Only used if whitelistedDomains is not null. (optional, default null) */
  blacklistedDomains?: string[] | null;
  /** Enables verbose logging for debugging */
  verbose?: boolean;
}

export interface HandlerRequest {
  /* Transforms to apply to image */
  transform: Partial<TransformOptions>;
  /* Image source to retrieve from */
  src: string;
  /* Cache key to use if cache is provided */
  cacheKey: string;
}

export interface HandlerResult {
  /* Type of generated asset */
  contentType: MimeType;
  /* Generated asset binary data */
  data: Uint8Array;
}

export type ImageTransformationHandler = (config: HandlerConfig, request: HandlerRequest) => Promise<HandlerResult>;
