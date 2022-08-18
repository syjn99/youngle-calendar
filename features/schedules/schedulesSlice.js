import { createSlice, nanoid } from '@reduxjs/toolkit'
import { add } from 'date-fns'

const schedulesList = [
  {
    id: 1,
    title: "first schedule",
    description: "this is first schedule!!",
    time: {
      isDetailSet: false,
      startTime: (new Date(2022, 7, 17)),
      endTime: (new Date(2022, 7, 17)),
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
      startTime: new Date(2022, 7, 15),
      endTime: new Date(2022, 7, 15),
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
      startTime: (new Date(2022, 10, 17)),
      endTime: (new Date(2022, 10, 17)),
    },
    repeat: {
    },
  },
]

const dateMap = {
  "2022-08": {
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
    scheduleAdded: {
      reducer(state, action) {
        const count = state.schedulesList.push(action.payload)

        const newSchedule = state.schedulesList[count - 1]
        let [startTime, endTime] = [add(newSchedule.time.startTime, { hours: 9 }), add(newSchedule.time.endTime, { hours: 9 })]
        while (startTime <= endTime) {
          const yyyymm = startTime.toISOString().substring(0, 7)
          console.log(startTime.toISOString())
          if (!state.dateMap[yyyymm]) {
            console.log("no datemap", startTime.toISOString())
            state.dateMap[yyyymm] = {}
          }
          if (!state.dateMap[yyyymm][startTime.getDate()]) {
            state.dateMap[yyyymm][startTime.getDate()] = []
          }
          state.dateMap[yyyymm][startTime.getDate()].push(newSchedule)
          startTime = add(startTime, { days: 1 })
        }
      },
      prepare(title, startDate, endDate, description) {
        return {
          payload: {
            id: nanoid(),
            title,
            description,
            time: {
              isDetailSet: false,
              startTime: startDate,
              endTime: endDate,
            },
            repeat: {
            },
          },
        }
      }
    }
  }
})

export const { scheduleAdded } = schedulesSlice.actions

export default schedulesSlice.reducer