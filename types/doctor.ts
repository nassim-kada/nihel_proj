export interface ISlot {
  date: string;
  times: string[];
}

export interface IDoctorData {
  _id: string;
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  experience: number;
  rating: number;
  patients: number;
  bio: string;
  fee: string;
  phone: string;
  email: string;
  availableSlots: ISlot[];
  createdAt: string;
  updatedAt: string;
}