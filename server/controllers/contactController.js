import Message from '../models/Message.js';
import Stats   from '../models/Stats.js';
import { asyncHandler }    from '../middleware/errorHandler.js';
import { sendContactEmail } from '../utils/email.js';

// POST /api/contact
export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Always save to MongoDB first — guaranteed regardless of email status
  const doc = await Message.create({
    name,
    email,
    subject: subject || 'No subject',
    message,
    ip: req.ip || req.connection?.remoteAddress || '',
  });

  await Stats.increment('contactForms', 1).catch(() => {});

  // Try to send email — non-blocking, captures result for response
  const emailResult = await sendContactEmail({
    name,
    email,
    subject: subject || 'No subject',
    message,
  });

  // Always 201 — message is saved. Tell user if email also went.
  res.status(201).json({
    success: true,
    message: emailResult.sent
      ? "Thank you! Your message has been received and I've been notified. I'll get back to you soon."
      : "Thank you! Your message has been saved. I'll get back to you soon.",
    emailSent: emailResult.sent,
    data: { id: doc._id },
  });
});

/* ===== ADMIN ===== */

export const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json({ success: true, count: messages.length, data: messages });
});

export const markMessageRead = asyncHandler(async (req, res) => {
  const msg = await Message.findByIdAndUpdate(
    req.params.id,
    { read: req.body.read ?? true },
    { new: true }
  );
  if (!msg) return res.status(404).json({ success: false, error: 'Message not found.' });
  res.json({ success: true, data: msg });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const msg = await Message.findByIdAndDelete(req.params.id);
  if (!msg) return res.status(404).json({ success: false, error: 'Message not found.' });
  res.json({ success: true, message: 'Message deleted.' });
});
