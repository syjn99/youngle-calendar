import { add, differenceInDays, sub } from 'date-fns'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { calculateMonth } from '../modules/calculateMonth'
import targetDate from '../modules/targetDate'
import AddScheduleForm from './AddScheduleForm'
import Days from './Days'
import Modal from './Modal'
import { Navbar } from './Navbar'
import ScheduleDetail from './ScheduleDetail'

// define commonly used styles
const STYLE_DATE = "border text-center transition ease-in-out hover:bg-gray-200"
const STYLE_SCHEDULE_CURR = 'absolute inline-block bg-indigo-500 text-white text-sm mb-px mr-2 left-0 rounded hover:cursor-pointer hover:bg-indigo-700'
const STYLE_SCHEDULE_NOT_CURR = 'bg-indigo-300 text-white text-sm mb-px mr-2 rounded hover:cursor-pointer hover:bg-indigo-500'

export const Calendar = () => {
  // fetch currentMonth to render the calendar, and schedulesList to refer schedules to render
  const { year, month } = useSelector(state => state.currentMonth)
  const schedulesList = useSelector(state => state.schedules.schedulesList)

  // fetch schedules from dateMap
  const prevYearMonth = (new Date(year, month).toISOString().substring(0, 7))
  const yearMonth = (new Date(year, month + 1).toISOString().substring(0, 7))
  const nextYearMonth = (new Date(year, month + 2).toISOString().substring(0, 7))

  const prevSchedules = (useSelector(state => state.schedules.dateMap[prevYearMonth]) || {})
  const schedules = (useSelector(state => state.schedules.dateMap[yearMonth]) || {})
  const nextSchedules = (useSelector(state => state.schedules.dateMap[nextYearMonth]) || {})

  // define states locally used in this components
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [id, setId] = useState("")
  const [scheduleId, setScheduleId] = useState("")

  const closeModal = () => setModalOpen(!modalOpen)
  const closeDetailModal = () => setDetailOpen(!detailOpen)


  // decide how many days to render using calculateMonth module
  const { prevMonth, currentMonth, nextMonth } = calculateMonth()

  // if the days to render exceeds 35, the grid have 6 rows
  const totalDays = prevMonth.length + currentMonth.length + nextMonth.length
  const rows = totalDays > 35 ? 6 : 5

  const onDateClicked = (e) => {
    setModalOpen(!modalOpen)
    setId(e.target.id ? e.target.id : e.target.parentElement.id)
  }
  const onScheduleClicked = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDetailOpen(!detailOpen)
    setScheduleId(e.target.id)
  }

  const renderedPrevMonth = prevMonth.map(function (date) {
    const isToday = Number.isInteger(date)
    if (!isToday) {
      date = date.date
    }
    const id = add(new Date(year, month - 1, date), { hours: 9 }).toISOString().substring(0, 10)

    return (
      <div id={id} className={`${STYLE_DATE}`} key={date} onClick={onDateClicked} >
        {
          <div className={isToday ? 'my-1 font-extralight' : "my-1 bg-indigo-500 text-white inline-block px-1 rounded-full font-extralight"}> {date}</div>
        }
        {
          prevSchedules[date] ? prevSchedules[date].map(scheduleId => {
            const schedule = schedulesList.find(schedule => schedule?.id === scheduleId)
            if (!schedule) {
              return
            }
            return (
              <div id={schedule.id} className={`${STYLE_SCHEDULE_NOT_CURR}`} key={schedule.id} onClick={onScheduleClicked} > {schedule.title}</div>
            )
          }) : ""
        }
      </div >
    )
  })

  const renderedCurrentMonth = currentMonth.map(function (date) {
    const isToday = Number.isInteger(date)
    if (!isToday) {
      date = date.date
    }
    const id = add(new Date(year, month, date), { hours: 9 }).toISOString().substring(0, 10)
    return (
      <div id={id} className={`${STYLE_DATE}`} key={date} onClick={onDateClicked}>
        <div className={isToday ? 'my-1' : "my-1 bg-indigo-500 text-white inline-block px-1 rounded-full"}>
          {date === 1 ? `${month + 1}월 ` : ""}
          {date}
          {date === 1 ? "일" : ""}
        </div>
        {
          schedules[date] ? schedules[date].map(scheduleId => {
            const schedule = schedulesList.find(schedule => schedule?.id === scheduleId)
            if (!schedule) {
              return
            }
            console.log(id)
            console.log(new Date(id), schedule.time.endTime)
            let dif = differenceInDays(schedule.time.endTime, sub(new Date(id), { hours: 9 }))
            console.log(schedule.time.endTime, sub(new Date(id), { hours: 9 }))
            console.log(dif)
            const max = 7 - (new Date(id).getDay())
            console.log(dif, max)
            if (dif > max) {
              dif = max
            } else if (dif === 0) {
              dif = 1
            } else {
              dif = dif + 1
            }
            console.log("after", dif)

            const styles = { divClass: "absolute bg-indigo-500 text-white text-sm mb-px mr-2 rounded hover:cursor-pointer hover:bg-indigo-700" }
            const width = `w-${dif}/7`
            const left = `left-${new Date(id).getDay()}/7`

            return (
              <div id={schedule.id} className={`${styles.divClass} ${width} ${left} shrin`} key={schedule.id} onClick=
                {onScheduleClicked}>{schedule.title}</div>
            )
          }) : ""
        }
      </div >
    )
  })

  const renderedNextMonth = nextMonth.map(function (date) {
    const isToday = Number.isInteger(date)
    if (!isToday) {
      date = date.date
    }
    const id = add(new Date(year, month + 1, date), { hours: 9 }).toISOString().substring(0, 10)
    return (
      <div id={id} className={`${STYLE_DATE}`} key={date} onClick={onDateClicked}>
        <div className={isToday ? 'my-1 font-extralight' : "my-1 bg-indigo-500 text-white inline-block px-2 rounded-full"}>
          {date === 1 || date.date === 1 ? `${(month + 1) % 12 + 1}월 ` : ""}
          {date}
          {date === 1 || date.date === 1 ? "일" : ""}
        </div>
        {
          nextSchedules[date] ? nextSchedules[date].map(scheduleId => {
            const schedule = schedulesList.find(schedule => schedule?.id === scheduleId)
            if (!schedule) {
              return
            }
            return (
              <div id={schedule.id} className={`${STYLE_SCHEDULE_NOT_CURR}`} key={schedule.id} onClick={onScheduleClicked}> {schedule.title}</div>
            )
          }) : ""
        }
      </div >
    )
  })

  const renderCalendar = () => {
    return (
      <>
        {renderedPrevMonth}
        {renderedCurrentMonth}
        {renderedNextMonth}
      </>
    )
  }

  return (
    <>
      <Navbar />
      <Days />
      <div className={`h-5/6 grid grid-cols-7 grid-rows-${rows} auto-rows-fr`}>
        {renderCalendar()}
      </div>
      {modalOpen && (
        <Modal closeModal={closeModal}>
          <AddScheduleForm targetDate={new Date(targetDate(id)[0], targetDate(id)[1] - 1, targetDate(id)[2])} closeModal={closeModal} />
        </Modal>)}
      {detailOpen && (
        <Modal closeModal={closeDetailModal}>
          <ScheduleDetail scheduleId={scheduleId} closeModal={closeDetailModal} />
        </Modal>
      )}
      <span className='bg-black text-white inline-block w-3/7 absolute left-1/7'>hi</span>
    </>
  )
}