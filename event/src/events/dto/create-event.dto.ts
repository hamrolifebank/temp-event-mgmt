import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  IsMobilePhone,
  IsLongitude,
  IsLatitude,
  IsNumber,
} from 'class-validator';
export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: 'please give event name' })
  name: string;

  @IsMobilePhone('ne-NP')
  @IsNotEmpty()
  contactPhone: string;

  @IsEmail()
  @IsOptional()
  @IsString()
  contactEmail?: string;

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
  bloodBank: string;

  @IsNumber()
  @IsNotEmpty()
  target: number;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsBoolean()
  isClosed: false;

  @IsOptional()
  @IsString()
  organizationId: string;
}
