import { add, differenceInMinutes } from 'date-fns';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { DayNavbar } from '../../components/DayNavbar';
import Modal from '../../components/Modal';
import ScheduleDetail from '../../components/ScheduleDetail';

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
  const monthSchedules = (useSelector(state => state.schedules.dateMap[yearMonth]) || {})
  const schedules = monthSchedules[day] ? monthSchedules[day] : []
  const detailedSchedules = []

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