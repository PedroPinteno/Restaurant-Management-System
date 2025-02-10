import api from './api';

export const getReservations = async (params) => {
  const response = await api.get('/reservations', { params });
  return response.data;
};

export const getReservation = async (id) => {
  const response = await api.get(`/reservations/${id}`);
  return response.data;
};

export const createReservation = async (data) => {
  const response = await api.post('/reservations', data);
  return response.data;
};

export const updateReservation = async (id, data) => {
  const response = await api.patch(`/reservations/${id}`, data);
  return response.data;
};

export const cancelReservation = async (id, reason) => {
  const response = await api.post(`/reservations/${id}/cancel`, { reason });
  return response.data;
};

export const checkInReservation = async (id) => {
  const response = await api.post(`/reservations/${id}/check-in`);
  return response.data;
};

export const getReservationsByDate = async (params) => {
  const response = await api.get('/reservations/by-date', { params });
  return response.data;
};

export const getAvailableTables = async (params) => {
  const response = await api.get('/reservations/available-tables', { params });
  return response.data;
};
