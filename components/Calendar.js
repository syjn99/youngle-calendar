import { add } from 'date-fns'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { calculateMonth } from '../modules/calculateMonth'
import targetDate from '../modules/targetDate'
import styles from "../styles/Calendar.module.css"
import AddScheduleForm from './AddScheduleForm'
import Modal from './Modal'

export const Calendar = () => {
  const { year, month } = useSelector(state => state.currentMonth)
  const prevYearMonth = (new Date(year, month).toISOString().substring(0, 7))
  const yearMonth = (new Date(year, month + 1).toISOString().substring(0, 7))
  const nextYearMonth = (new Date(year, month + 2).toISOString().substring(0, 7))

  const prevSchedules = (useSelector(state => state.schedules.dateMap[prevYearMonth]) || {})
  const schedules = (useSelector(state => state.schedules.dateMap[yearMonth]) || {})
  const nextSchedules = (useSelector(state => state.schedules.dateMap[nextYearMonth]) || {})

  const [modalOpen, setModalOpen] = useState(false)
  const [id, setId] = useState("")
  const closeModal = () => setModalOpen(!modalOpen)

  const { prevMonth, currentMonth, nextMonth } = calculateMonth()

  const onDateClicked = (e) => {
    setModalOpen(!modalOpen)
    setId(e.target.id ? e.target.id : e.target.parentElement.id)
  }

  const renderedPrevMonth = prevMonth.map(function (date) {
    const isToday = Number.isInteger(date)
    if (!isToday) {
      date = date.date
    }
    const id = add(new Date(year, month - 1, date), { hours: 9 }).toISOString().substring(0, 10)

    return (
      <div id={id} className={`${styles.prev} ${styles.date}`} key={date} onClick={onDateClicked}>
        {
          <span className={isToday ? "" : `${styles.today}`}>{date}</span>
        }
        {
          prevSchedules[date] ? prevSchedules[date].map(schedule => (
            <div className={styles.schedule} key={schedule.id}>{schedule.title}</div>
          )) : ""
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
      <div id={id} className={`${styles.curr} ${styles.date}`} key={date} onClick={onDateClicked}>
        {date === 1 ? `${month + 1}월 ` : ""}
        <span className={isToday ? "" : `${styles.today}`}>{date}</span>
        {date === 1 ? "일" : ""}
        {
          schedules[date] ? schedules[date].map(schedule => (
            <div className={styles.schedule} key={schedule.id}>{schedule.title}</div>
          )) : ""
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
      <div id={id} className={`${styles.next} ${styles.date}`} key={date} onClick={onDateClicked}>
        <div>
          {date === 1 || date.date === 1 ? `${(month + 1) % 12 + 1}월 ` : ""}
          <span className={isToday ? "" : `${styles.today}`}>{date}</span>
          {date === 1 || date.date === 1 ? "일" : ""}
        </div>
        {
          nextSchedules[date] ? nextSchedules[date].map(schedule => (
            <div className={styles.schedule} key={schedule.id}>{schedule.title}</div>
          )) : ""
        }
      </div>
    )
  })

  return (
    <div className={styles.calendar}>
      {renderedPrevMonth}
      {renderedCurrentMonth}
      {renderedNextMonth}
      {modalOpen && (
        <Modal closeModal={closeModal}>
          <AddScheduleForm targetDate={new Date(targetDate(id)[0], targetDate(id)[1] - 1, targetDate(id)[2])} closeModal={closeModal} />
        </Modal>)}
    </div>
  )
}