import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  darkMode: localStorage.getItem('darkMode') === 'true',
  currentView: null,
  loading: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
    },
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const {
  toggleSidebar,
  toggleDarkMode,
  setCurrentView,
  setLoading
} = uiSlice.actions;

export default uiSlice.reducer;
