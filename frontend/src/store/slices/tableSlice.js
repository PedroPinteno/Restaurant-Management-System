import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedTable: null,
  filters: {
    restaurant: '',
    status: '',
    type: ''
  }
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setSelectedTable: (state, action) => {
      state.selectedTable = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  }
});

export const { setSelectedTable, setFilters, clearFilters } = tableSlice.actions;

export default tableSlice.reducer;
