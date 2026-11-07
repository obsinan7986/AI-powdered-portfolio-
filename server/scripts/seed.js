/**
 * Seed Script
 * npm run seed
 *
 * Clears all collections and repopulates from /server/data/portfolio.json.
 * Also creates the admin account from ADMIN_EMAIL + ADMIN_PASSWORD in .env.
 * Safe to re-run — it always starts fresh.
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import Project    from '../models/Project.js';
import Experience from '../models/Experience.js';
import Skill      from '../models/Skill.js';
import Admin      from '../models/Admin.js';
import Stats      from '../models/Stats.js';
import Message    from '../models/Message.js';

const __filename = fileURLToPath(import.meta.url);
const __dir      = dirname(__filename);

/* ---- Load portfolio.json ---- */
const dataPath = join(__dir, '../data/portfolio.json');
const data     = JSON.parse(readFileSync(dataPath, 'utf-8'));

/* ---- Connect ---- */
async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('placeholder')) {
    console.error('\n❌  MONGODB_URI is not set or still contains "placeholder".');
    console.error('   Fill in server/.env before seeding.\n');
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log('✅  Connected to MongoDB');
}

/* ---- Build skill documents from the grouped object in portfolio.json ---- */
function buildSkills(skillsObj) {
  const docs = [];
  const categoryOrder = ['frontend', 'backend', 'database', 'design', 'tools'];

  categoryOrder.forEach((category) => {
    const list = skillsObj[category] || [];
    list.forEach((item, idx) => {
      // Support both old format (plain string) and new format ({ name, level })
      const name  = typeof item === 'string' ? item : item.name;
      const level = typeof item === 'string' ? null : (item.level ?? null);
      docs.push({ name, category, level, order: idx });
    });
  });

  return docs;
}

/* ---- Main ---- */
async function seed() {
  await connect();

  console.log('\n🌱  Seeding database…\n');

  /* Clear existing data */
  await Promise.all([
    Project.deleteMany({}),
    Experience.deleteMany({}),
    Skill.deleteMany({}),
    Admin.deleteMany({}),
    Stats.deleteMany({}),
    Message.deleteMany({}),
  ]);
  console.log('   🗑️  Cleared all collections');

  /* Seed Projects */
  const projects = await Project.insertMany(
    data.projects.map((p, i) => ({ ...p, order: i }))
  );
  console.log(`   ✅  Inserted ${projects.length} projects`);

  /* Seed Experience */
  const experience = await Experience.insertMany(
    data.experience.map((e, i) => ({ ...e, order: i }))
  );
  console.log(`   ✅  Inserted ${experience.length} experience entries`);

  /* Seed Skills */
  const skillDocs = buildSkills(data.skills);
  const skills = await Skill.insertMany(skillDocs);
  console.log(`   ✅  Inserted ${skills.length} skills`);

  /* Seed Admin */
  const adminEmail    = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('   ⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping admin creation');
  } else {
    // Admin.pre('save') will hash the password automatically
    const admin = await Admin.create({
      email:    adminEmail,
      password: adminPassword,
      name:     'Obsa Tesfaye',
    });
    console.log(`   ✅  Admin account created: ${admin.email}`);
  }

  /* Seed Stats (empty baseline) */
  await Stats.create({ key: 'global', cvDownloads: 0, contactForms: 0, chatMessages: 0 });
  console.log('   ✅  Stats document initialized');

  console.log('\n🎉  Seeding complete!\n');
}

seed()
  .then(() => mongoose.disconnect())
  .catch((err) => {
    console.error('\n❌  Seed failed:', err.message);
    mongoose.disconnect();
    process.exit(1);
  });
