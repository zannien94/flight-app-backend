import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { REGEXES } from 'src/utils/consts';

@Schema({
  minimize: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Card extends mongoose.Document {
  @Prop({ required: true, match: REGEXES.CARD_NUMBER })
  number: string;
  @Prop({ required: true, match: REGEXES.EXPIRATION_DATE })
  expirationDate: string;
  @Prop({ required: true, match: REGEXES.CVC })
  cvc: string;

  completed: boolean;
}

export const CardSchema = SchemaFactory.createForClass(Card);

CardSchema.virtual('completed').get(function () {
  return this.number && this.expirationDate && this.cvc ? true : false;
});
