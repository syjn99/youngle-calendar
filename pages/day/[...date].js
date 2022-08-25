import { add, differenceInMinutes, isAfter, isEqual, sub } from 'date-fns';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { DayNavbar } from '../../components/DayNavbar';
import Modal from '../../components/Modal';
import ScheduleDetail from '../../components/ScheduleDetail';
import { formatDate } from '../../modules/formatDate';

export default function DayView() {
  const router = useRouter()
  const [year, month, day] = router.query.date || []
  const date = {
    year,
    month,
    day
  }
  const yearMonth = month < 10 ? `${year}-0${month}` : `${year}-${month}`
  const currentDay = new Date(date.year, date.month - 1, date.day)
  const tomorrow = add(currentDay, { days: 1 })

  const schedulesList = useSelector(state => state.schedules.schedulesList)
  const schedulesDateMap = (useSelector(state => state.schedules.dateMap) || {})
  const monthSchedules = schedulesDateMap[yearMonth] ? schedulesDateMap[yearMonth] : {}
  const schedules = monthSchedules[day] ? monthSchedules[day] : []
  const multispanSchedules = []
  const detailedSchedules = []

  // Multispan 스케줄들을 가져와야 한다.....
  let yesterday = sub(currentDay, { days: 1 })
  while (yesterday.getDay() !== 6) {
    const [yesYear, yesMonth, yesDate] = [yesterday.getFullYear(), yesterday.getMonth() + 1, yesterday.getDate()]
    const yesYearMonth = yesMonth < 10 ? `${yesYear}-0${yesMonth}` : `${yesYear}-${yesMonth}`
    const yesMonthSchedules = schedulesDateMap[yesYearMonth]

    if (!yesMonthSchedules) {
      yesterday = sub(yesterday, { days: 1 })
      continue
    }

    const yesSchedules = yesMonthSchedules[yesDate]

    if (!yesSchedules) {
      yesterday = sub(yesterday, { days: 1 })
      continue
    }

    yesSchedules.map(scheduleId => {
      const schedule = schedulesList.find(schedule => schedule?.id === scheduleId)

      if (!schedule) {
        yesterday = sub(yesterday, { days: 1 })
        return
      }

      if (isAfter(schedule.time.endTime, currentDay) || isEqual(schedule.time.endTime, currentDay) && !multispanSchedules.includes(scheduleId)) {
        multispanSchedules.push(scheduleId)
      }
    })

    yesterday = sub(yesterday, { days: 1 })
  }

  const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

  const [scheduleId, setScheduleId] = useState("")
  const [detailOpen, setDetailOpen] = useState(false)


  const onScheduleClicked = (e) => {
    setScheduleId(e.target.id)
    setDetailOpen(!detailOpen)
  }

  return (
    <div className='text-center relative'>
      <DayNavbar date={date} />
      { // Multispan 먼저 렌더링
        multispanSchedules ? multispanSchedules.map(scheduleId => {
          const schedule = schedulesList.find(schedule => schedule?.id === scheduleId)
          if (!schedule) {
            return
          }

          return (
            <div
              id={schedule.id}
              className='bg-indigo-500 text-white my-1 w-6/7 mx-auto rounded hover:cursor-pointer hover:bg-indigo-700'
              key={schedule.id}
              onClick={onScheduleClicked}
            >
              {schedule.title}
              <span id={schedule.id} className='ml-2 font-extralight'>
                ({`${formatDate(schedule.time.startTime)} - ${formatDate(schedule.time.endTime)}`})
              </span>
            </div>
          )
        }) : ""
      }
      { // 하루종일 먼저 렌더링
        schedules ? schedules.map(scheduleId => {
          const schedule = schedulesList.find(schedule => schedule?.id === scheduleId)
          if (!schedule) {
            return
          }

          if (schedule.time.isDetailSet) {
            detailedSchedules.push(schedule)
            return
          }

          return (
            <div
              id={schedule.id}
              className='bg-indigo-500 text-white my-1 w-6/7 mx-auto rounded hover:cursor-pointer hover:bg-indigo-700'
              key={schedule.id}
              onClick={onScheduleClicked}
            >
              {schedule.title}
            </div>
          )
        }) : ""
      }
      { // 시간 렌더링
        hours.map(function (date) {
          return (
            <div className={`border h-12 flex`}>
              <span className='border border-y-0 w-1/10 h-12 text-right font-light pr-0'>{date}시</span>
            </div>
          )
        })
      }
      { // 시간 렌더링하면서, 디테일 스케줄 렌더링
        detailedSchedules ? detailedSchedules.map(schedule => {
          console.log(schedule)
          const height = differenceInMinutes(schedule.time.endTime, schedule.time.startTime) * 48 / 60

          const bottom = differenceInMinutes(tomorrow, schedule.time.endTime) * 48 / 60
          return (
            <>
              <div
                id={schedule.id}
                className={`absolute text-white shadow-lg bg-indigo-300 right-1/20 w-8/10 rounded flex justify-center items-center transition ease-in-out hover:bg-indigo-500 hover:cursor-pointer`}
                style={{
                  height: `${height}px`,
                  bottom: `${bottom}px`
                }}
                onClick={onScheduleClicked}
              >
                <h1 className='text-2xl font-semibold'>{schedule.title}</h1>

              </div>
            </>
          )
        }) : ""
      }
      {detailOpen && (
        <Modal closeModal={() => setDetailOpen(!detailOpen)}>
          <ScheduleDetail scheduleId={scheduleId} closeModal={() => setDetailOpen(!detailOpen)} />
        </Modal>
      )}
    </div>
  )
}