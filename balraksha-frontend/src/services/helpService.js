import api from './api';
export const createHelp=(payload)=>api.post('/help',payload);
export const getHelpRequests=()=>api.get('/help');
export const getHelpRequest=(id)=>api.get(`/help/${id}`);
export const getHelpMessages=(id)=>api.get(`/help/${id}/messages`);
export const updateHelpStatus=(id,status)=>api.patch(`/help/${id}/status`,{status});
