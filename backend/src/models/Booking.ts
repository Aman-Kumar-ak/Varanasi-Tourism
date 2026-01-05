import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttendee {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  idProof?: string;
  idProofNumber?: string;
}

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  jyotirlingaId: mongoose.Types.ObjectId;
  darshanTypeId: mongoose.Types.ObjectId;
  timeSlotId: mongoose.Types.ObjectId;
  date: Date;
  amount: number;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentId?: string;
  receiptNumber: string;
  qrCode?: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  // Attendee information
  primaryContact: {
    name: string;
    phone: string;
    email?: string;
  };
  adults: IAttendee[];
  children: IAttendee[];
  createdAt: Date;
}

const BookingSchema: Schema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jyotirlingaId: {
      type: Schema.Types.ObjectId,
      ref: 'Jyotirlinga',
      required: true,
    },
    darshanTypeId: {
      type: Schema.Types.ObjectId,
      ref: 'DarshanType',
      required: true,
    },
    timeSlotId: {
      type: Schema.Types.ObjectId,
      ref: 'TimeSlot',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentId: {
      type: String,
    },
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
    },
    qrCode: {
      type: String,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    primaryContact: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
      },
    },
    adults: [
      {
        name: { type: String, required: true },
        age: { type: Number, required: true, min: 0 },
        gender: {
          type: String,
          enum: ['male', 'female', 'other'],
          required: true,
        },
        idProof: { type: String },
        idProofNumber: { type: String },
      },
    ],
    children: [
      {
        name: { type: String, required: true },
        age: { type: Number, required: true, min: 0, max: 17 },
        gender: {
          type: String,
          enum: ['male', 'female', 'other'],
          required: true,
        },
        idProof: { type: String },
        idProofNumber: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
BookingSchema.index({ userId: 1 });
BookingSchema.index({ jyotirlingaId: 1 });
BookingSchema.index({ date: 1, timeSlotId: 1 });
// Note: receiptNumber already has unique: true which creates an index automatically
BookingSchema.index({ paymentStatus: 1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;

