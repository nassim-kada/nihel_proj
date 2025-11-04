import mongoose,{Document,Model,Schema} from 'mongoose';
export interface ISlot{
    date:string;
    times:string[];
}
export interface IDoctor extends Document{
    id:string;
    name:string;
    specialty:string;
    clinic:string;
    experience:number;
    rating:number;
    patients:number;
    bio:string;
    fee:string;
    phone:string;
    email:string;
    password?:string;
    availableSlots:ISlot[]
}
const SlotSchema: Schema = new Schema<ISlot>({
  date: { type: String, required: true },
  times: { type: [String], required: true }
}, { _id: false });
const DoctorSchema:Schema = new Schema<IDoctor>({
  id: { type: String, required: true, unique: true }, // Le champ 'id' de votre JSON
  name: { type: String, required: true, maxlength: 60 },
  specialty: { type: String, required: true },
  clinic: { type: String, required: true },
  experience: { type: Number, required: true },
  rating: { type: Number, required: true },
  patients: { type: Number, required: true },
  bio: { type: String, required: true, maxlength: 500 },
  fee: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // IMPORTANT: Vous devriez hasher ce champ en production!
  
  availableSlots: {
    type: [SlotSchema],
    default: [],
  }
}, { 
  timestamps: true, 
  toJSON: { 
    virtuals: true, 
    transform: (doc, ret) => {
      
      return ret;
    } 
  }
});
const DoctorModel :Model<IDoctor>=(mongoose.models.Doctor as Model<IDoctor>||mongoose.model<IDoctor>('Doctor',DoctorSchema));
export default DoctorModel;