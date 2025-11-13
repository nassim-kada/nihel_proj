// lib/models/SharedFile.ts - Verified and corrected

import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// --- Interfaces ---
export interface ISharedFile extends Document {
    _id: Types.ObjectId;
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    fileName: string;
    fileUrl: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

// --- Schema ---
const SharedFileSchema = new Schema<ISharedFile>({
    sender: { 
        type: Schema.Types.ObjectId, 
        ref: 'Doctor', 
        required: [true, 'Sender is required'],
        index: true
    },
    receiver: { 
        type: Schema.Types.ObjectId, 
        ref: 'Doctor', 
        required: [true, 'Receiver is required'],
        index: true
    },
    fileName: { 
        type: String, 
        required: [true, 'File name is required'],
        maxlength: [255, 'File name too long'],
        trim: true
    },
    fileUrl: { 
        type: String, 
        required: [true, 'File URL is required'],
        trim: true
    },
    description: { 
        type: String, 
        maxlength: [500, 'Description too long'],
        default: '',
        trim: true
    }
}, {
    timestamps: true
});

// Compound indexes for efficient queries
SharedFileSchema.index({ receiver: 1, createdAt: -1 });
SharedFileSchema.index({ sender: 1, createdAt: -1 });

// --- Model Export ---
// This prevents model recompilation errors in Next.js
const SharedFileModel = 
    (mongoose.models.SharedFile as Model<ISharedFile>) ||
    mongoose.model<ISharedFile>('SharedFile', SharedFileSchema);

export default SharedFileModel;