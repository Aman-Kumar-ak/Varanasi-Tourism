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
  category?: 'temple' | 'ghat' | 'monument' | 'market' | 'museum' | 'other';
  spiritualImportance?: IMultiLanguageContent;
  bestTimeToVisit?: string;
  visitDuration?: string;
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

export interface IEntryPoint {
  type: 'airport' | 'railway' | 'bus';
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  code?: string;
}

export interface ITransportOption {
  type: 'taxi' | 'auto' | 'rickshaw' | 'bus' | 'metro' | 'boat';
  name: string;
  description: IMultiLanguageContent;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  perKm?: boolean;
  perHour?: boolean;
}

export interface IRouteTransportOption {
  type: string;
  priceRange: {
    min: number;
    max: number;
  };
  estimatedTime: number;
  tips?: IMultiLanguageContent;
}

export interface IRoute {
  from: string;
  to: string;
  distance: number;
  duration: number;
  transportOptions: IRouteTransportOption[];
  routeDescription?: IMultiLanguageContent;
}

export interface IFestival {
  name: string;
  date: string;
  description: IMultiLanguageContent;
}

export interface IRitual {
  name: IMultiLanguageContent;
  description: IMultiLanguageContent;
  timing?: string;
}

export interface IEvent {
  name: string;
  date: string;
  endDate?: string;
  type: 'festival' | 'cultural' | 'sports' | 'academic' | 'exhibition' | 'performance';
  description: IMultiLanguageContent;
  venue?: string;
  website?: string;
  contact?: string;
}

export interface IKashiRopeway {
  name: IMultiLanguageContent;
  description: IMultiLanguageContent;
  route: IMultiLanguageContent;
  stations: Array<{
    name: string;
    description?: IMultiLanguageContent;
    confirmed?: boolean;
  }>;
  openingDate?: string;
  capacity?: string;
  ticketPrice?: {
    min: number;
    max: number;
    currency: string;
  };
  features?: IMultiLanguageContent;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface ICricketStadium {
  name: IMultiLanguageContent;
  description: IMultiLanguageContent;
  capacity: string;
  openingDate?: string;
  features?: IMultiLanguageContent;
  location?: {
    lat: number;
    lng: number;
  };
  tourInfo?: IMultiLanguageContent;
  contact?: string;
}

export interface IWellnessCenter {
  name: string;
  type: 'yoga' | 'meditation' | 'ayurveda' | 'spa' | 'retreat';
  description: IMultiLanguageContent;
  address: string;
  contact?: string;
  website?: string;
  priceRange?: 'budget' | 'mid-range' | 'luxury';
  rating?: number;
}

export interface IAcademicInstitution {
  name: string;
  type: 'university' | 'college' | 'institute' | 'research';
  description: IMultiLanguageContent;
  address: string;
  contact?: string;
  website?: string;
  campusTour?: boolean;
  notableFeatures?: IMultiLanguageContent;
}

export interface ICity extends Document {
  name: IMultiLanguageContent;
  jyotirlingaId: mongoose.Types.ObjectId;
  state: string;
  images: string[];
  videos?: string[];
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
  // New fields for guide-first system
  bookingEnabled?: boolean;
  officialBookingUrl?: string;
  spiritualSignificance?: IMultiLanguageContent;
  history?: IMultiLanguageContent;
  festivals?: IFestival[];
  rituals?: IRitual[];
  darshanInfo?: IMultiLanguageContent;
  // Transportation system
  entryPoints?: IEntryPoint[];
  transportOptions?: ITransportOption[];
  routes?: IRoute[];
  transportTips?: IMultiLanguageContent;
  // New features
  events?: IEvent[];
  kashiRopeway?: IKashiRopeway;
  cricketStadium?: ICricketStadium;
  wellnessCenters?: IWellnessCenter[];
  academicInstitutions?: IAcademicInstitution[];
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

const PlaceSchema = new Schema<IPlace>({
  name: { type: MultiLanguageSchema, required: true },
  description: { type: MultiLanguageSchema, required: true },
  image: String,
  location: {
    lat: Number,
    lng: Number,
  },
  category: {
    type: String,
    enum: ['temple', 'ghat', 'monument', 'market', 'museum', 'other'],
  },
  spiritualImportance: MultiLanguageSchema,
  bestTimeToVisit: String,
  visitDuration: String,
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

const EntryPointSchema = new Schema<IEntryPoint>({
  type: {
    type: String,
    enum: ['airport', 'railway', 'bus'],
    required: true,
  },
  name: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  code: String,
});

const TransportOptionSchema = new Schema<ITransportOption>({
  type: {
    type: String,
    enum: ['taxi', 'auto', 'rickshaw', 'bus', 'metro', 'boat'],
    required: true,
  },
  name: { type: String, required: true },
  description: { type: MultiLanguageSchema, required: true },
  priceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
  },
  perKm: Boolean,
  perHour: Boolean,
});

const RouteTransportOptionSchema = new Schema<IRouteTransportOption>({
  type: { type: String, required: true },
  priceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  estimatedTime: { type: Number, required: true },
  tips: MultiLanguageSchema,
});

const RouteSchema = new Schema<IRoute>({
  from: { type: String, required: true },
  to: { type: String, required: true },
  distance: { type: Number, required: true },
  duration: { type: Number, required: true },
  transportOptions: [RouteTransportOptionSchema],
  routeDescription: MultiLanguageSchema,
});

const FestivalSchema = new Schema<IFestival>({
  name: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: MultiLanguageSchema, required: true },
});

const RitualSchema = new Schema<IRitual>({
  name: { type: MultiLanguageSchema, required: true },
  description: { type: MultiLanguageSchema, required: true },
  timing: String,
});

const EventSchema = new Schema<IEvent>({
  name: { type: String, required: true },
  date: { type: String, required: true },
  endDate: String,
  type: {
    type: String,
    enum: ['festival', 'cultural', 'sports', 'academic', 'exhibition', 'performance'],
    required: true,
  },
  description: { type: MultiLanguageSchema, required: true },
  venue: String,
  website: String,
  contact: String,
});

const KashiRopewaySchema = new Schema<IKashiRopeway>({
  name: { type: MultiLanguageSchema, required: true },
  description: { type: MultiLanguageSchema, required: true },
  route: { type: MultiLanguageSchema, required: true },
  stations: [{
    name: { type: String, required: true },
    description: MultiLanguageSchema,
    confirmed: { type: Boolean, default: true },
  }],
  openingDate: String,
  capacity: String,
  ticketPrice: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'INR' },
  },
  features: MultiLanguageSchema,
  location: {
    lat: Number,
    lng: Number,
  },
});

