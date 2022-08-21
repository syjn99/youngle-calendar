import { useSelector } from 'react-redux'
import { calculateMonth } from '../modules/calculateMonth'
import styles from "../styles/Calendar.module.css"

export const Calendar = () => {
  const { year, month } = useSelector(state => state.currentMonth)
  const yearMonth = (new Date(year, month + 1).toISOString().substring(0, 7))
  const schedules = (useSelector(state => state.schedules.dateMap[yearMonth]) || {})

  const { prevMonth, currentMonth, nextMonth } = calculateMonth()

  console.log(prevMonth, currentMonth, nextMonth)

  const renderedPrevMonth = prevMonth.map(date => (
    <div className={`${styles.prev} ${styles.date}`} key={date}>
      {
        <span className={Number.isInteger(date) ? "" : `${styles.today}`}>{Number.isInteger(date) ? date : date.date}</span>
      }
    </div >
  ))

  const renderedCurrentMonth = currentMonth.map(date => (
    <div className={`${styles.curr} ${styles.date}`} key={date}>
      <div>
        {date === 1 || date.date === 1 ? `${month + 1}월 ` : ""}
        <span className={Number.isInteger(date) ? "" : `${styles.today}`}>{Number.isInteger(date) ? date : date.date}</span>
        {date === 1 || date.date === 1 ? "일" : ""}
      </div>
      {schedules[date] ? schedules[date].map(schedule => (
        <div className={styles.schedule} key={schedule.id}>{schedule.title}</div>
      )) : ""}
    </div>
  ))

  const renderedNextMonth = nextMonth.map(date => (
    <div className={`${styles.next} ${styles.date}`} key={date}>
      <div>
        {date === 1 || date.date === 1 ? `${(month + 1) % 12 + 1}월 ` : ""}
        <span className={Number.isInteger(date) ? "" : `${styles.today}`}>{Number.isInteger(date) ? date : date.date}</span>
        {date === 1 || date.date === 1 ? "일" : ""}
      </div>
    </div>
  ))

  return (
    <div className={styles.calendar}>
      {renderedPrevMonth}
      {renderedCurrentMonth}
      {renderedNextMonth}
    </div>
  )
}