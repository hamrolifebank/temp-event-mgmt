import {
  IsString,
  IsBoolean,
  IsMobilePhone,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

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
