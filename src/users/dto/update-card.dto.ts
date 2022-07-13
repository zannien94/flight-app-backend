import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { REGEXES } from 'src/utils/consts';

export class UpdateCreditCardDto {
  @IsString()
  @IsNotEmpty()
  @Matches(REGEXES.CARD_NUMBER)
  number: string;
  @IsString()
  @IsNotEmpty()
  @Matches(REGEXES.EXPIRATION_DATE)
  expirationDate: string;
  @IsString()
  @IsNotEmpty()
  @Matches(REGEXES.CVC)
  cvc: string;
}
