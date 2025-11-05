import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { IBooking } from '@/types/booking'; 

export interface IBookingDocument extends IBooking, Document {}

const BookingSchema: Schema = new Schema<IBookingDocument>({
  doctorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Doctor',
    required: true 
  },
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  patientDescription: { type: String, default: '' },
  fee: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
    default: 'pending' 
  },
}, { 
  timestamps: true 
});

const BookingModel: Model<IBookingDocument> = 
  (mongoose.models.Booking as Model<IBookingDocument>) || 
  mongoose.model<IBookingDocument>('Booking', BookingSchema);

export default BookingModel;