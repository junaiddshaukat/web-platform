import mongoose from 'mongoose';

const ambassadorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  linkedin: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
ambassadorSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Ambassador = mongoose.models.Ambassador || mongoose.model('Ambassador', ambassadorSchema);

export { Ambassador }; 