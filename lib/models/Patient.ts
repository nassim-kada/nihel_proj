import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IMedicalFile {
  name: string;
  url: string;
  fileType?: string;
  uploadedAt: Date;
}

export interface IPatient extends Document {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  wilaya: string;
  commune?: string;
  gender?: 'Homme' | 'Femme';
  passwordHash: string;
  profilePhotoUrl?: string;
  medicalFiles: IMedicalFile[];
  createdAt?: Date;
  updatedAt?: Date;
}

const MedicalFileSchema = new Schema<IMedicalFile>({
  name: { type: String, required: true },
  url: { type: String, required: true },
  fileType: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});

const PatientSchema = new Schema<IPatient>(
  {
    firstName: { type: String, required: true, maxlength: 60 },
    lastName: { type: String, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    wilaya: { type: String, required: true },
    commune: { type: String },
    gender: { type: String, enum: ['Homme', 'Femme'] },
    passwordHash: { type: String, required: true, select: false },
    profilePhotoUrl: { type: String },
    medicalFiles: { type: [MedicalFileSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
      const r = ret as Record<string, unknown>;
      delete r.passwordHash;
      return r;
    },
    },
  }
);

const PatientModel: Model<IPatient> =
  (mongoose.models.Patient as Model<IPatient>) ||
  mongoose.model<IPatient>('Patient', PatientSchema);

export default PatientModel;
