import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedEmployee: null,
  filters: {
    restaurant: '',
    role: '',
    status: ''
  }
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  }
});

export const { setSelectedEmployee, setFilters, clearFilters } =
  employeeSlice.actions;

export default employeeSlice.reducer;
