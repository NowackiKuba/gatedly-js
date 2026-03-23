import { InjectGatedly } from '@/decorators/inject-gatedly.decorator';
import { GatedlyService } from '@/gatedly.service';
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FEATURE_FLAG_KEY } from '@/constants';

@Injectable()
export class FeatureFlagGuard implements CanActivate {
  constructor(
    @InjectGatedly() private readonly gatedly: GatedlyService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const flagKey = this.reflector.get<string>(FEATURE_FLAG_KEY, context.getHandler());

    if (!flagKey) return true;

    const request = context.switchToHttp().getRequest();

    return this.gatedly.isEnabled(flagKey, {
      userId: request?.user?.id,
      attributes: request?.user?.attributes,
    });
  }
}
