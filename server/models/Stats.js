import mongoose from 'mongoose';

/**
 * Single-document stats store.
 * We always upsert the doc with key = 'global'.
 */
const statsSchema = new mongoose.Schema(
  {
    key:           { type: String, default: 'global', unique: true },
    cvDownloads:   { type: Number, default: 0 },
    contactForms:  { type: Number, default: 0 },
    chatMessages:  { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Helper: atomically increment a field
statsSchema.statics.increment = async function (field, amount = 1) {
  return this.findOneAndUpdate(
    { key: 'global' },
    { $inc: { [field]: amount } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

statsSchema.statics.getGlobal = async function () {
  const doc = await this.findOne({ key: 'global' });
  if (doc) return doc;
  return this.create({ key: 'global' });
};

export default mongoose.model('Stats', statsSchema);
