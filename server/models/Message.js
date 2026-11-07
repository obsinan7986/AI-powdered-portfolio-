import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true, maxlength: 100 },
    email:   { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, trim: true, maxlength: 200, default: 'No subject' },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    // Track whether the admin has read/replied
    read:    { type: Boolean, default: false },
    replied: { type: Boolean, default: false },
    // IP stored for abuse prevention (hashed in production if privacy required)
    ip:      { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
