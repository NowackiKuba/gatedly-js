# @gatedly/js

JavaScript/TypeScript SDK for [Gatedly](https://gatedly.dev) — feature flags with rollout, targeting, and A/B testing.

Works in Node.js, browsers, Edge runtimes, and Deno.

## Installation

```bash
npm install @gatedly/js
# or
pnpm add @gatedly/js
```

## Quick Start

```typescript
import { Gatedly } from "@gatedly/js";

const client = new Gatedly({ apiKey: "gat_live_xxx" });

// Check if a flag is enabled
const enabled = await client.isEnabled("new-checkout", {
  userId: "user_123",
  attributes: { plan: "pro" },
});

if (enabled) {
  // show new checkout
}
```

## API

### `new Gatedly(options)`

```typescript
const client = new Gatedly({
  apiKey: "gat_live_xxx", // required
  baseUrl: "https://api.gatedly.dev", // optional, default: https://api.gatedly.dev
  cache: {
    ttl: 30, // optional, seconds, default: 30
    enabled: true, // optional, default: true
  },
  timeout: 5000, // optional, ms, default: 5000
});
```

---

### `client.isEnabled(key, context?)`

Returns `true` if the flag is enabled for the given context.

```typescript
const enabled = await client.isEnabled("dark-mode");

// with context
const enabled = await client.isEnabled("dark-mode", {
  userId: "user_123",
  attributes: { plan: "pro", country: "PL" },
});
```

---

### `client.getFlag(key, context?)`

Returns the full flag response including variant and experimentId for A/B tests.

```typescript
const flag = await client.getFlag("checkout-button", {
  userId: "user_123",
});

console.log(flag.enabled); // true
console.log(flag.variant); // "treatment"
console.log(flag.experimentId); // "018f..."
console.log(flag.reason); // "experiment"
```

**Returns:**

```typescript
{
  flagKey: string;
  enabled: boolean;
  reason: string;
  variant?: string;       // present when flag is part of an A/B test
  experimentId?: string;  // present when flag is part of an A/B test
}
```

---

### `client.getFlags(keys, context?)`

Evaluate multiple flags in a single API call.

```typescript
const flags = await client.getFlags(
  ["dark-mode", "new-checkout", "beta-dashboard"],
  { userId: "user_123" },
);

flags.forEach((flag) => {
  console.log(flag.flagKey, flag.enabled);
});
```

---

### `client.clearCache()`

Manually clear the local flag cache.

```typescript
client.clearCache();
```

Useful when you want to force a fresh evaluation — for example after a user logs in or their plan changes.

---

## Caching

Flags are cached in memory for 30 seconds by default to avoid unnecessary API calls.

```typescript
// disable cache entirely
const client = new Gatedly({
  apiKey: "xxx",
  cache: { enabled: false },
});

// custom TTL
const client = new Gatedly({
  apiKey: "xxx",
  cache: { ttl: 60 }, // 60 seconds
});
```

---

## A/B Testing

When a flag is part of a running experiment, `getFlag` returns the assigned variant:

```typescript
const flag = await client.getFlag("checkout-button", { userId: "user_123" });

if (flag.variant === "treatment") {
  showNewCheckout();
} else {
  showOldCheckout();
}
```

The same user always receives the same variant — assignment is deterministic based on userId.

---

## Error Handling

The SDK never throws on flag evaluation failures — it fails safely:

```typescript
// if the API is unavailable, getFlag throws
// wrap in try/catch for graceful fallback
try {
  const flag = await client.getFlag("new-checkout", { userId });
  return flag.enabled;
} catch {
  return false; // fallback to disabled
}
```

---

## License

MIT © [Gatedly](https://gatedly.dev)
