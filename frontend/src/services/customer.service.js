import api from './api';

export const getCustomers = async (params) => {
  const response = await api.get('/customers', { params });
  return response.data;
};

export const getCustomer = async (id) => {
  const response = await api.get(`/customers/${id}`);
  return response.data;
};

export const createCustomer = async (data) => {
  const response = await api.post('/customers', data);
  return response.data;
};

export const updateCustomer = async (id, data) => {
  const response = await api.patch(`/customers/${id}`, data);
  return response.data;
};

export const deleteCustomer = async (id) => {
  const response = await api.delete(`/customers/${id}`);
  return response.data;
};

export const getCustomerReservations = async (id, params) => {
  const response = await api.get(`/customers/${id}/reservations`, { params });
  return response.data;
};

export const getCustomerPreferences = async (id) => {
  const response = await api.get(`/customers/${id}/preferences`);
  return response.data;
};

export const updateCustomerPreferences = async (id, data) => {
  const response = await api.patch(`/customers/${id}/preferences`, data);
  return response.data;
};

export const getCustomerLoyalty = async (id) => {
  const response = await api.get(`/customers/${id}/loyalty`);
  return response.data;
};
