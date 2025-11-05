import mongoose, {Document,Model,Schema, Types} from 'mongoose';

export interface ISlot{
    date:string;
    times:string[];
}

export interface IDoctor extends Document{
    name:string;
    specialty: Types.ObjectId; 
    clinic?:string;
    experience?:number;
    rating?:number;
    patients?:number;
    bio?:string;
    fee?:string;
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

  name: { type: String, required: true, maxlength: 60 },
  specialty: { type: Schema.Types.ObjectId, ref: 'Speciality', required: true },
  clinic: { type: String, required: false },
  experience: { type: Number, required: false, default: 0 },
  rating: { type: Number, required: false, default: 0 },
  patients: { type: Number, required: false, default: 0 },
  bio: { type: String, required: false, maxlength: 500 },
  fee: { type: String, required: false },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  
  availableSlots: {
    type: [SlotSchema],
    default: [],
  }
}, { 
  timestamps: true, 
  toJSON: { 
    virtuals: true, 
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    } 
  }
});

const DoctorModel :Model<IDoctor> = mongoose.model<IDoctor>('Doctor', DoctorSchema);

export default DoctorModel;