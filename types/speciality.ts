import { Document } from 'mongoose'; 

export interface ISpeciality {
  name: string; 
  description: string;
}

export interface ISpecialityDocument extends ISpeciality, Document {}