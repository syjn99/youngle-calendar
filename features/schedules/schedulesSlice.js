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
        let [startTime, endTime] = [newSchedule.time.startTime, newSchedule.time.endTime]

        if (startTime.getDate() === 1) {
          startTime = add(startTime, { hours: 9 })
          endTime = add(endTime, { hours: 9 })
        }


        let firstDay = true


        while (startTime <= endTime) {


          if (startTime.getDay() !== 0) {
            if (!firstDay) {
              startTime = add(startTime, { days: 1 })
              continue
            }
          }


          const yyyymm = startTime.toISOString().substring(0, 7)
          if (!state.dateMap[yyyymm]) {
            state.dateMap[yyyymm] = {}
          }
          if (!state.dateMap[yyyymm][startTime.getDate()]) {
            state.dateMap[yyyymm][startTime.getDate()] = []
          }
          state.dateMap[yyyymm][startTime.getDate()].push(newSchedule.id)
          startTime = add(startTime, { days: 1 })


          firstDay = false


        }
      },
      prepare(title, time, description) {
        return {
          payload: {
            id: nanoid(),
            title,
            description,
            time,
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
        const index = state.schedulesList.findIndex(schedule => {
          return schedule?.id === action.payload.originalId
        })
        state.schedulesList[index] = null

        const count = state.schedulesList.push(action.payload.edittedSchedule)
        const newSchedule = state.schedulesList[count - 1]
        let [startTime, endTime] = [newSchedule.time.startTime, newSchedule.time.endTime]

        if (startTime.getDate() === 1) {
          startTime = add(startTime, { hours: 9 })
          endTime = add(endTime, { hours: 9 })
        }

        let firstDay = true

        while (startTime <= endTime) {
          if (startTime.getDay() !== 0) {
            if (!firstDay) {
              startTime = add(startTime, { days: 1 })
              continue
            }
          }
          const yyyymm = startTime.toISOString().substring(0, 7)
          if (!state.dateMap[yyyymm]) {
            state.dateMap[yyyymm] = {}
          }
          if (!state.dateMap[yyyymm][startTime.getDate()]) {
            state.dateMap[yyyymm][startTime.getDate()] = []
          }
          state.dateMap[yyyymm][startTime.getDate()].push(newSchedule.id)
          startTime = add(startTime, { days: 1 })
          firstDay = false
        }
      },
      prepare(id, title, time, description) {
        return {
          payload: {
            edittedSchedule: {
              id: nanoid(),
              title,
              description,
              time,
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