const CricketStadiumSchema = new Schema<ICricketStadium>({
  name: { type: MultiLanguageSchema, required: true },
  description: { type: MultiLanguageSchema, required: true },
  capacity: { type: String, required: true },
  openingDate: String,
  features: MultiLanguageSchema,
  location: {
    lat: Number,
    lng: Number,
  },
  tourInfo: MultiLanguageSchema,
  contact: String,
});

const WellnessCenterSchema = new Schema<IWellnessCenter>({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['yoga', 'meditation', 'ayurveda', 'spa', 'retreat'],
    required: true,
  },
  description: { type: MultiLanguageSchema, required: true },
  address: { type: String, required: true },
  contact: String,
  website: String,
  priceRange: {
    type: String,
    enum: ['budget', 'mid-range', 'luxury'],
  },
  rating: Number,
});

const AcademicInstitutionSchema = new Schema<IAcademicInstitution>({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['university', 'college', 'institute', 'research'],
    required: true,
  },
  description: { type: MultiLanguageSchema, required: true },
  address: { type: String, required: true },
  contact: String,
  website: String,
  campusTour: Boolean,
  notableFeatures: MultiLanguageSchema,
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
    videos: [String],
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
    // New fields for guide-first system
    bookingEnabled: {
      type: Boolean,
      default: false,
    },
    officialBookingUrl: String,
    spiritualSignificance: MultiLanguageSchema,
    history: MultiLanguageSchema,
    festivals: [FestivalSchema],
    rituals: [RitualSchema],
    darshanInfo: MultiLanguageSchema,
    // Transportation system
    entryPoints: [EntryPointSchema],
    transportOptions: [TransportOptionSchema],
    routes: [RouteSchema],
    transportTips: MultiLanguageSchema,
    // New features
    events: [EventSchema],
    kashiRopeway: KashiRopewaySchema,
    cricketStadium: CricketStadiumSchema,
    wellnessCenters: [WellnessCenterSchema],
    academicInstitutions: [AcademicInstitutionSchema],
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

