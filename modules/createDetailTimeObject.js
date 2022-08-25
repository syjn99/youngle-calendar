import { isAfter } from 'date-fns'

export const createDetailTimeObject = (target) => {
  let detailTimeObject = {
    isDetailSet: true,
    startTime: null,
    endTime: null,
  }

  const [startDate, endDate] = [target.startDate.value, target.endDate.value]

  let startTimeHour = target.startTimeHour.value
  let endTimeHour = target.endTimeHour.value

  const startTimeMinute = target.startTimeMinute.value
  const endTimeMinute = target.endTimeMinute.value


  if (target.startTimeAMPM.value === '0' && target.startTimeHour.value === '12') {
    startTimeHour = '00'
  }
  if (target.startTimeAMPM.value === '1') {
    startTimeHour = (parseInt(startTimeHour) + 12).toString()
  }



  if (target.endTimeAMPM.value === '1') {
    endTimeHour = (parseInt(endTimeHour) + 12).toString()
  }

  if (target.endTimeAMPM.value === '0' && target.endTimeHour.value === '12') {
    endTimeHour = '00'
  }


  let startTime = null
  let endTime = null


  startTime = new Date(startDate + 'T' + startTimeHour + ':' + startTimeMinute)
  endTime = new Date(endDate + 'T' + endTimeHour + ':' + endTimeMinute)

  if (isAfter(startTime, endTime)) {
    alert('wrong setting')
    return false
  }

  detailTimeObject.startTime = startTime
  detailTimeObject.endTime = endTime

  return detailTimeObject
}
