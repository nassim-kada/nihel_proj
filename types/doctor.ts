import { Types } from 'mongoose';

export interface ISlot{
    date:string;
    times:string[];
}
type SpecialtyRef = Types.ObjectId | { name: string, description: string };

export interface IDoctorData {
  _id: string; 
  name: string;
  specialty: SpecialtyRef;
  clinic?: string; 
  location?: string;
  experience?: number; 
  rating?: number; 
  patients?: number; 
  bio?: string; 
  fee?: string; 
  phone: string;
  email: string;
  wilaya?: string;
  commune?: string;
  mapLocation?: { lat: number; lng: number };
  availableSlots: ISlot[];
  createdAt: string;
  updatedAt: string;
}