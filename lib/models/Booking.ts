// models/Booking.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { IBooking } from '@/types/booking'; 

export interface IBookingDocument extends Omit<IBooking, '_id'>, Document {}

const BookingSchema: Schema = new Schema<IBookingDocument>({
  doctorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Doctor',
    required: true 
  },
  appointementType: {
    type: String,
    enum: [
      'Consultation',
      'Consultation de Controle',
      'Examen',
      'Radiologie/Imagerie', 
      'Urgence', 
      'Intervention'
    ],
    default: 'Consultation'
  },
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  patientId: { type: String },
  appointmentDate: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  patientDescription: { type: String, default: '' },
  fee: { type: String, required: true },
  fileLink: { type: String, default: '' },
  isUrgent: { type: Boolean, default: false },
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