import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HealthReport } from '../../types';

interface HealthState {
  reports: HealthReport[];
  currentReport: HealthReport | null;
  loading: boolean;
  error: string | null;
}

const initialState: HealthState = {
  reports: [],
  currentReport: null,
  loading: false,
  error: null,
};

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    setReports: (state, action: PayloadAction<HealthReport[]>) => {
      state.reports = action.payload;
    },
    setCurrentReport: (state, action: PayloadAction<HealthReport | null>) => {
      state.currentReport = action.payload;
    },
    addReport: (state, action: PayloadAction<HealthReport>) => {
      state.reports.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setReports, setCurrentReport, addReport, setLoading, setError } = healthSlice.actions;
export default healthSlice.reducer;