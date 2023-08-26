import { assertEquals } from "https://deno.land/std@0.188.0/testing/asserts.ts";
import { stub } from "https://deno.land/std@0.188.0/testing/mock.ts";
import { type MetaData, parsedMeta } from "./mod.ts";

const FULL_OGP_HTML_DATA = `
<html>
  <head>
    <title>テスト</title>
    <meta name="description" content="テスト">
    <meta property="og:title" content="テスト">
    <meta property="og:description" content="テスト">
    <meta property="og:site_name" content="テスト">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://example.com">
    <meta property="og:image" content="https://example.com/example.png">
    <meta name="twitter:title" content="テスト">
    <meta name="twitter:description" content="テスト">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:image" content="https://example.com/example.png">
    <meta name="twitter:site" content="@Twitter">
    <link rel="shortcut icon" href="/favicon.ico">
  </head>
  <body>テスト</body>
</html>
`;
const NO_OGP_HTML_DATA = `
<html>
  <head>
    <title>テスト</title>
    <meta name="description" content="テスト">
    <link rel="shortcut icon" href="/favicon.ico">
  </head>
  <body>テスト</body>
</html>
`;

Deno.test("parsedMeta", async (t) => {
  await t.step("Full OGP tags", async () => {
    const fetchStub = stub(
      globalThis,
      "fetch",
      () =>
        Promise.resolve(
          new Response(FULL_OGP_HTML_DATA, {
            "headers": { "Content-Type": "text/html" },
          }),
        ),
    );

    try {
      const meta = await parsedMeta("https://example.com");
      assertEquals<MetaData>(meta, {
        title: "テスト",
        description: "テスト",
        favicon: "/favicon.ico",
        open_graph: {
          description: "テスト",
          image: "https://example.com/example.png",
          site_name: "テスト",
          title: "テスト",
          type: "website",
          url: "https://example.com",
        },
        twitter: {
          card: "summary",
          description: "テスト",
          image: "https://example.com/example.png",
          site: "@Twitter",
          title: "テスト",
        },
      });
    } finally {
      fetchStub.restore();
    }
  });

  await t.step("No OGP tags", async () => {
    const fetchStub = stub(
      globalThis,
      "fetch",
      () =>
        Promise.resolve(
          new Response(NO_OGP_HTML_DATA, {
            "headers": { "Content-Type": "text/html" },
          }),
        ),
    );

    try {
      const meta = await parsedMeta("https://example.com");
      assertEquals<MetaData>(meta, {
        title: "テスト",
        description: "テスト",
        favicon: "/favicon.ico",
        open_graph: {
          description: null,
          image: null,
          site_name: null,
          title: null,
          type: null,
          url: null,
        },
        twitter: {
          card: null,
          description: null,
          image: null,
          site: null,
          title: null,
        },
      });
    } finally {
      fetchStub.restore();
    }
  });
});
