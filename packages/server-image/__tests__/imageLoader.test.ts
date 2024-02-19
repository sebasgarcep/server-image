import fs from "fs/promises";
import path from "path";
import { imageTransformationHandler } from "../src/handler";
import { HandlerConfig } from "../src/types";
import { Resolver, MimeType } from "@sebasgarcep/server-image-core";

const fetchResolver: Resolver = async () => {
  return {
    buffer: await fs.readFile(path.join(__dirname, "fixtures/camera.png")),
    contentType: MimeType.PNG,
  };
};

const selfUrl = "http://localhost:3000";
const srcHost = "localhost:8000";

const request = {
  cacheKey: "test",
  src: `http://${srcHost}/image.png`,
  transform: {},
};

describe("imageTransformationHandler", () => {
  test("should throw error on empty selfUrl", async () => {
    const config: HandlerConfig = {
      selfUrl: "",
      resolver: fetchResolver,
    };

    await expect(imageTransformationHandler(config, request)).rejects.toThrow(
      "selfUrl is required in RemixImage loader config!",
    );
  });

  test("should throw error on empty imageUrl", async () => {
    const config: HandlerConfig = {
      selfUrl,
      resolver: fetchResolver,
    };

    await expect(imageTransformationHandler(config, { ...request, src: "http://localhost:5000" })).rejects.toThrow(
      "An image URL must be provided!",
    );
  });

  test("should throw error on empty imageUrl", async () => {
    const config: HandlerConfig = {
      selfUrl,
      resolver: fetchResolver,
    };

    await expect(imageTransformationHandler(config, { ...request, src: selfUrl })).rejects.toThrow(
      "An image URL must be provided!",
    );
  });

  test("should throw error for imageUrl on blacklist", async () => {
    const config: HandlerConfig = {
      selfUrl,
      blacklistedDomains: [srcHost],
      resolver: fetchResolver,
    };

    await expect(imageTransformationHandler(config, request)).rejects.toThrow(
      "The requested image host is not allowed!",
    );
  });

  test("should throw error for imageUrl not on whitelist", async () => {
    const config: HandlerConfig = {
      selfUrl,
      whitelistedDomains: [],
      resolver: fetchResolver,
    };

    await expect(imageTransformationHandler(config, request)).rejects.toThrow(
      "The requested image host is not included on the whitelist!",
    );
  });

  test("should allow any image host if no whitelist is set", async () => {
    const config: HandlerConfig = {
      selfUrl,
      resolver: fetchResolver,
    };

    await expect(imageTransformationHandler(config, request)).resolves.toBeDefined();
  });

  test("should allow any image host if whitelist is null", async () => {
    const config: HandlerConfig = {
      selfUrl,
      whitelistedDomains: null,
      resolver: fetchResolver,
    };

    await expect(imageTransformationHandler(config, request)).resolves.toBeDefined();
  });
});
