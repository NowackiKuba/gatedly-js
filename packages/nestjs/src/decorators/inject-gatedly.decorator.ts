import { GatedlyService } from '@/gatedly.service';
import { Inject } from '@nestjs/common';

export const InjectGatedly = () => Inject(GatedlyService);
