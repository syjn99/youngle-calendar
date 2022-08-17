import { createSlice } from '@reduxjs/toolkit'

const today = new Date()

const initialState = {
  year: today.getFullYear(),
  month: today.getMonth()
}

export const currentMonthSlice = createSlice({
  name: 'currentMonth',
  initialState,
  reducers: {
    prevMonth(state, action) {
      if (state.month - 1 < 0) {
        state.year--
        state.month = 11
      } else {
        state.month--
      }
    },
    nextMonth(state, action) {
      if (state.month + 1 < 12) {
        state.month++
      } else {
        state.year++
        state.month = 0
      }
    }
  },
})

export const { prevMonth, nextMonth } = currentMonthSlice.actions

export default currentMonthSlice.reducer