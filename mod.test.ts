import { assertEquals } from "https://deno.land/std@0.188.0/testing/asserts.ts";
import { stub } from "https://deno.land/std@0.188.0/testing/mock.ts";
import { type MetaData, parsedMeta } from "./mod.ts";

const HTML_DATA = `
<html>
  <head>
    <title>テスト</title>
    <meta name="description" content="テスト">
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
      favicon: null,
      open_graph: {
        description: null,
        image: null,
        site_name: null,
        title: null,
        type: null,
        url: null,
      },
      title: "テスト",
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
