import type { ReturnModelType } from '@typegoose/typegoose';
import { getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';
import type { Document } from 'mongoose';
import { Types } from 'mongoose';
import { getRandomFloat, getRandomInt } from 'src/helpers/utils';

@modelOptions({
  schemaOptions: {
    timestamps: false,
    versionKey: false,
    _id: false,
  },
})
class Information {
  @prop()
  month: number;

  @prop()
  year: number;

  @prop()
  value: Types.Decimal128;
}

@index({ userId: 1 }, { unique: true })
export class Tax {
  @prop()
  userId: string;

  @prop({ default: [], type: () => [Information] })
  taxes: Information[];

  static async findByUserId(
    this: ReturnModelType<typeof Tax>,
    userId: string,
  ): Promise<TaxDocument | null> {
    return this.findOne({ userId }, { taxes: 1 }).lean();
  }

  static async generateTaxes(this: ReturnModelType<typeof Tax>, userId: string): Promise<void> {
    await this.findOneAndUpdate(
      { userId },
      {
        $push: {
          taxes: {
            month: getRandomInt(1, 12),
            year: getRandomInt(2010, 2021),
            value: new Types.Decimal128(getRandomFloat(20, 100).toString()),
          },
        },
      },
      { upsert: true },
    ).lean();
  }
}

export type TaxDocument = Tax & Document;

const TaxModel = getModelForClass(Tax);

export default TaxModel;
