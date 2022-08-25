import { add, differenceInDays, differenceInMinutes, sub } from 'date-fns'
import { useRouter } from 'next/router'
import Days from '../../components/Days'
// import { useState } from 'react'
// import { useSelector } from 'react-redux'
// import Days from '../../components/Days'
// import Modal from '../../components/Modal'
// import ScheduleDetail from '../../components/ScheduleDetail'
import { WeekNavbar } from '../../components/WeekNavbar'

// export default function WeekView() {
//   const router = useRouter()
//   const [year, month, day] = router.query.date || []
//   const date = {
//     year,
//     month,
//     day
//   }

//   const schedulesList = useSelector(state => state.schedules.schedulesList)
//   const schedulesDateMap = (useSelector(state => state.schedules.dateMap) || {})

//   const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

//   let walkDay = new Date(date.year, date.month - 1, date.day)
//   const tomorrow = add(walkDay, { days: 1 })
//   let newMonth = null
//   let ids = {}
//   let dates = []
//   let schedulesAtDate = {}
//   let scheduleNum = Array.from({ length: 7 }, () => 0)
//   let usedScheduleId = []
//   let detailedSchedules = []
//   let dateToIndexConverter = {}

//   const [scheduleId, setScheduleId] = useState("")
//   const [detailOpen, setDetailOpen] = useState(false)




//   // 일요일에서 시작하기
//   while (walkDay.getDay() !== 0) {
//     walkDay = sub(walkDay, { days: 1 })
//   }

//   for (let i = 0; i < 7; i++) {
//     const tempYear = walkDay.getFullYear()
//     const tempMonth = walkDay.getMonth() + 1
//     const tempDate = walkDay.getDate()
//     if (tempDate === 1) {
//       newMonth = tempMonth
//     }

//     dates.push(tempDate)

//     const yearMonth = tempMonth < 10 ? `${tempYear}-0${tempMonth}` : `${tempYear}-${tempMonth}`
//     const tempMonthSchedules = schedulesDateMap[yearMonth] || []
//     const tempSchedules = tempMonthSchedules[tempDate] || []

//     schedulesAtDate[tempDate.toString()] = tempSchedules
//     ids[tempDate.toString()] = add(walkDay, { days: 1 }).toISOString().substring(0, 10)
//     dateToIndexConverter[tempDate.toString()] = i

//     walkDay = add(walkDay, { days: 1 })

//   }

//   const onDateClickedToRoute = (e) => {
//     console.log(e)
//     e.stopPropagation()
//     const clickedDate = e.target.id
//     const clickedDateArr = clickedDate.split("-")
//     const clickedDateRoute = `/day/${clickedDateArr[0]}/${parseInt(clickedDateArr[1])}/${parseInt(clickedDateArr[2])}`
//     router.push(clickedDateRoute)
//   }

//   const onScheduleClicked = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     setScheduleId(e.target.id)
//     setDetailOpen(!detailOpen)
//   }
//   console.log(detailedSchedules)



//   return (
//     <div className='relative'>
//       <WeekNavbar date={date} />
//       <div className='flex' style={{
//         marginBottom: `${scheduleNum[dateToIndexConverter[date.toString()]] * 40}px`,
//       }}>
//         <div className='w-1/10'>
//           &nbsp;
//         </div>
//         <div className='w-9/10'>
//           <Days />
//           <div className="grid grid-cols-7 font-light my-2">
//             {dates.map(date => {
//               const schedules = schedulesAtDate[date.toString()]
//               return (
//                 <>
//                   <div>
//                     <div id={ids[date]} className='text-center font-extralight hover:cursor-pointer hover:bg-gray-300' onClick={onDateClickedToRoute} key={ids[date]}>
//                       {date === 1 ? `${newMonth}월 ${date}일` : `${date}`}
//                     </div>
//                     {schedules.map(scheduleId => {
//                       const schedule = schedulesList.find(schedule => schedule?.id === scheduleId)
//                       if (!schedule) {
//                         return
//                       }

//                       if (schedule.time.isDetailSet) {
//                         detailedSchedules.push(schedule)
//                         return
//                       }

//                       let dif = differenceInDays(add(schedule.time.endTime, { days: 1 }), sub(new Date(ids[date]), { hours: 9 }))
//                       const day = (new Date(ids[date])).getDay()

//                       const isSingleDay = dif <= 1 ? true : false

//                       if (dif > 1) {
//                         if (!(usedScheduleId.includes(schedule.id))) {
//                           for (let i = 0; (i < dif || i < 7); i++) {
//                             scheduleNum[i + dateToIndexConverter[date.toString()]]++
//                           }
//                           usedScheduleId.push(schedule.id)
//                         }
//                         if (dif > 6) {
//                           dif = 7 - day
//                         }
//                       } else if (dif === 0) {
//                         dif = 1
//                       }

