import { PartialType } from '@nestjs/mapped-types';
import { CreateAdDto } from './create-ads.dto';

export class UpdateAdDto extends PartialType(CreateAdDto) {}