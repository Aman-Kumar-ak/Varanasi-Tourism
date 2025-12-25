import mongoose, { Schema, Document, Model } from 'mongoose';

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

