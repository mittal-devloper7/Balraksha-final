import api from './api';
export const getCoordinatorDashboard=()=>api.get('/coordinator/dashboard');
export const getHighPriority=()=>api.get('/coordinator/high-priority');
