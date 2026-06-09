import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001/api' });

export const ingestSession = (data) => api.post('/memory/ingest', data);
export const recallMemory = (data) => api.post('/memory/recall', data);
