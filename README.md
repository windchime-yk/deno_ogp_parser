# deno_ogp_parser
[![codecov](https://codecov.io/gh/rwl-dev/deno_ogp_parser/graph/badge.svg?token=3WI5ALOM33)](https://codecov.io/gh/rwl-dev/deno_ogp_parser)  
OGP Parser for Deno

## Usage
```typescript
import { parsedMeta } from "https://deno.land/x/ogp_parser/mod.ts"

const result = parsedMeta("https://example.com")
console.log(result.title) // -> "Example Domain"
```
