import api from './api';
export const uploadEvidence=(id,file,onUploadProgress)=>{const form=new FormData();form.append('evidence',file);return api.post(`/evidence/${id}`,form,{headers:{'Content-Type':'multipart/form-data'},onUploadProgress});};
export const getEvidence=(id)=>api.get(`/evidence/${id}`);
