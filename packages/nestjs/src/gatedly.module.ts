import {
  DynamicModule,
  FactoryProvider,
  Module,
  ModuleMetadata,
} from '@nestjs/common';
import { GatedlyClient } from './gatedly.client';
import { GatedlyCache } from './gatedly.cache';
import { GatedlyService } from './gatedly.service';
import { GATEDLY_OPTIONS } from './constants';
import { GatedlyOptions } from './interfaces/gatedly-options.interface';

type GatedlyModuleAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<GatedlyOptions>, 'useFactory' | 'inject'>;

@Module({})
export class GatedlyModule {
  static forRoot(options: GatedlyOptions): DynamicModule {
    return {
      module: GatedlyModule,
      global: true,
      providers: [
        {
          provide: GATEDLY_OPTIONS,
          useValue: options,
        },
        GatedlyCache,
        GatedlyClient,
        GatedlyService,
      ],
      exports: [GatedlyService],
    };
  }

  static forRootAsync(options: GatedlyModuleAsyncOptions): DynamicModule {
    return {
      module: GatedlyModule,
      global: true,
      imports: options.imports,
      providers: [
        {
          provide: GATEDLY_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        GatedlyCache,
        GatedlyClient,
        GatedlyService,
      ],
      exports: [GatedlyService],
    };
  }
}
