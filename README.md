# deno_ogp_parser
OGP Parser for Deno

## Usage
```typescript
import { parsedMeta } from "https://deno.land/x/ogp_parser/mod.ts"

const result = parsedMeta("https://example.com")
console.log(result.title) // -> "Example Domain"
```
