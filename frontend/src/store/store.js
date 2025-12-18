import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from 'redux-devtools-extension';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: { auth: authReducer },
  devTools: composeWithDevTools()
});