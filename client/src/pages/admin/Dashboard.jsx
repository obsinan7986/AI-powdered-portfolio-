/**
 * Admin Dashboard
 * Tabs: Projects | Experience | Skills | Messages | Stats
 */
import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

/* ===== Shared helpers ===== */
function StatCard({ icon, label, value }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <span className="text-2xl" aria-hidden="true">{icon}</span>
      <div>
        <p className="text-2xl font-heading font-bold" style={{ color: 'var(--color-primary)' }}>{value ?? '—'}</p>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
      </div>
    </div>
  );
}

function ConfirmButton({ onConfirm, label = 'Delete', children }) {
  const [confirm, setConfirm] = useState(false);
  return confirm ? (
    <div className="flex gap-1">
      <button onClick={onConfirm} className="btn btn-sm" style={{ background: '#ef4444', color: '#fff' }}>Sure?</button>
      <button onClick={() => setConfirm(false)} className="btn btn-ghost btn-sm">Cancel</button>
    </div>
  ) : (
    <button onClick={() => setConfirm(true)} className="btn btn-ghost btn-sm" aria-label={label}>{children || label}</button>
  );
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6"
        style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--color-text)' }}>{title}</h2>
          <button onClick={onClose} className="p-1 rounded" style={{ color: 'var(--color-text-muted)' }} aria-label="Close">✕</button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

