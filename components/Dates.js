import { add, sub } from 'date-fns'

const Dates = ({ date }) => {
  let walkDay = new Date(date.year, date.month - 1, date.day)
  let dates = []
  while (walkDay.getDay() !== 0) {
    walkDay = sub(walkDay, { days: 1 })
  }
  for (let i = 0; i < 7; i++) {
    if (walkDay.getDate() === 1) {
      dates.push(`${walkDay.getMonth() + 1}월 1일`)
      walkDay = add(walkDay, { days: 1 })
      continue
    }
    dates.push(walkDay.getDate())
    walkDay = add(walkDay, { days: 1 })
  }

  return (
    <div className="grid grid-cols-7 font-light my-2">
      {dates.map(date => {
        return (
          <div className='text-center font-extralight' key={date}>
            {date}
          </div>
        )
      })}
    </div>
  )
}

export default Dates