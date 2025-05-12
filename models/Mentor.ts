import mongoose, { Schema, Document } from 'mongoose';

export interface IMentor extends Document {
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  leetcode?: string;
  picture?: string;
  university?: string;
  mentees: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const MentorSchema = new Schema<IMentor>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    leetcode: {
      type: String,
      trim: true,
    },
    picture: {
      type: String,
      trim: true,
    },
    university: {
      type: String,
      trim: true,
    },
    mentees: [{
      type: Schema.Types.ObjectId,
      ref: 'Mentee'
    }]
  },
  {
    timestamps: true,
  }
);

export const Mentor = mongoose.models.Mentor || mongoose.model<IMentor>('Mentor', MentorSchema); 