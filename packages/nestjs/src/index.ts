export { GatedlyModule } from './gatedly.module';
export { GatedlyService } from './gatedly.service';
export { GatedlyCache } from './gatedly.cache';
export { GatedlyClient } from './gatedly.client';
export { FeatureFlagGuard } from './guards/feature-flag.guard';
export { FeatureFlag } from './decorators/feature-flag.decorator';
export { InjectGatedly } from './decorators/inject-gatedly.decorator';

// interfejsy
export type { GatedlyOptions } from './interfaces/gatedly-options.interface';
export type { FlagContext } from './interfaces/flag-context.interface';
export type { FlagResponse } from './interfaces/flag-response.interface';
