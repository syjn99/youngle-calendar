import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { add, differenceInDays, sub } from 'date-fns'
import { useRouter } from 'next/router'
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
  const [scheduleId, setScheduleId] = useState("")


  const closeModal = () => setModalOpen(!modalOpen)
  const closeDetailModal = () => setDetailOpen(!detailOpen)

  const router = useRouter()


  // decide how many days to render using calculateMonth module
  const { prevMonth, currentMonth, nextMonth } = calculateMonth()
  const totalDays = (prevMonth.length + currentMonth.length + nextMonth.length)

  // ??????????????? ?????? ?????????. scheduleNum?????? ??? ???????????? '??????' ????????? ?????? ??????, ??? multispan ???????????? ????????? ??????. usedScheduleId????????? ?????? ?????? ????????? ??? ??????.
  let scheduleNum = Array.from({ length: totalDays }, () => 0)
  let usedScheduleId = []

  const onDateClicked = (e) => {
    setModalOpen(!modalOpen)
    setId(e.target.id ? e.target.id : e.target.parentElement.id)
  }

  const onScheduleClicked = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setScheduleId(e.target.id)
    setDetailOpen(!detailOpen)
  }

  const onDateClickedToRoute = (e) => {
    e.stopPropagation()
    const clickedDate = e.target.parentElement.id || e.target.parentElement.parentElement.id
    const clickedDateArr = clickedDate.split("-")
    const clickedDateRoute = `/day/${clickedDateArr[0]}/${parseInt(clickedDateArr[1])}/${parseInt(clickedDateArr[2])}`
    router.push(clickedDateRoute)
  }


  const calculateStartTime = (startTime) => {
    return `${startTime.getHours()}:${startTime.getMinutes() === 0 ? '00' : startTime.getMinutes()} `
  }

  // ??? renderedMonth?????? ???????????? ?????? ??????. scheduleNum??? usedScheduleId ???????????? ????????????. ?????? ????????? ????????? ??? ?????????
  // dif??? isSingleDay??? ????????????.

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
          <div
            className={isToday ? 'my-1 font-extralight rounded-full hover:bg-gray-300 hover:cursor-pointer' : "my-1 bg-indigo-500 text-white inline-block px-1 rounded-full font-extralight hover:bg-gray-300 hover:cursor-pointer"}
            onClick={onDateClickedToRoute}
          >
            {date}
          </div>
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
                <FontAwesomeIcon
                  className={`relative rounded-full hover:bg-gray-300 hover:cursor-pointer ${scheduleNum[date - prevMonth[0]] ? "top-4" : "top-minus"}`}
                  icon={faEllipsis}
                  onClick={onDateClickedToRoute}
                />
              )
            } else if (cnt > 4) {
              return
            }


            const isDetailSet = schedule.time.isDetailSet

            let startTime = null

            if (isDetailSet) {
              startTime = calculateStartTime(schedule.time.startTime)
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
        <div
          className={isToday ? 'my-1 rounded-full hover:bg-gray-300 hover:cursor-pointer' : "my-1 bg-indigo-500 text-white inline-block px-1 rounded-full hover:bg-gray-300 hover:cursor-pointer"}
          onClick={onDateClickedToRoute}
        >
          {date === 1 ? `${month + 1}??? ` : ""}
          {date}
          {date === 1 ? "???" : ""}
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
                <FontAwesomeIcon
                  className={`relative rounded-full hover:bg-gray-300 hover:cursor-pointer ${scheduleNum[date + prevMonth.length - 1] ? "top-4" : "top-minus"}`}
                  icon={faEllipsis}
                  onClick={onDateClickedToRoute}
                />
              )
            } else if (cnt > 4) {
              return
            }

            const isDetailSet = schedule.time.isDetailSet

            let startTime = null

            if (isDetailSet) {
              startTime = calculateStartTime(schedule.time.startTime)
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
        <div
          className={isToday ? 'my-1 font-extralight rounded-full hover:bg-gray-300 hover:cursor-pointer' : "my-1 bg-indigo-500 text-white inline-block px-2 rounded-full hover:bg-gray-300 hover:cursor-pointer"}
          onClick={onDateClickedToRoute}
        >
          {date === 1 || date.date === 1 ? `${(month + 1) % 12 + 1}??? ` : ""}
          {date}
          {date === 1 || date.date === 1 ? "???" : ""}
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
                <FontAwesomeIcon
                  className={`relative rounded-full hover:bg-gray-300 hover:cursor-pointer ${scheduleNum[date + prevMonth.length + currentMonth.length] ? "top-4" : "top-minus"}`}
                  icon={faEllipsis}
                  onClick={onDateClickedToRoute}
                />
              )
            } else if (cnt > 4) {
              return
            }

            const isDetailSet = schedule.time.isDetailSet

            let startTime = null

            if (isDetailSet) {
              startTime = calculateStartTime(schedule.time.startTime)
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