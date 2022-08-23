import { createSlice, nanoid } from '@reduxjs/toolkit'
import { add } from 'date-fns'

const schedulesList = [
  {
    id: "1",
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
    id: "2",
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
    id: "3",
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
    "15": ["2"],
    "17": ["1"],
  },
  "2022-11": {
    "17": ["3"]
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
        let cnt = 0
        while (startTime <= endTime) {
          if (cnt !== 0 && startTime.getDay() !== 0) {
            startTime = add(startTime, { days: 1 })
            cnt = cnt + 1
            continue
          }
          const yyyymm = startTime.toISOString().substring(0, 7)
          if (!state.dateMap[yyyymm]) {
            console.log("no datemap", startTime.toISOString())
            state.dateMap[yyyymm] = {}
          }
          if (!state.dateMap[yyyymm][startTime.getDate()]) {
            state.dateMap[yyyymm][startTime.getDate()] = []
          }
          state.dateMap[yyyymm][startTime.getDate()].push(newSchedule.id)
          startTime = add(startTime, { days: 1 })
          cnt = cnt + 1
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
    },
    scheduleDeleted(state, action) {
      const index = state.schedulesList.findIndex(schedule => {
        return schedule?.id === action.payload
      })
      state.schedulesList[index] = null
    },
    scheduleEdited: {
      reducer(state, action) {
        console.log(action)
        const index = state.schedulesList.findIndex(schedule => {
          return schedule?.id === action.payload.originalId
        })
        state.schedulesList[index] = null
        const count = state.schedulesList.push(action.payload.edittedSchedule)
        const newSchedule = state.schedulesList[count - 1]
        let [startTime, endTime] = [add(newSchedule.time.startTime, { hours: 9 }), add(newSchedule.time.endTime, { hours: 9 })]
        while (startTime <= endTime) {
          const yyyymm = startTime.toISOString().substring(0, 7)
          if (!state.dateMap[yyyymm]) {
            console.log("no datemap", startTime.toISOString())
            state.dateMap[yyyymm] = {}
          }
          if (!state.dateMap[yyyymm][startTime.getDate()]) {
            state.dateMap[yyyymm][startTime.getDate()] = []
          }
          state.dateMap[yyyymm][startTime.getDate()].push(newSchedule.id)
          startTime = add(startTime, { days: 1 })
        }
      },
      prepare(id, title, startDate, endDate, description) {
        return {
          payload: {
            edittedSchedule: {
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
            originalId: id,
          },
        }
      }
    }
  }
})

export const { scheduleAdded, scheduleDeleted, scheduleEdited } = schedulesSlice.actions

export default schedulesSlice.reducer