/* ===== Projects Tab ===== */
function ProjectsTab() {
  const [projects, setProjects] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({});
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState('');

  const load = useCallback(() => api.get('/projects').then(r => setProjects(r.data.data)), []);
  useEffect(() => { load(); }, [load]);

  const openNew  = () => { setForm({ category: 'fullstack', featured: false }); setEditItem(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ ...p, techStack: Array.isArray(p.techStack) ? p.techStack.join(', ') : p.techStack }); setEditItem(p); setShowForm(true); };

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setMsg('');
    try {
      const payload = { ...form, techStack: typeof form.techStack === 'string' ? form.techStack.split(',').map(s => s.trim()).filter(Boolean) : form.techStack };
      if (editItem) await api.put(`/admin/projects/${editItem._id}`, payload);
      else await api.post('/admin/projects', payload);
      setMsg('Saved!'); load(); setShowForm(false);
    } catch (err) { setMsg(err.response?.data?.error || 'Error saving.'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    await api.delete(`/admin/projects/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-heading font-semibold" style={{ color: 'var(--color-text)' }}>Projects ({projects.length})</h2>
        <button onClick={openNew} className="btn btn-primary btn-sm">+ Add Project</button>
      </div>
      <div className="space-y-3">
        {projects.map(p => (
          <div key={p._id} className="card p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-sm truncate" style={{ color: 'var(--color-text)' }}>{p.title}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{p.category} {p.featured && '⭐'}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openEdit(p)} className="btn btn-ghost btn-sm">Edit</button>
              <ConfirmButton onConfirm={() => del(p._id)} label={`Delete ${p.title}`}>Delete</ConfirmButton>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <Modal title={editItem ? 'Edit Project' : 'New Project'} onClose={() => setShowForm(false)}>
          <form onSubmit={save} className="space-y-4">
            {[['title','Title *'],['slug','Slug'],['liveUrl','Live URL'],['githubUrl','GitHub URL'],['image','Image Path']].map(([key, lbl]) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>{lbl}</label>
                <input className="input" value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required={key === 'title'} />
              </div>
            ))}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Description *</label>
              <textarea className="input resize-none" rows={3} value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Tech Stack (comma separated)</label>
              <input className="input" value={form.techStack || ''} onChange={e => setForm(f => ({ ...f, techStack: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Category</label>
                <select className="input" value={form.category || 'fullstack'} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {['fullstack','frontend','design','other'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input type="checkbox" id="featured" checked={!!form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-[var(--color-primary)]" />
                <label htmlFor="featured" className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Featured</label>
              </div>
            </div>
            {msg && <p className="text-sm" style={{ color: msg === 'Saved!' ? '#10b981' : '#ef4444' }}>{msg}</p>}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn btn-primary flex-1">{saving ? 'Saving...' : 'Save Project'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost flex-1">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ===== Messages Tab ===== */
function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const load = useCallback(() => api.get('/admin/messages').then(r => setMessages(r.data.data)), []);
  useEffect(() => { load(); }, [load]);

  const markRead = async (id, read) => {
    await api.patch(`/admin/messages/${id}/mark-read`, { read });
    load();
  };
  const del = async (id) => { await api.delete(`/admin/messages/${id}`); load(); };

  return (
    <div>
      <h2 className="font-heading font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Messages ({messages.length})</h2>
      {messages.length === 0 ? (
        <p className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map(m => (
            <div key={m._id} className="card p-4" style={{ borderLeft: m.read ? '3px solid var(--color-border)' : '3px solid var(--color-primary)' }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>{m.name} <span style={{ color: 'var(--color-text-muted)' }}>— {m.email}</span></p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{new Date(m.createdAt).toLocaleString()} {!m.read && <span className="badge badge-primary ml-1">New</span>}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => markRead(m._id, !m.read)} className="btn btn-ghost btn-sm">{m.read ? 'Mark Unread' : 'Mark Read'}</button>
                  <ConfirmButton onConfirm={() => del(m._id)} label={`Delete message from ${m.name}`}>Delete</ConfirmButton>
                </div>
              </div>
              {m.subject && <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Re: {m.subject}</p>}
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{m.message}</p>
              <a href={`mailto:${m.email}?subject=Re: ${m.subject || 'Your message'}`} className="btn btn-outline btn-sm mt-3 inline-flex">Reply by Email</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== Skills Tab ===== */
function SkillsTab() {
  const [skills, setSkills] = useState([]);
  const [form, setForm]     = useState({ name: '', category: 'frontend', level: 80 });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => api.get('/skills').then(r => setSkills(r.data.data)), []);
  useEffect(() => { load(); }, [load]);

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) await api.put(`/admin/skills/${editId}`, form);
      else await api.post('/admin/skills', form);
      setForm({ name: '', category: 'frontend', level: 80 }); setEditId(null); load();
    } finally { setSaving(false); }
  };

  const del = async (id) => { await api.delete(`/admin/skills/${id}`); load(); };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h2 className="font-heading font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Skills ({skills.length})</h2>
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {skills.map(s => (
            <div key={s._id} className="card p-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{s.name}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{s.category} {s.level != null && `· ${s.level}%`}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => { setForm({ name: s.name, category: s.category, level: s.level ?? 80 }); setEditId(s._id); }} className="btn btn-ghost btn-sm">Edit</button>
                <ConfirmButton onConfirm={() => del(s._id)} label={`Delete ${s.name}`}>Del</ConfirmButton>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-heading font-semibold mb-4" style={{ color: 'var(--color-text)' }}>{editId ? 'Edit Skill' : 'Add Skill'}</h3>
        <form onSubmit={save} className="card p-5 space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Name *</label>
            <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Category</label>
            <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {['frontend','backend','database','design','tools','other'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Proficiency: {form.level}%</label>
            <input type="range" min="0" max="100" value={form.level} onChange={e => setForm(f => ({ ...f, level: Number(e.target.value) }))} className="w-full accent-[var(--color-primary)]" aria-label={`Skill level: ${form.level}%`} />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn btn-primary flex-1">{saving ? 'Saving...' : editId ? 'Update' : 'Add Skill'}</button>
            {editId && <button type="button" onClick={() => { setForm({ name: '', category: 'frontend', level: 80 }); setEditId(null); }} className="btn btn-ghost">Cancel</button>}
          </div>
        </form>
      </div>
    </div>
  );
}

/* ===== Stats Tab ===== */
function StatsTab() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/admin/stats').then(r => setStats(r.data.data)); }, []);
  return (
    <div>
      <h2 className="font-heading font-semibold mb-6" style={{ color: 'var(--color-text)' }}>Site Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon="📥" label="CV Downloads" value={stats?.cvDownloads} />
        <StatCard icon="📬" label="Contact Messages" value={stats?.contactForms} />
        <StatCard icon="🤖" label="AI Chat Messages" value={stats?.chatMessages} />
      </div>
    </div>
  );
}

/* ===== Main Dashboard ===== */
const TABS = [
  { key: 'projects',  label: '📁 Projects'  },
  { key: 'skills',    label: '💡 Skills'    },
  { key: 'messages',  label: '📬 Messages'  },
  { key: 'stats',     label: '📊 Stats'     },
];

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate          = useNavigate();
  const [tab, setTab]     = useState('projects');

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Obsa Portfolio</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-screen pt-20" style={{ background: 'var(--color-bg)' }}>
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading font-bold text-2xl" style={{ color: 'var(--color-text)' }}>Dashboard</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Welcome back, {admin?.name || admin?.email}</p>
            </div>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">Log Out</button>
          </div>

          {/* Tab nav */}
          <div className="flex flex-wrap gap-2 mb-8 border-b pb-4" style={{ borderColor: 'var(--color-border)' }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className="btn btn-sm transition-all"
                style={{
                  background: tab === t.key ? 'var(--color-primary)' : 'var(--color-bg-card)',
                  color: tab === t.key ? '#fff' : 'var(--color-text-secondary)',
                  border: `1.5px solid ${tab === t.key ? 'var(--color-primary)' : 'var(--color-border)'}`,
                }}
                aria-selected={tab === t.key}
                role="tab"
              >{t.label}</button>
            ))}
          </div>

          {/* Tab content */}
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {tab === 'projects'  && <ProjectsTab />}
            {tab === 'skills'    && <SkillsTab />}
            {tab === 'messages'  && <MessagesTab />}
            {tab === 'stats'     && <StatsTab />}
          </motion.div>
        </div>
      </div>
    </>
  );
}
