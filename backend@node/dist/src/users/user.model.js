"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const locationSchema = new mongoose_1.Schema({
    latitude: { type: Number },
    longitude: { type: Number },
}, { _id: false });
const userSchema = new mongoose_1.Schema({
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
}, {
    versionKey: false,
});
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ kisanId: 1 }, { unique: true, sparse: true });
userSchema.index({ panNumber: 1 }, { unique: true, sparse: true });
userSchema.index({ licenseNumber: 1 }, { unique: true, sparse: true });
userSchema.index({ identityNumber: 1 }, { unique: true, sparse: true });
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
