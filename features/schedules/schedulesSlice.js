import { createSlice } from '@reduxjs/toolkit'

const schedulesList = [
  {
    id: 1,
    title: "first schedule",
    description: "this is first schedule!!",
    time: {
      isDetailSet: false,
      startTime: (new Date(2022, 7, 17)).toISOString(),
      endTime: (new Date(2022, 7, 17)).toISOString(),
    },
    repeat: {
    },
  },
  {
    id: 2,
    title: "second schedule",
    description: "haha",
    time: {
      isDetailSet: false,
      startTime: new Date(2022, 7, 15).toISOString(),
      endTime: new Date(2022, 7, 15).toISOString(),
    },
    repeat: {
    },
  },
  {
    id: 3,
    title: "third schedule",
    description: "this is third schedule!!",
    time: {
      isDetailSet: false,
      startTime: (new Date(2022, 10, 17)).toISOString(),
      endTime: (new Date(2022, 10, 17)).toISOString(),
    },
    repeat: {
    },
  },
]

const dateMap = {
  "2022-8": {
    "15": [schedulesList[1]],
    "17": [schedulesList[0]],
  },
  "2022-11": {
    "17": [schedulesList[2]]
  }
}

const initialState = {
  schedulesList,
  dateMap,
}

export const schedulesSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    scheduleAdded(state, action) {
      console.log("scheduleAdded Reducer")
    }
  }
})

export const { scheduleAdded } = schedulesSlice.actions

export default schedulesSlice.reducer