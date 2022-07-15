import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CardSchema, Card } from './card.schema';

@Schema({
  minimize: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform(doc, ret, options) {
      delete ret.passwordHash;
      delete ret._id;
      delete ret.currentTokenId;
      return ret;
    },
  },
})
export class User extends mongoose.Document {
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop()
  passwordHash: string;
  @Prop()
  currentTokenId: string;
  @Prop({ required: true, default: false })
  removed: boolean;
  @Prop()
  emailConfirmation: mongoose.Schema.Types.Mixed;
  @Prop({ type: CardSchema, default: {} })
  creditCard: Card;
  @Prop({ type: [mongoose.Types.ObjectId], ref: 'Flight', default: [] })
  flights: Array<mongoose.Types.ObjectId>;

  authenticate: (password: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('password').set(function (password) {
  if (password) {
    this.passwordHash = bcrypt.hashSync(password, 10);
  }
});

UserSchema.methods.authenticate = async function (
  password: string,
): Promise<boolean> {
  if (!this.passwordHash) {
    return false;
  }
  return await bcrypt.compare(password, this.passwordHash);
};
