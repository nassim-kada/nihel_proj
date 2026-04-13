import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface ISlot {
  date: string;
  times: string[];
}

export interface IDiploma {
  title: string;
  institution: string;
  year: string;
  country: string;
}

export interface IConsultationDay {
  day: string;
  startTime: string;
  endTime: string;
}

export interface IDoctor extends Document {
  // Legacy fields
  name: string;
  specialty: Types.ObjectId;
  clinic?: string;
  experience?: number;
  rating?: number;
  patients?: number;
  maxPatients?: number;
  bio?: string;
  fee?: string;
  phone: string;
  email: string;
  passwordHash?: string;
  /** @deprecated use passwordHash */
  password?: string;
  location?: string;
  availableSlots: ISlot[];

  // New extended fields
  type?: 'Médecin' | 'Clinique';
  hospital?: string;
  firstName?: string;
  lastName?: string;
  wilaya?: string;
  commune?: string;
  gender?: 'Homme' | 'Femme';
  dateOfBirth?: string;

  // Credentials
  subSpecialties?: string[];
  diplomas?: IDiploma[];
  medicalOrderNumber?: string;
  languages?: string[];
  diplomaFileUrl?: string;

  // Clinic
  clinicName?: string;
  clinicAddress?: string;
  clinicWilaya?: string;
  clinicCommune?: string;
  clinicPhone?: string;
  website?: string;
  consultationSchedule?: IConsultationDay[];
  clinicPhotoUrl?: string;
  mapLocation?: {
    lat: number;
    lng: number;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

const SlotSchema = new Schema<ISlot>(
  { date: { type: String, required: true }, times: { type: [String], required: true } }
);

const DiplomaSchema = new Schema<IDiploma>({
  title: String,
  institution: String,
  year: String,
  country: String,
});

const ConsultationDaySchema = new Schema<IConsultationDay>({
  day: String,
  startTime: String,
  endTime: String,
});

const DoctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true, maxlength: 60 },
    specialty: { type: Schema.Types.ObjectId, ref: 'Speciality', required: true },
    clinic: { type: String },
    experience: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    patients: { type: Number, default: 0 },
    maxPatients: { type: Number },
    bio: { type: String, maxlength: 500 },
    fee: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    passwordHash: { type: String, select: false },
    location: { type: String },
    availableSlots: { type: [SlotSchema], default: [] },

    type: { type: String, enum: ['Médecin', 'Clinique'] },
    hospital: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    wilaya: { type: String },
    commune: { type: String },
    gender: { type: String, enum: ['Homme', 'Femme'] },
    dateOfBirth: { type: String },

    subSpecialties: { type: [String], default: [] },
    diplomas: { type: [DiplomaSchema], default: [] },
    medicalOrderNumber: { type: String },
    languages: { type: [String], default: [] },
    diplomaFileUrl: { type: String },

    clinicName: { type: String },
    clinicAddress: { type: String },
    clinicWilaya: { type: String },
    clinicCommune: { type: String },
    clinicPhone: { type: String },
    website: { type: String },
    consultationSchedule: { type: [ConsultationDaySchema], default: [] },
    clinicPhotoUrl: { type: String },
    mapLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

const DoctorModel: Model<IDoctor> =
  (mongoose.models.Doctor as Model<IDoctor>) ||
  mongoose.model<IDoctor>('Doctor', DoctorSchema);

export default DoctorModel;