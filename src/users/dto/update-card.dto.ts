import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCreditCardDto {
  @IsString()
  @IsNotEmpty()
  number: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @IsString()
  @IsNotEmpty()
  securityCode: string;
}
