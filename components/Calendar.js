import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { add, differenceInDays, sub } from 'date-fns'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { calculateMonth } from '../modules/calculateMonth'
import targetDate from '../modules/targetDate'
import AddScheduleForm from './AddScheduleForm'
import Days from './Days'
import Modal from './Modal'
import { Navbar } from './Navbar'
import ScheduleDetail from './ScheduleDetail'

const width = [
  "w-0/7",
  "w-1/7",
  "w-2/7",
  "w-3/7",
  "w-4/7",
  "w-5/7",
  "w-6/7",
  "w-7/7",
]

const top = [
  "top-first",
  "top-second",
  "top-third",
]

let scheduleId = null

// define commonly used styles
const STYLE_DATE = "border text-center transition ease-in-out hover:bg-gray-200"
const STYLE_SCHEDULE_CURR = 'bg-indigo-500 text-white text-sm mb-px mx-px rounded hover:cursor-pointer hover:bg-indigo-700'
const STYLE_SCHEDULE_NOT_CURR = 'bg-indigo-300 text-white text-sm mb-px mx-px rounded hover:cursor-pointer hover:bg-indigo-500'

const MemoNavbar = React.memo(Navbar)
const MemoDays = React.memo(Days)

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

  const closeModal = () => setModalOpen(!modalOpen)
  const closeDetailModal = () => setDetailOpen(!detailOpen)


  // decide how many days to render using calculateMonth module
  const { prevMonth, currentMonth, nextMonth } = calculateMonth()
  const totalDays = (prevMonth.length + currentMonth.length + nextMonth.length)

  // 렌더링하기 위한 배열들. scheduleNum에는 각 날짜별로 '이미' 렌더링 되어 있는, 즉 multispan 스케줄의 개수를 센다. usedScheduleId에서는 이미 셌던 친구는 안 센다.
  let scheduleNum = Array.from({ length: totalDays }, () => 0)
  let usedScheduleId = []

  const onDateClicked = (e) => {
    setModalOpen(!modalOpen)
    setId(e.target.id ? e.target.id : e.target.parentElement.id)
  }

  const onScheduleClicked = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDetailOpen(!detailOpen)
    scheduleId = e.target.id
  }

  // 각 renderedMonth마다 반복되는 작업 수행. scheduleNum과 usedScheduleId 리스트를 관리한다. 이후 스케줄 렌더링 시 필요한
  // dif와 isSingleDay를 리턴한다.

  const calculateValues = (schedule, id, initValue) => {
    let dif = differenceInDays(add(schedule.time.endTime, { days: 1 }), sub(new Date(id), { hours: 9 }))
    const day = (new Date(id)).getDay()

    const isSingleDay = dif <= 1 ? true : false

    if (dif > 1) {
      if (!(usedScheduleId.includes(schedule.id))) {
        for (let i = 0; i < dif; i++) {
          scheduleNum[initValue + i]++
        }
        usedScheduleId.push(schedule.id)
      }
      if (dif > 6) {
        dif = 7 - day
      }
    } else if (dif === 0) {
      dif = 1
    }

    return [
      dif,
      isSingleDay
    ]
  }



  const renderedPrevMonth = prevMonth.map(function (date) {
    let cnt = scheduleNum[date - prevMonth[0]]

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

            cnt++

            if (cnt === 4) {
              return (
                <FontAwesomeIcon className={`relative ${scheduleNum[date + prevMonth.length - 1] ? "top-4" : "top-minus"}`} icon={faEllipsis} />
              )
            } else if (cnt > 4) {
              return
            }

            const isDetailSet = schedule.time.isDetailSet

            let startTime = null

            if (isDetailSet) {
              startTime = `${schedule.time.startTime.getHours()}:${schedule.time.startTime.getMinutes() === 0 ? '00' : schedule.time.startTime.getMinutes()} `
            }


            const [dif, isSingleDay] = calculateValues(schedule, id, 0)

            return (
              <div
                id={schedule.id}
                className={`${STYLE_SCHEDULE_NOT_CURR} ${isSingleDay ? `relative ${top[scheduleNum[date - prevMonth[0]]]}` : `absolute ${width[dif]}`} ${isDetailSet ? 'bg-gray-100 text-black hover:text-white' : ''}`}
                key={schedule.id}
                onClick={onScheduleClicked}
              >
                {isDetailSet ? <div className='inline-block rounded-full bg-indigo-500 w-3 h-3 mr-1'></div> : null}
                {isDetailSet ? <span className='font-extralight'>{startTime}</span> : null}
                {schedule.title}
                {schedule.title}
              </div>
            )
          }) : ""
        }
      </div >
    )
  })

  const renderedCurrentMonth = currentMonth.map(function (date) {
    let cnt = scheduleNum[date + prevMonth.length - 1]

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

            cnt++

            if (cnt === 4) {
              return (
                <FontAwesomeIcon className={`relative ${scheduleNum[date + prevMonth.length - 1] ? "top-4" : "top-minus"}`} icon={faEllipsis} />
              )
            } else if (cnt > 4) {
              return
            }

            const isDetailSet = schedule.time.isDetailSet

            let startTime = null

            if (isDetailSet) {
              startTime = `${schedule.time.startTime.getHours()}:${schedule.time.startTime.getMinutes() === 0 ? '00' : schedule.time.startTime.getMinutes()} `
            }

            const [dif, isSingleDay] = calculateValues(schedule, id, date + prevMonth.length - 1)

            return (
              <div
                id={schedule.id}
                className={`${STYLE_SCHEDULE_CURR} ${isSingleDay ? `relative ${top[scheduleNum[date + prevMonth.length - 1]]}` : `absolute ${width[dif]}`} ${isDetailSet ? 'bg-gray-100 text-black hover:text-white' : ''}`}
                key={schedule.id + date}
                onClick={onScheduleClicked}
              >
                {isDetailSet ? <div className='inline-block rounded-full bg-indigo-500 w-3 h-3 mr-1'></div> : null}
                {isDetailSet ? <span className='font-extralight'>{startTime}</span> : null}
                {schedule.title}
              </div>
            )
          }) : ""
        }
      </div >
    )
  })

  const renderedNextMonth = nextMonth.map(function (date) {
    let cnt = scheduleNum[date + prevMonth.length + currentMonth.length]

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

            cnt++

            if (cnt === 4) {
              return (
                <FontAwesomeIcon className={`relative ${scheduleNum[date + prevMonth.length - 1] ? "top-4" : "top-minus"}`} icon={faEllipsis} />
              )
            } else if (cnt > 4) {
              return
            }

            const isDetailSet = schedule.time.isDetailSet

            let startTime = null

            if (isDetailSet) {
              startTime = `${schedule.time.startTime.getHours()}:${schedule.time.startTime.getMinutes() === 0 ? '00' : schedule.time.startTime.getMinutes()} `
            }

            const [dif, isSingleDay] = calculateValues(schedule, id, date + prevMonth.length + currentMonth.length)

            return (
              <div
                id={schedule.id}
                className={`${STYLE_SCHEDULE_NOT_CURR} ${isSingleDay ? `relative ${top[scheduleNum[date + prevMonth.length + currentMonth.length - 1]]}` : `absolute ${width[dif]}`} ${isDetailSet ? 'bg-gray-100 text-black hover:text-white' : ''}`}
                key={schedule.id}
                onClick={onScheduleClicked}
              >
                {isDetailSet ? <div className='inline-block rounded-full bg-indigo-500 w-3 h-3 mr-1'></div> : null}
                {isDetailSet ? <span className='font-extralight'>{startTime}</span> : null}
                {schedule.title}

              </div>
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
      <MemoNavbar />
      <MemoDays />
      <div className={`h-5/6 grid grid-cols-7 auto-rows-fr`}>
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
    </>
  )
}