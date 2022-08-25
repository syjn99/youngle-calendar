const DetailTimeSet = ({ isStart, startHour }) => {
  console.log(startHour)
  let nowHour = new Date().getHours()
  let isAM = true
  if (nowHour >= 12) {
    isAM = false
    nowHour -= 12
  }
  if (nowHour < 10) {
    nowHour = '0' + nowHour
  } else {
    nowHour = nowHour.toString()
  }

  if (startHour) {
    if (startHour >= 12) {
      isAM = false
      startHour -= 12
    } else {
      isAM = true
    }
    nowHour = startHour

    if (nowHour < 10) {
      nowHour = '0' + nowHour
    } else {
      nowHour = nowHour.toString()
    }

  }

  return (
    <div className='inline-block px-2'>
      <select defaultValue={isAM ? '0' : '1'} className='' id={isStart ? 'startTimeAMPM' : 'endTimeAMPM'}>
        <option value='0'>오전</option>
        <option value='1'>오후</option>
      </select>
      <select defaultValue={nowHour} id={isStart ? 'startTimeHour' : 'endTimeHour'}>
        <option value='01' selected={(nowHour === 1)}>1</option>
        <option value='02' selected={(nowHour === 2)}>2</option>
        <option value='03' selected={(nowHour === 3)}>3</option>
        <option value='04' selected={(nowHour === 4)}>4</option>
        <option value='05' selected={(nowHour === 5)}>5</option>
        <option value='06' selected={(nowHour === 6)}>6</option>
        <option value='07' selected={(nowHour === 7)}>7</option>
        <option value='08' selected={(nowHour === 8)}>8</option>
        <option value='09' selected={(nowHour === 9)}>9</option>
        <option value='10' selected={(nowHour === 10)}>10</option>
        <option value='11' selected={(nowHour === 11)}>11</option>
        <option value='12' selected={(nowHour === 12)}>12</option>
      </select>
      <select defaultValue='00' id={isStart ? 'startTimeMinute' : 'endTimeMinute'}>
        <option value='00'>00</option>
        <option value='15'>15</option>
        <option value='30'>30</option>
        <option value='45'>45</option>
      </select>
    </div >
  )
}

export default DetailTimeSet