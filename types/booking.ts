import { Types } from 'mongoose';

export interface IBooking {
  doctorId: Types.ObjectId;
  patientName: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  patientDescription?: string;
  fee: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}