//                       return (
//                         <>
//                           <div
//                             id={schedule.id}
//                             className={`text-center bg-indigo-500 text-white my-1 mx-auto rounded hover:cursor-pointer hover:bg-indigo-700 ${isSingleDay ? 'relative' : 'absolute'}`}
//                             style={isSingleDay ? {
//                               top: `${scheduleNum[dateToIndexConverter[date.toString()]] * 32}px`,
//                             } : {
//                               width: `${dif * 12.8571}%`,
//                             }}
//                             key={schedule.id}
//                             onClick={onScheduleClicked}
//                           >
//                             {schedule.title}
//                           </div>
//                         </>
//                       )
//                     })}
//                   </div>
//                 </>
//               )
//             })}
//           </div>
//         </div>
//       </div>
//       { // 시간 및 블록 렌더링
//         hours.map(function (hour) {
//           return (
//             <>
//               <div className={`border h-12 flex`}>
//                 <span className='border border-y-0 w-1/10 pr-1 h-12 text-right font-light'>{hour}시</span>
//                 <div className='inline-block w-week-1/7 border border-y-0'></div>
//                 <div className='inline-block w-week-1/7 border border-y-0'></div>
//                 <div className='inline-block w-week-1/7 border border-y-0'></div>
//                 <div className='inline-block w-week-1/7 border border-y-0'></div>
//                 <div className='inline-block w-week-1/7 border border-y-0'></div>
//                 <div className='inline-block w-week-1/7 border border-y-0'></div>
//                 <div className='inline-block w-week-1/7 border border-y-0'></div>
//               </div>
//             </>
//           )
//         })
//       }
//       { // 시간 렌더링하면서, 디테일 스케줄 렌더링
//         detailedSchedules ? detailedSchedules.map(schedule => {
//           console.log(schedule)
//           const height = differenceInMinutes(schedule.time.endTime, schedule.time.startTime) * 48 / 60

//           const bottom = differenceInMinutes(tomorrow, schedule.time.endTime) * 48 / 60
//           console.log(height, bottom)
//           return (
//             <>
//               <div
//                 id={schedule.id}
//                 className={`absolute text-white shadow-lg bg-indigo-300 right-1/20 w-8/10 rounded flex justify-center items-center transition ease-in-out hover:bg-indigo-500 hover:cursor-pointer`}
//                 style={{
//                   height: `${height}px`,
//                   bottom: `${bottom}px`
//                 }}
//                 onClick={onScheduleClicked}
//                 key={schedule.id}

//               >
//                 <h1 className='text-2xl font-semibold'>{schedule.title}</h1>

//               </div>
//             </>
//           )
//         }) : ""
//       }
//       {detailOpen && (
//         <Modal closeModal={() => setDetailOpen(!detailOpen)}>
//           <ScheduleDetail scheduleId={scheduleId} closeModal={() => setDetailOpen(!detailOpen)} />
//         </Modal>
//       )}
//     </div>
//   )
// }

const WeekView = () => {
  const router = useRouter()
  const [year, month, day] = router.query.date || []
  const date = {
    year,
    month,
    day
  }
  const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

  let walkDay = new Date(date.year, date.month - 1, date.day)
  let newMonth = null
  let dates = []
  let ids = {}



  while (walkDay.getDay() !== 0) {
    walkDay = sub(walkDay, { days: 1 })
  }

  for (let i = 0; i < 7; i++) {
    const tempYear = walkDay.getFullYear()
    const tempMonth = walkDay.getMonth() + 1
    const tempDate = walkDay.getDate()
    if (tempDate === 1) {
      newMonth = tempMonth
    }

    dates.push(tempDate)

    ids[tempDate.toString()] = add(walkDay, { days: 1 }).toISOString().substring(0, 10)

    walkDay = add(walkDay, { days: 1 })
  }

  return (
    <>
      {/* <WeekNavbar date={date} /> */}
      <div className='flex'>
        <div className='w-1/10'>
          &nbsp;
        </div>
        <div className='w-9/10'>
          <Days />
        </div>
      </div>
      {/* {
        hours.map(function (hour) {
          return (
            <div className={`border h-12 flex`} key={hour}>
              <span className='border border-y-0 w-1/10 pr-1 h-12 text-right font-light'>{hour}시</span>
              <div className='inline-block w-week-1/7 border border-y-0'></div>
              <div className='inline-block w-week-1/7 border border-y-0'></div>
              <div className='inline-block w-week-1/7 border border-y-0'></div>
              <div className='inline-block w-week-1/7 border border-y-0'></div>
              <div className='inline-block w-week-1/7 border border-y-0'></div>
              <div className='inline-block w-week-1/7 border border-y-0'></div>
              <div className='inline-block w-week-1/7 border border-y-0'></div>
            </div>
          )
        })
      } */}
    </>
  )
}

export default WeekView