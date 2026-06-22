import { Document, model, Schema } from 'mongoose';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'FARMER' | 'TRADER' | 'INSPECTOR';
  kisanId?: string;
  panNumber?: string;
  licenseNumber?: string;
  identityType?: string;
  identityNumber?: string;
  documents: string[];
  village?: string;
  location?: Location;
  createdAt: Date;
}

const locationSchema = new Schema(
  {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { _id: false },
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ['FARMER', 'TRADER', 'INSPECTOR'],
    },
    kisanId: { type: String, trim: true, sparse: true },
    panNumber: { type: String, trim: true, sparse: true },
    licenseNumber: { type: String, trim: true, sparse: true },
    identityType: { type: String, trim: true },
    identityNumber: { type: String, trim: true, sparse: true },
    documents: { type: [String], default: [] },
    village: { type: String, trim: true },
    location: { type: locationSchema },
    createdAt: { type: Date, default: () => new Date() },
  },
  {
    versionKey: false,
  },
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ kisanId: 1 }, { unique: true, sparse: true });
userSchema.index({ panNumber: 1 }, { unique: true, sparse: true });
userSchema.index({ licenseNumber: 1 }, { unique: true, sparse: true });
userSchema.index({ identityNumber: 1 }, { unique: true, sparse: true });

export const UserModel = model<IUser>('User', userSchema);
