import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsMobilePhone,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty()
  @IsString()
  @IsMobilePhone('ne-NP')
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsBoolean()
  @IsNotEmpty()
  isBloodBank = false;
}
