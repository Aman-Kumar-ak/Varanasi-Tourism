import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITimeSlot extends Document {
  darshanTypeId: mongoose.Types.ObjectId;
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  maxBookings: number;
  isActive: boolean;
}

const TimeSlotSchema: Schema = new Schema<ITimeSlot>(
  {
    darshanTypeId: {
      type: Schema.Types.ObjectId,
      ref: 'DarshanType',
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format'],
    },
    endTime: {
      type: String,
      required: true,
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format'],
    },
    maxBookings: {
      type: Number,
      required: true,
      min: 1,
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
TimeSlotSchema.index({ darshanTypeId: 1, isActive: 1 });

const TimeSlot: Model<ITimeSlot> =
  mongoose.models.TimeSlot || mongoose.model<ITimeSlot>('TimeSlot', TimeSlotSchema);

export default TimeSlot;

