import { BloodGroupEnum, GenderEnum } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsLatitude,
  IsLongitude,
  IsMobilePhone,
  IsEnum,
} from 'class-validator';

export class CreateDonorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMobilePhone('ne-NP')
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  dop: string;

  @IsString()
  @IsNotEmpty()
  dopNp: string;

  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @IsEnum(BloodGroupEnum)
  bloodGroup: BloodGroupEnum;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsLatitude()
  @IsOptional()
  latitude?: number;

  @IsLongitude()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  lastDonated?: string;
}
