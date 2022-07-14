import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({
  minimize: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform(doc, ret, options) {
      delete ret._id;
      return ret;
    },
  },
})
export class Flight extends mongoose.Document {
  @Prop({ required: true })
  flightNumber: string;
  @Prop({ required: true })
  city: string;
  @Prop({ required: true })
  fromDate: string;
  @Prop({ required: true })
  toDate: string;
  @Prop({ required: true })
  carrier: string;
  @Prop({ required: true })
  price: number;
  @Prop({ required: true })
  toAirport: string;
  @Prop({ required: true })
  fromAirport: string;
  @Prop({ required: true })
  toIata: string;
  @Prop({ required: true })
  fromIata: string;
  @Prop({ required: true })
  fromHour: number;
  @Prop({ required: true })
  toHour: number;
  @Prop({ required: true, default: 200 })
  seats: number;
  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: 'User',
    default: [],
    validate: [
      function (v: [mongoose.Types.ObjectId]) {
        return v.length < this.seats;
      },
      `Path reservations can't be longer than 'seats' value.`,
    ],
  })
  reservations: Array<mongoose.Types.ObjectId>;
}

export const FlightSchema = SchemaFactory.createForClass(Flight);

FlightSchema.virtual('availableSeats').get(function () {
  return this.seats - this.reservations.length;
});
