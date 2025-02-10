import api from './api';

export const getRestaurants = async (params) => {
  const response = await api.get('/restaurants', { params });
  return response.data;
};

export const getRestaurant = async (id) => {
  const response = await api.get(`/restaurants/${id}`);
  return response.data;
};

export const createRestaurant = async (data) => {
  const response = await api.post('/restaurants', data);
  return response.data;
};

export const updateRestaurant = async (id, data) => {
  const response = await api.patch(`/restaurants/${id}`, data);
  return response.data;
};

export const deleteRestaurant = async (id) => {
  const response = await api.delete(`/restaurants/${id}`);
  return response.data;
};

export const getRestaurantTables = async (id) => {
  const response = await api.get(`/restaurants/${id}/tables`);
  return response.data;
};

export const getRestaurantEmployees = async (id) => {
  const response = await api.get(`/restaurants/${id}/employees`);
  return response.data;
};

export const getRestaurantAnalytics = async (id, params) => {
  const response = await api.get(`/restaurants/${id}/analytics`, { params });
  return response.data;
};

export const getNearbyRestaurants = async (params) => {
  const response = await api.get('/restaurants/nearby', { params });
  return response.data;
};
