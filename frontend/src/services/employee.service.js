import api from './api';

export const getEmployees = async (params) => {
  const response = await api.get('/employees', { params });
  return response.data;
};

export const getEmployee = async (id) => {
  const response = await api.get(`/employees/${id}`);
  return response.data;
};

export const createEmployee = async (data) => {
  const response = await api.post('/employees', data);
  return response.data;
};

export const updateEmployee = async (id, data) => {
  const response = await api.patch(`/employees/${id}`, data);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await api.delete(`/employees/${id}`);
  return response.data;
};

export const getEmployeeSchedule = async (id, params) => {
  const response = await api.get(`/employees/${id}/schedule`, { params });
  return response.data;
};

export const updateEmployeeSchedule = async (id, data) => {
  const response = await api.patch(`/employees/${id}/schedule`, data);
  return response.data;
};

export const getEmployeePerformance = async (id, params) => {
  const response = await api.get(`/employees/${id}/performance`, { params });
  return response.data;
};

export const assignEmployeeToRestaurant = async (id, restaurantId) => {
  const response = await api.post(`/employees/${id}/assign`, { restaurantId });
  return response.data;
};
