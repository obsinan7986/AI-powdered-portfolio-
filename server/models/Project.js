import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title must be 100 characters or fewer'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description must be 1000 characters or fewer'],
    },
    // fullstack | frontend | design
    category: {
      type: String,
      required: true,
      enum: ['fullstack', 'frontend', 'design', 'other'],
      default: 'fullstack',
    },
    techStack: [{ type: String, trim: true }],
    liveUrl:   { type: String, trim: true, default: '' },
    githubUrl: { type: String, trim: true, default: '' },
    image:     { type: String, trim: true, default: '/images/projects/placeholder.jpg' },
    featured:  { type: Boolean, default: false },
    order:     { type: Number, default: 0 },  // for manual sort
  },
  { timestamps: true }
);

// Auto-generate slug from title if not provided
projectSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Project', projectSchema);
