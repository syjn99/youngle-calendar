import { dayToKoreanConverter } from './dayToKoreanConverter'

export const formatDate = (targetDate) => {
  const [month, date, day] = [targetDate.getMonth(), targetDate.getDate(), targetDate.getDay()]
  const dayToKorean = dayToKoreanConverter({ day })
  return `${month + 1}월 ${date}일(${dayToKorean})`
}