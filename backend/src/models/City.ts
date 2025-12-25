import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMultiLanguageContent {
  en: string;
  hi: string;
  [key: string]: string | undefined;
}

export interface IPlace {
  name: IMultiLanguageContent;
  description: IMultiLanguageContent;
  image?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface IHotel {
  name: string;
  address: string;
  priceRange: 'budget' | 'mid-range' | 'luxury';
  rating?: number;
  contact?: string;
  website?: string;
}

export interface IRestaurant {
  name: string;
  cuisine: string;
  address: string;
  priceRange: 'budget' | 'mid-range' | 'luxury';
  contact?: string;
}

export interface ICity extends Document {
  name: IMultiLanguageContent;
  jyotirlingaId: mongoose.Types.ObjectId;
  state: string;
  images: string[];
  places: IPlace[];
  hotels: IHotel[];
  restaurants: IRestaurant[];
  transportInfo: IMultiLanguageContent;
  emergencyContacts: Array<{
    name: string;
    phone: string;
    type: 'police' | 'hospital' | 'temple' | 'tourist-helpline';
  }>;
  weatherInfo?: {
    bestTimeToVisit: string;
    averageTemp: string;
  };
}

const MultiLanguageSchema = new Schema<IMultiLanguageContent>({
  en: { type: String, required: true },
  hi: { type: String, required: true },
});

const PlaceSchema = new Schema<IPlace>({
  name: { type: MultiLanguageSchema, required: true },
  description: { type: MultiLanguageSchema, required: true },
  image: String,
  location: {
    lat: Number,
    lng: Number,
  },
});

const HotelSchema = new Schema<IHotel>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  priceRange: {
    type: String,
    enum: ['budget', 'mid-range', 'luxury'],
    required: true,
  },
  rating: Number,
  contact: String,
  website: String,
});

const RestaurantSchema = new Schema<IRestaurant>({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  address: { type: String, required: true },
  priceRange: {
    type: String,
    enum: ['budget', 'mid-range', 'luxury'],
    required: true,
  },
  contact: String,
});

const CitySchema: Schema = new Schema<ICity>(
  {
    name: {
      type: MultiLanguageSchema,
      required: true,
    },
    jyotirlingaId: {
      type: Schema.Types.ObjectId,
      ref: 'Jyotirlinga',
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    images: [String],
    places: [PlaceSchema],
    hotels: [HotelSchema],
    restaurants: [RestaurantSchema],
    transportInfo: {
      type: MultiLanguageSchema,
      required: true,
    },
    emergencyContacts: [
      {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        type: {
          type: String,
          enum: ['police', 'hospital', 'temple', 'tourist-helpline'],
          required: true,
        },
      },
    ],
    weatherInfo: {
      bestTimeToVisit: String,
      averageTemp: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
CitySchema.index({ jyotirlingaId: 1 });
CitySchema.index({ state: 1 });

const City: Model<ICity> = mongoose.models.City || mongoose.model<ICity>('City', CitySchema);

export default City;

