import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMultiLanguageContent {
  en: string;
  hi: string;
  gu?: string;
  ta?: string;
  te?: string;
  mr?: string;
  bn?: string;
  kn?: string;
  ml?: string;
  or?: string;
  pa?: string;
  as?: string;
  ur?: string;
}

export interface IJyotirlinga extends Document {
  name: IMultiLanguageContent;
  slug: string; // URL-friendly identifier (e.g., 'kashi-vishwanath', 'somnath')
  city: string;
  state: string;
  stateCode: string;
  images: string[];
  location: {
    lat: number;
    lng: number;
  };
  templeRules: string[];
  nearbyPlaces: string[];
  isActive: boolean;
  displayOrder: number;
  // Optional: Custom page identifier for frontend customization
  pageTemplate?: string; // e.g., 'kashi-vishwanath', 'somnath', etc.
  // New fields for guide-first system
  bookingEnabled?: boolean;
  officialBookingUrl?: string;
  spiritualSignificance?: IMultiLanguageContent;
  history?: IMultiLanguageContent;
  darshanInfo?: IMultiLanguageContent;
}

const MultiLanguageSchema = new Schema<IMultiLanguageContent>({
  en: { type: String, required: true },
  hi: { type: String, required: true },
  gu: String,
  ta: String,
  te: String,
  mr: String,
  bn: String,
  kn: String,
  ml: String,
  or: String,
  pa: String,
  as: String,
  ur: String,
});

const JyotirlingaSchema: Schema = new Schema<IJyotirlinga>(
  {
    name: {
      type: MultiLanguageSchema,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    stateCode: {
      type: String,
      required: true,
      uppercase: true,
    },
    images: [String],
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    templeRules: [String],
    nearbyPlaces: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    pageTemplate: String,
    // New fields for guide-first system
    bookingEnabled: {
      type: Boolean,
      default: false,
    },
    officialBookingUrl: String,
    spiritualSignificance: MultiLanguageSchema,
    history: MultiLanguageSchema,
    darshanInfo: MultiLanguageSchema,
  },
  {
    timestamps: true,
  }
);

// Indexes for filtering
// Note: slug already has unique index from unique: true, so we don't need to add it again
JyotirlingaSchema.index({ state: 1 });
JyotirlingaSchema.index({ stateCode: 1 });
JyotirlingaSchema.index({ city: 1 });
JyotirlingaSchema.index({ isActive: 1 });

const Jyotirlinga: Model<IJyotirlinga> =
  mongoose.models.Jyotirlinga || mongoose.model<IJyotirlinga>('Jyotirlinga', JyotirlingaSchema);

export default Jyotirlinga;

