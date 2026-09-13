import api from './api';
export const getReports=()=>api.get('/reports');
export const getReport=(id)=>api.get(`/reports/${id}`);
export const updateReportStatus=(id,status)=>api.patch(`/reports/${id}/status`,{status});
export const getRiskEvents=(id)=>api.get(`/reports/${id}/risk-events`);

