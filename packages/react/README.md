# @gatedly/react

React SDK for [Gatedly](https://gatedly.dev) — feature flags with rollout, targeting, and A/B testing.

## Installation

```bash
npm install @gatedly/react
# or
pnpm add @gatedly/react
```

## Quick Start

### 1. Wrap your app with GatedlyProvider

```tsx
import { GatedlyProvider } from '@gatedly/react';

function App() {
  return (
    <GatedlyProvider apiKey={process.env.GATEDLY_API_KEY} userId='user_123'>
      <YourApp />
    </GatedlyProvider>
  );
}
```

### 2. Use the hook

```tsx
import { useFeatureFlag } from '@gatedly/react';

function Checkout() {
  const { enabled, loading } = useFeatureFlag('new-checkout');

  if (loading) return <Spinner />;
  if (enabled) return <NewCheckout />;
  return <OldCheckout />;
}
```

### 3. Or use the component

```tsx
import { FeatureFlag } from '@gatedly/react';

function App() {
  return (
    <FeatureFlag flag='new-checkout' fallback={<OldCheckout />}>
      <NewCheckout />
    </FeatureFlag>
  );
}
```

## API

### `GatedlyProvider`

Wrap your app at the root level. Creates a shared client and cache for all hooks and components.

```tsx
<GatedlyProvider
  apiKey='gat_live_xxx' // required
  userId='user_123' // optional, applied to all flag checks
  baseUrl='https://api.gatedly.dev' // optional
  cache={{ ttl: 30 }} // optional, seconds, default: 30
  timeout={5000} // optional, ms, default: 5000
>
  <App />
</GatedlyProvider>
```

---

### `useFeatureFlag(key, context?)`

Check a single feature flag.

```tsx
const { enabled, loading, error } = useFeatureFlag('new-checkout');

// with context
const { enabled } = useFeatureFlag('new-checkout', {
  userId: 'user_123',
  attributes: { plan: 'pro', country: 'PL' },
});
```

**Returns:**

| Property  | Type            | Description                 |
| --------- | --------------- | --------------------------- |
| `enabled` | `boolean`       | Whether the flag is enabled |
| `loading` | `boolean`       | True while fetching         |
| `error`   | `Error \| null` | Error if the request failed |

---

### `useFeatureFlags(keys, context?)`

Check multiple flags at once using a single API call.

```tsx
const { flags, loading, error } = useFeatureFlags(['dark-mode', 'new-checkout', 'beta-dashboard']);

if (flags['dark-mode']) {
  // dark mode is enabled
}
```

**Returns:**

| Property    | Type                      | Description                      |
| ----------- | ------------------------- | -------------------------------- |
| `flags`     | `Record<string, boolean>` | Map of flag key to enabled state |
| `responses` | `FlagResponse[]`          | Full API responses               |
| `loading`   | `boolean`                 | True while fetching              |
| `error`     | `Error \| null`           | Error if the request failed      |

---

### `<FeatureFlag />`

Conditionally render children based on a feature flag.

```tsx
// basic
<FeatureFlag flag="new-checkout">
  <NewCheckout />
</FeatureFlag>

// with fallback
<FeatureFlag flag="new-checkout" fallback={<OldCheckout />}>
  <NewCheckout />
</FeatureFlag>

// with loading state
<FeatureFlag
  flag="new-checkout"
  fallback={<OldCheckout />}
  loadingFallback={<Spinner />}
>
  <NewCheckout />
</FeatureFlag>

// with per-component context
<FeatureFlag
  flag="new-checkout"
  context={{ userId: 'user_123', attributes: { plan: 'pro' } }}
  fallback={<OldCheckout />}
>
  <NewCheckout />
</FeatureFlag>
```

**Props:**

| Prop              | Type          | Required | Description                    |
| ----------------- | ------------- | -------- | ------------------------------ |
| `flag`            | `string`      | ✓        | Feature flag key               |
| `context`         | `FlagContext` |          | Override context for this flag |
| `fallback`        | `ReactNode`   |          | Rendered when flag is disabled |
| `loadingFallback` | `ReactNode`   |          | Rendered while loading         |
| `children`        | `ReactNode`   | ✓        | Rendered when flag is enabled  |

---

### `FlagContext`

```typescript
interface FlagContext {
  userId?: string;
  attributes?: Record<string, unknown>;
}
```

## License

MIT © [Gatedly](https://gatedly.dev)
