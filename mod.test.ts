import { assertEquals } from "https://deno.land/std@0.188.0/testing/asserts.ts";
import { stub } from "https://deno.land/std@0.188.0/testing/mock.ts";
import { type MetaData, parsedMeta } from "./mod.ts";

const HTML_DATA = `
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

Deno.test("parsedMeta", async () => {
  const fetchStub = stub(
    globalThis,
    "fetch",
    () =>
      Promise.resolve(
        new Response(HTML_DATA, { "headers": { "Content-Type": "text/html" } }),
      ),
  );

  try {
    const meta = await parsedMeta("https://example.com");
    assertEquals<MetaData>(meta, {
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
      title: "テスト",
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
