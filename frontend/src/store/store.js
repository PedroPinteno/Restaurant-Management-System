import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import restaurantReducer from './slices/restaurantSlice';
import tableReducer from './slices/tableSlice';
import reservationReducer from './slices/reservationSlice';
import employeeReducer from './slices/employeeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    restaurant: restaurantReducer,
    table: tableReducer,
    reservation: reservationReducer,
    employee: employeeReducer
  }
});

export default store;
