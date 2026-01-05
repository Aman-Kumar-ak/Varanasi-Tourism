import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMultiLanguageContent {
  en: string;
  hi: string;
  [key: string]: string | undefined;
}

export interface IDarshanType extends Document {
  jyotirlingaId: mongoose.Types.ObjectId;
  name: IMultiLanguageContent;
  price: number;
  duration: number; // in minutes
  dailyLimit: number;
  description?: IMultiLanguageContent;
  isActive: boolean;
}

const MultiLanguageSchema = new Schema<IMultiLanguageContent>({
  en: { type: String, required: true },
  hi: { type: String, required: true },
});

const DarshanTypeSchema: Schema = new Schema<IDarshanType>(
  {
    jyotirlingaId: {
      type: Schema.Types.ObjectId,
      ref: 'Jyotirlinga',
      required: true,
    },
    name: {
      type: MultiLanguageSchema,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    dailyLimit: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: MultiLanguageSchema,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
DarshanTypeSchema.index({ jyotirlingaId: 1, isActive: 1 });

const DarshanType: Model<IDarshanType> =
  mongoose.models.DarshanType || mongoose.model<IDarshanType>('DarshanType', DarshanTypeSchema);

export default DarshanType;

