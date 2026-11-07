import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    // frontend | backend | database | design | tools
    category: {
      type: String,
      required: true,
      enum: ['frontend', 'backend', 'database', 'design', 'tools', 'other'],
    },
    // 0-100 proficiency (optional, used for progress bars)
    level:    { type: Number, min: 0, max: 100, default: null },
    icon:     { type: String, default: '' },   // icon identifier or URL
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Skill', skillSchema);
