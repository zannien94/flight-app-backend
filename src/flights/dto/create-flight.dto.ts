import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';

export class CreateFlightDto {
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  flightNumber: string;
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsString()
  @IsNotEmpty()
  fromDate: string;
  @IsString()
  @IsNotEmpty()
  toDate: string;
  @IsString()
  @IsNotEmpty()
  carrier: string;
  @IsNumber()
  @IsNotEmpty()
  price: number;
  @IsString()
  @IsNotEmpty()
  toAirport: string;
  @IsString()
  @IsNotEmpty()
  fromAirport: string;
  @IsString()
  @IsNotEmpty()
  toIata: string;
  @IsString()
  @IsNotEmpty()
  fromIata: string;
  @IsNumber()
  @IsNotEmpty()
  fromHour: string;
  @IsNumber()
  @IsNotEmpty()
  toHour: string;
}
