import api from './api';

export const getTables = async (params) => {
  const response = await api.get('/tables', { params });
  return response.data;
};

export const getTable = async (id) => {
  const response = await api.get(`/tables/${id}`);
  return response.data;
};

export const createTable = async (data) => {
  const response = await api.post('/tables', data);
  return response.data;
};

export const updateTable = async (id, data) => {
  const response = await api.patch(`/tables/${id}`, data);
  return response.data;
};

export const deleteTable = async (id) => {
  const response = await api.delete(`/tables/${id}`);
  return response.data;
};

export const checkTableAvailability = async (id, params) => {
  const response = await api.get(`/tables/${id}/availability`, { params });
  return response.data;
};

export const assignTable = async (id, data) => {
  const response = await api.post(`/tables/${id}/assign`, data);
  return response.data;
};

export const releaseTable = async (id) => {
  const response = await api.post(`/tables/${id}/release`);
  return response.data;
};
