# deno_ogp_parser
[![codecov](https://codecov.io/gh/windchime-yk/deno_ogp_parser/graph/badge.svg?token=3WI5ALOM33)](https://codecov.io/gh/windchime-yk/deno_ogp_parser)  
OGP Parser for Deno

## Usage
```typescript
import { parsedMeta } from "https://deno.land/x/ogp_parser/mod.ts"

const result = parsedMeta("https://example.com")
console.log(result.title) // -> "Example Domain"
```
If you want to restrict the allowed origins, use the `allowOrigins` option.
```typescript
import { parsedMeta } from "https://deno.land/x/ogp_parser/mod.ts"

const result = parsedMeta("https://example.com", {
  allowOrigins: ["https://example.com"],
});
console.log(result.title) // -> "Example Domain"
```

## Recommends
Since metadata does not change frequently, we recommend caching the retrieved results in [Deno KV](https://deno.com/kv).
