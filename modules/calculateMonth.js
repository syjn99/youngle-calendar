import { useSelector } from 'react-redux'

export const calculateMonth = () => {

  const { year, month } = useSelector(state => state.currentMonth)


  // firstDay는 현재 보여주고자 하는 month의 첫 날에 해당하는 요일.
  const firstDay = (new Date(year, month, 1)).getDay()

  //
  const lastDateOfPrevMonth = (new Date(year, month, 0).getDate())
  const prevMonth = []
  for (let i = firstDay - 1; i >= 0; i--) {
    prevMonth.push(lastDateOfPrevMonth - i)
  }

  // totalDates는 현재 보여주고자 하는 month의 총 날의 개수
  const totalDates = (new Date(year, (month + 1), 0).getDate())
  const currentMonth = []
  for (let j = 1; j <= totalDates; j++) {
    currentMonth.push(j)
  }

  // lastDay는 현재 보여주고자 하는 month의 마지막 날에 해당하는 요일
  const lastDay = (new Date(year, (month + 1), 0).getDay())

  const nextMonth = []
  for (let j = 1; j <= (6 - lastDay); j++) {
    nextMonth.push(j)
  }
  return {
    prevMonth,
    currentMonth,
    nextMonth
  }
}