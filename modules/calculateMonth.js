import { useSelector } from 'react-redux'

export const calculateMonth = () => {

  const { year, month } = useSelector(state => state.currentMonth)
  const today = new Date()
  const [todayYear, todayMonth, todayDate] = [today.getFullYear(), today.getMonth(), today.getDate()]
  const prevDay = new Date(year, month, 0)
  const [prevDayYear, prevDayMonth, prevDayDate] = [prevDay.getFullYear(), prevDay.getMonth(), prevDay.getDate()]
  const nextDay = new Date(year, month + 2, 0)
  const [nextDayYear, nextDayMonth, nextDayDate] = [nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate()]


  // firstDay는 현재 보여주고자 하는 month의 첫 날에 해당하는 요일.
  const firstDay = (new Date(year, month, 1)).getDay()

  const prevMonth = []
  if (todayYear === prevDayYear && todayMonth === prevDayMonth) {
    for (let i = firstDay - 1; i >= 0; i--) {
      if (prevDayDate - i === todayDate) {
        prevMonth.push({ date: prevDayDate - i })
      } else {
        prevMonth.push(prevDayDate - i)
      }
    }
  } else {
    for (let i = firstDay - 1; i >= 0; i--) {
      prevMonth.push(prevDayDate - i)
    }
  }

  // totalDates는 현재 보여주고자 하는 month의 총 날의 개수
  const totalDates = (new Date(year, (month + 1), 0).getDate())
  const currentMonth = []
  if (todayYear === year && todayMonth === month) {
    for (let j = 1; j <= totalDates; j++) {
      if (todayDate === j) {
        currentMonth.push({ date: j })
      } else {
        currentMonth.push(j)
      }
    }
  } else {
    for (let j = 1; j <= totalDates; j++) {
      currentMonth.push(j)
    }
  }

  // lastDay는 현재 보여주고자 하는 month의 마지막 날에 해당하는 요일
  const lastDay = (new Date(year, (month + 1), 0).getDay())

  const nextMonth = []
  if (todayYear === nextDayYear && todayMonth === nextDayMonth) {
    for (let j = 1; j <= (6 - lastDay); j++) {
      if (todayDate === j) {
        nextMonth.push({ date: j })
      } else {
        nextMonth.push(j)
      }
    }
  } else {
    for (let j = 1; j <= (6 - lastDay); j++) {
      nextMonth.push(j)
    }
  }
  return {
    prevMonth,
    currentMonth,
    nextMonth
  }
}