import axios from 'axios';
const baseURL=import.meta.env.VITE_API_URL||(import.meta.env.DEV?'http://localhost:5000/api':'/api');
const api=axios.create({baseURL,timeout:12000});
api.interceptors.request.use(config=>{const token=localStorage.getItem('balraksha_token');if(token)config.headers.Authorization=`Bearer ${token}`;return config;});
api.interceptors.response.use(r=>r,err=>{if(err.response?.status===401){localStorage.removeItem('balraksha_token');localStorage.removeItem('balraksha_user');if(!location.pathname.startsWith('/login'))location.href='/login';}return Promise.reject(err);});
export default api;
