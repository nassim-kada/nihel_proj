// types/booking.ts
import { Types } from 'mongoose';

export interface IBooking {
  _id?: string;
  doctorId: Types.ObjectId | string;
  patientName: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  patientDescription?: string;
  fee: string;
  appointementType: Types.ObjectId | string;
  fileLink?: string; 
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}