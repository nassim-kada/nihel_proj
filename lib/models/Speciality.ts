import mongoose, { Schema, Model } from 'mongoose';
import { ISpecialityDocument } from '@/types/speciality'; 

const SpecialitySchema: Schema = new Schema<ISpecialityDocument>({
  name: { 
    type: String, 
    required: true,
    unique: true 
  },
  description: { 
    type: String, 
    required: false,
    default: ''
  },
}, { 
  timestamps: true 
});

const SpecialityModel: Model<ISpecialityDocument> = 
  (mongoose.models.Speciality as Model<ISpecialityDocument>) || 
  mongoose.model<ISpecialityDocument>('Speciality', SpecialitySchema);

export default SpecialityModel;