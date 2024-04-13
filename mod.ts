import {
  DOMParser,
  type Element,
} from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

type MetaDataType = string | null | undefined;

export interface MetaData {
  title: MetaDataType;
  description: MetaDataType;
  favicon: MetaDataType;
  open_graph: {
    title: MetaDataType;
    description: MetaDataType;
    site_name: MetaDataType;
    type: MetaDataType;
    url: MetaDataType;
    image: MetaDataType;
  };
  twitter: {
    title: MetaDataType;
    description: MetaDataType;
    card: MetaDataType;
    image: MetaDataType;
    site: MetaDataType;
  };
}

export interface ParserOptions {
  allowOrigins?: Array<string>;
}

/**
 * Extract meta data in fetched HTML data
 * @param url URL
 * @param options.allowOrigins allow origin list
 * @returns parsed object
 * @example
 * import { parsedMeta } from "https://deno.land/x/ogp_parser/mod.ts"
 * const result = parsedMeta("https://example.com", {
 *   allowOrigins: ["https://example.com"],
 * });
 * console.log(result.title) // -> "Example Domain"
 */
export const parsedMeta = async (
  url: string,
  options?: ParserOptions,
): Promise<MetaData> => {
  if (
    options?.allowOrigins && !options.allowOrigins.includes(new URL(url).origin)
  ) throw new Deno.errors.InvalidData();

  const res = await fetch(url, {
    headers: {
      "user-agent": "deno_ogp_parser",
      "accept": "text/html",
      "accept-charset": "utf-8",
    },
  });
  const bodyText = await res.text();
  const body = new DOMParser().parseFromString(bodyText, "text/html");

  const metaData: MetaData = {
    title: null,
    description: null,
    favicon: null,
    open_graph: {
      title: null,
      description: null,
      site_name: null,
      type: null,
      url: null,
      image: null,
    },
    twitter: {
      title: null,
      description: null,
      card: null,
      image: null,
      site: null,
    },
  };

  metaData.title = body?.querySelector("title")?.innerText;

  body?.querySelectorAll("link").forEach((node) => {
    const element = node as Element;
    if (element.getAttribute("rel") === "shortcut icon") {
      metaData.favicon = element.getAttribute("href");
    }
  });

  body?.querySelectorAll("meta").forEach((node) => {
    const element = node as Element;

    if (element.getAttribute("name") === "description") {
      metaData.description = element.getAttribute("content");
    }
    if (element.getAttribute("property") === "og:title") {
      metaData.open_graph.title = element.getAttribute("content");
    }
    if (element.getAttribute("property") === "og:description") {
      metaData.open_graph.description = element.getAttribute("content");
    }
    if (element.getAttribute("property") === "og:site_name") {
      metaData.open_graph.site_name = element.getAttribute("content");
    }
    if (element.getAttribute("property") === "og:type") {
      metaData.open_graph.type = element.getAttribute("content");
    }
    if (element.getAttribute("property") === "og:url") {
      metaData.open_graph.url = element.getAttribute("content");
    }
    if (element.getAttribute("property") === "og:image") {
      metaData.open_graph.image = element.getAttribute("content");
    }
    if (element.getAttribute("name") === "twitter:title") {
      metaData.twitter.title = element.getAttribute("content");
    }
    if (element.getAttribute("name") === "twitter:description") {
      metaData.twitter.description = element.getAttribute("content");
    }
    if (element.getAttribute("name") === "twitter:card") {
      metaData.twitter.card = element.getAttribute("content");
    }
    if (element.getAttribute("name") === "twitter:image") {
      metaData.twitter.image = element.getAttribute("content");
    }
    if (element.getAttribute("name") === "twitter:site") {
      metaData.twitter.site = element.getAttribute("content");
    }
  });

  return metaData;
};
