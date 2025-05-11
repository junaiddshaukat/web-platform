import mongoose, { Schema, models } from 'mongoose';

const activityLogSchema = new Schema({
  entityType: { type: String, required: true }, // 'Ambassador', 'CoreTeam', 'Session'
  entityId: { type: String, required: true },
  action: { type: String, required: true }, // 'add', 'edit', 'delete'
  adminUsername: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: Schema.Types.Mixed }, // e.g. { name: 'John Doe' }
});

export const ActivityLog = models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema); 