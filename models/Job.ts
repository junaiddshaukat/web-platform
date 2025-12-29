// Using require() here avoids TS module-resolution issues in some environments where
// node_modules may not be present during type-checking.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: any;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mongoose: any = require('mongoose');
const { Schema, models } = mongoose;

const jobSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, default: '', trim: true }, // e.g. Lahore, PK
    workplaceType: { type: String, default: 'Remote', trim: true }, // Remote | Hybrid | Onsite
    employmentType: { type: String, default: 'Full-time', trim: true }, // Internship | Full-time | Part-time | Contract
    audience: { type: String, default: 'Both', trim: true }, // Students | Professionals | Both
    description: { type: String, required: true, trim: true },
    requirements: { type: String, default: '', trim: true },
    applyUrl: { type: String, default: '', trim: true },
    applyEmail: { type: String, default: '', trim: true },
    deadline: { type: Date },
    tags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    lastModifiedBy: { type: String, default: 'Unknown' },
  },
  { timestamps: true }
);

// Basic safety: don't allow jobs without any apply method
jobSchema.pre('validate', function (next: (err?: any) => void) {
  // @ts-expect-error - mongoose doc typing
  const applyUrl = (this.applyUrl || '').toString().trim();
  // @ts-expect-error - mongoose doc typing
  const applyEmail = (this.applyEmail || '').toString().trim();
  if (!applyUrl && !applyEmail) {
    // @ts-expect-error - mongoose doc typing
    this.invalidate('applyUrl', 'Either applyUrl or applyEmail is required');
  }
  next();
});

export const Job = models.Job || mongoose.model('Job', jobSchema);


