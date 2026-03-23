````markdown
# @gatedly/nestjs

NestJS SDK for [Gatedly](https://gatedly.dev) — feature flags with rollout, targeting, and A/B testing.

## Installation

```bash
npm install @gatedly/nestjs
# or
pnpm add @gatedly/nestjs
```
````

## Quick Start

### 1. Import the module

```typescript
// app.module.ts
import { GatedlyModule } from '@gatedly/nestjs';

@Module({
  imports: [
    GatedlyModule.forRoot({
      apiKey: process.env.GATEDLY_API_KEY,
    }),
  ],
})
export class AppModule {}
```

### 2. Use in a service

```typescript
import { GatedlyService } from '@gatedly/nestjs';

@Injectable()
export class CheckoutService {
  constructor(private readonly gatedly: GatedlyService) {}

  async checkout(userId: string) {
    const enabled = await this.gatedly.isEnabled('new-checkout', {
      userId,
      attributes: { plan: 'pro' },
    });

    if (enabled) {
      return this.newCheckoutFlow();
    }
    return this.oldCheckoutFlow();
  }
}
```

### 3. Use as a guard

```typescript
import { FeatureFlag, FeatureFlagGuard } from '@gatedly/nestjs';

@Controller('checkout')
export class CheckoutController {
  @Get()
  @UseGuards(FeatureFlagGuard)
  @FeatureFlag('new-checkout')
  async checkout() {
    // only runs if 'new-checkout' flag is enabled
  }
}
```

## Configuration

```typescript
GatedlyModule.forRoot({
  apiKey: 'gat_live_xxx', // required
  baseUrl: 'https://api.gatedly.dev', // optional, default: https://api.gatedly.dev
  cache: {
    ttl: 30, // optional, seconds, default: 30
    enabled: true, // optional, default: true
  },
  timeout: 5000, // optional, ms, default: 5000
});
```

### Async configuration

```typescript
GatedlyModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    apiKey: config.get('GATEDLY_API_KEY'),
  }),
  inject: [ConfigService],
});
```

## API

### `GatedlyService`

```typescript
// Check if a flag is enabled
isEnabled(key: string, context?: FlagContext): Promise<boolean>

// Get full flag response
getFlag(key: string, context?: FlagContext): Promise<FlagResponse>

// Get multiple flags at once
getAllFlags(keys: string[], context?: FlagContext): Promise<FlagResponse[]>
```

### `FlagContext`

```typescript
interface FlagContext {
  userId?: string;
  attributes?: Record<string, unknown>;
}
```

### `FlagResponse`

```typescript
interface FlagResponse {
  flagKey: string;
  enabled: boolean;
  reason: string;
}
```

### `@FeatureFlag(key: string)`

Decorator for use with `FeatureFlagGuard`. Marks a route handler with a feature flag key.

```typescript
@Get()
@UseGuards(FeatureFlagGuard)
@FeatureFlag('new-checkout')
async newCheckout() {}
```

### `@InjectGatedly()`

Shorthand for `@Inject(GatedlyService)`.

```typescript
constructor(@InjectGatedly() private readonly gatedly: GatedlyService) {}
```

## License

MIT © [Gatedly](https://gatedly.dev)

```

```
