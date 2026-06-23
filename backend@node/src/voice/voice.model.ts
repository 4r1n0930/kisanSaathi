import { Document, model, Schema } from 'mongoose';

export interface IVoiceHistory extends Document {
  userId: string | number;
  inputText: string;
  detectedIntent: string;
  responseText: string;
  createdAt: Date;
}

const voiceHistorySchema = new Schema<IVoiceHistory>(
  {
    userId: { type: Schema.Types.Mixed, required: true },
    inputText: { type: String, required: true },
    detectedIntent: { type: String, required: true },
    responseText: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date() },
  },
  { versionKey: false }
);

export const VoiceHistoryModel = model<IVoiceHistory>('VoiceHistory', voiceHistorySchema);
