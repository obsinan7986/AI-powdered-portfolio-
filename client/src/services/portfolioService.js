/**
 * Portfolio data fetchers.
 * Each function tries the API first; on any network/server error
 * it falls back to the local static JSON so the site never looks empty.
 */
import api from './api';
import fallback from '../data/fallback.json';

async function safeFetch(apiFn, fallbackData) {
  try {
    const res = await apiFn();
    return { data: res.data.data, grouped: res.data.grouped || null, error: null };
  } catch {
    return { data: fallbackData, grouped: null, error: 'offline' };
  }
}

export const fetchProjects   = (params) => safeFetch(() => api.get('/projects', { params }), fallback.projects);
export const fetchExperience = ()        => safeFetch(() => api.get('/experience'),            fallback.experience);
export const fetchSkills     = ()        => safeFetch(() => api.get('/skills'),                fallback.skills);

export const submitContact = (formData) => api.post('/contact', formData);

export const trackCvDownload = () =>
  api.post('/cv-download').catch(() => {}); // fire-and-forget — never block UI
