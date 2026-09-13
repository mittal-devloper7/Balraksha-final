import api from './api';
export const analyzeThreat=(payload)=>api.post('/threat/analyze',payload);
