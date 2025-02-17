import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import uploadReducer from './slices/uploadSlice';
import ngoReducer from './slices/ngoSlice';
import healthReducer from './slices/healthSlice';
import donationReducer from './slices/donationSlice';
import authReducer from './slices/authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['upload', 'donation', 'auth'], // Added auth to persist
};

const persistedUploadReducer = persistReducer(persistConfig, uploadReducer);
const persistedDonationReducer = persistReducer(persistConfig, donationReducer);
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    upload: persistedUploadReducer,
    ngo: ngoReducer,
    health: healthReducer,
    donation: persistedDonationReducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;