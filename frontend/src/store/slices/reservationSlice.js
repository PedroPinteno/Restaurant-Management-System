import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedReservation: null,
  filters: {
    restaurant: '',
    status: '',
    date: '',
    customer: ''
  }
};

const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    setSelectedReservation: (state, action) => {
      state.selectedReservation = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  }
});

export const { setSelectedReservation, setFilters, clearFilters } =
  reservationSlice.actions;

export default reservationSlice.reducer;
