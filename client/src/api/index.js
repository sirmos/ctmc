import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const api = axios.create({ baseURL: BASE_URL });

export const ingestSession = (data) => api.post('/memory/ingest', data);
export const recallMemory = (data) => api.post('/memory/recall', data);
export const generateReport = (data) => api.post('/reports/generate', data);
