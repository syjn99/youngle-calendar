import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { currentMonthSlice } from '../features/currentMonth/currentMonthSlice';
import { schedulesSlice } from '../features/schedules/schedulesSlice';

const makeStore = () =>
  configureStore({
    reducer: {
      [schedulesSlice.name]: schedulesSlice.reducer,
      [currentMonthSlice.name]: currentMonthSlice.reducer,
    },
    devTools: true,
  })

export const wrapper = createWrapper(makeStore)