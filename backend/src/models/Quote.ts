import mongoose, { Schema, Document, Model } from 'mongoose';
import { IMultiLanguageContent } from './City';

export interface IQuote extends Document {
  quote: IMultiLanguageContent;
  author: string;
  source?: IMultiLanguageContent;
  image?: string; // Cloudinary URL - optional, user will add later
  order: number;
  isActive: boolean;
  cityId?: mongoose.Types.ObjectId; // Optional: link to city
}

const MultiLanguageSchema = new Schema<IMultiLanguageContent>(
  {
    en: { type: String, required: true },
    hi: { type: String, required: true },
  },
  {
    strict: false, // Allow additional language fields (gu, ta, te, etc.)
    _id: false, // Don't create _id for subdocuments
  }
);

const QuoteSchema: Schema = new Schema<IQuote>(
  {
    quote: {
      type: MultiLanguageSchema,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    source: {
      type: MultiLanguageSchema,
      required: false,
    },
    image: {
      type: String,
      required: false, // Optional - user will add Cloudinary URL later
      default: '', // Placeholder - user will add Cloudinary URL
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    cityId: {
      type: Schema.Types.ObjectId,
      ref: 'City',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
QuoteSchema.index({ isActive: 1, order: 1 });
QuoteSchema.index({ cityId: 1 });

const Quote: Model<IQuote> = mongoose.models.Quote || mongoose.model<IQuote>('Quote', QuoteSchema);

export default Quote;
