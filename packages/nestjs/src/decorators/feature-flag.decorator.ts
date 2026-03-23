import { FEATURE_FLAG_KEY } from '@/constants';
import { SetMetadata } from '@nestjs/common';

export const FeatureFlag = (key: string) => SetMetadata(FEATURE_FLAG_KEY, key);
