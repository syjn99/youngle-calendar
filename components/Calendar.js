import { useSelector } from 'react-redux'
import { calculateMonth } from '../modules/calculateMonth'
import styles from "../styles/Calendar.module.css"

export const Calendar = () => {
  const { year, month } = useSelector(state => state.currentMonth)
  const yearMonth = [year, month + 1].join("-")
  const schedules = (useSelector(state => state.schedules.dateMap[yearMonth]) || {})

  const { prevMonth, currentMonth, nextMonth } = calculateMonth()

  const renderedPrevMonth = prevMonth.map(date => (
    <div className={`${styles.prev} ${styles.date}`} key={date}>
      {date}
    </div>
  ))

  const renderedCurrentMonth = currentMonth.map(date => (
    <div className={`${styles.curr} ${styles.date}`} key={date}>
      {date === 1 ? `${month + 1}월 1일` : date}
      {schedules[date] ? schedules[date].map(schedule => (
        <div className={styles.schedule} key={schedule.id}>{schedule.title}</div>
      )) : ""}
    </div>
  ))

  const renderedNextMonth = nextMonth.map(date => (
    <div className={`${styles.next} ${styles.date}`} key={date}>
      {date === 1 ? `${(month + 1) % 12 + 1}월 1일` : date}
    </div>
  ))

  console.log(new Date(2022, -1, 1))

  return (
    <div className={styles.calendar}>
      {renderedPrevMonth}
      {renderedCurrentMonth}
      {renderedNextMonth}
    </div>
  )
}