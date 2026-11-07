import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    title:      { type: String, required: true, trim: true },
    focus:      { type: String, trim: true, default: '' },
    company:    { type: String, required: true, trim: true },
    location:   { type: String, trim: true, default: '' },
    startDate:  { type: String, required: true },   // e.g. "July 2026"
    endDate:    { type: String, default: 'Present' },
    type: {
      type: String,
      enum: ['Internship', 'Full-time', 'Part-time', 'Freelance', 'Education'],
      default: 'Full-time',
    },
    highlights: [{ type: String }],
    order:      { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Experience', experienceSchema);
