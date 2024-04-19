import { PartialType } from '@nestjs/mapped-types';
import { CreateRateDto } from './create-rate.dto';

// DTO for updating a rate
export class UpdateRateDto extends PartialType(CreateRateDto) {}
