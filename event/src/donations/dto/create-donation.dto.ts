import { BloodTypeBagEnum } from '@prisma/client';
import { IsEnum, IsString, IsOptional } from 'class-validator';

export class CreateDonationDto {
  @IsEnum(BloodTypeBagEnum)
  @IsOptional()
  bloodBagType?: BloodTypeBagEnum;

  @IsString()
  @IsOptional()
  bloodBagId?: string;

  @IsString()
  @IsOptional()
  tubeId?: string;

  @IsString()
  @IsOptional()
  consentUrl?: string;

  @IsOptional()
  rejectReason?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsOptional()
  extras?: string;

  @IsString()
  @IsOptional()
  custom?: string;

  @IsString()
  @IsOptional()
  eventId?: string;

  @IsString()
  @IsOptional()
  donorId?: string;
}
