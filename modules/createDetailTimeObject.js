import { isAfter } from 'date-fns'

export const createDetailTimeObject = (target) => {
  console.log(target)

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

  // // Case 1: 시작 시간은 정해져 있고, 끝나는 시간은 하루종일

  // if (!target.isWholeDay_Start.checked && target.isWholeDay_End.checked) {
  //   console.log('case1')

  //   startTime = new Date(startDate + 'T' + startTimeHour + ':' + startTimeMinute)
  //   endTime = new Date(endDate + 'T23:59')
  // }

  // // Case 2: 시작 시간은 하루종일, 끝나는 시간은 정해져 있음.

  // else if (!target.isWholeDay_End.checked && target.isWholeDay_Start.checked) {
  //   console.log('case2')

  //   startTime = new Date(startDate + 'T00:00')
  //   endTime = new Date(endDate + 'T' + endTimeHour + ':' + endTimeMinute)
  // }

  // Case 3: 시작 시간, 끝나는 시간 모두 정해져 있음.


  console.log('case3')

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
