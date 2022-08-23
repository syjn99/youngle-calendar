import { faPen, faClockFour } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { formatDate } from '../modules/formatDate'
import { useDispatch } from 'react-redux'
import { scheduleAdded } from '../features/schedules/schedulesSlice'
import { add } from 'date-fns'

const AddScheduleForm = ({ targetDate, closeModal }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState(targetDate)
  const [endDate, setEndDate] = useState(targetDate)
  const [detailTime, setDetailTime] = useState(false)
  const [displayedTime, setDisplayedTime] = useState(`${formatDate(startDate)} - ${formatDate(endDate)}`)

  const dispatch = useDispatch()

  const onTitleChange = (e) => setTitle(e.target.value)
  const onDescriptionChange = (e) => setDescription(e.target.value)

  const onStartDateChange = (e) => {
    const newStartDate = new Date(e.target.value)
    setStartDate(newStartDate)
    setDisplayedTime(`${formatDate(newStartDate)} - ${formatDate(endDate)}`)
  }

  const onEndDateChange = (e) => {
    const newEndDate = new Date(e.target.value)
    setEndDate(newEndDate)
    setDisplayedTime(`${formatDate(startDate)} - ${formatDate(newEndDate)}`)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (title === "") {
      return
    }
    dispatch(scheduleAdded(
      title,
      startDate,
      endDate,
      description,
    ))
    closeModal()
  }

  return (
    <form className='my-10' onSubmit={onSubmit}>
      <input
        className="w-full text-2xl px-3 py-3 rounded mb-10 border border-solid border-gray-300 transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        type="text"
        placeholder="일정 제목"
        autoFocus
        value={title}
        onChange={onTitleChange}
      />
      <div className='flex justify-left py-4 px-1 rounded hover:bg-gray-300 hover:cursor-pointer' onClick={() => setDetailTime(!detailTime)}>
        <FontAwesomeIcon className='text-3xl mr-4' icon={faClockFour} />
        <span className='text-xl'>
          {displayedTime}
        </span>
      </div>
      {detailTime && (
        <div className='my-3 px-1 flex justify-around text-center'>
          <label htmlFor='startDate'>
            <span className='font-bold'>시작 날짜:</span>
            <input className='block p-2 m-2 border rounded'
              type="date"
              id='startDate'
              value={add(startDate, { hours: 9 }).toISOString().substring(0, 10)}
              max={endDate.toISOString().substring(0, 10)}
              onChange={onStartDateChange}
            />
          </label>
          <label htmlFor='endDate'>
            <span className='font-bold'>종료 날짜:</span>
            <input className='block p-2 m-2 border rounded'
              type="date"
              id='endDate'
              value={add(endDate, { hours: 9 }).toISOString().substring(0, 10)}
              min={startDate.toISOString().substring(0, 10)}
              onChange={onEndDateChange}
            />
          </label>
        </div>
      )
      }
      <div className='flex justify-left py-4 px-1 rounded'>
        <FontAwesomeIcon className='text-3xl mr-4' icon={faPen} />
        <textarea
          className="w-5/6 py-2 px-1 border border-solid border-gray-300 transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          type="text"
          placeholder="내용 추가"
          value={description}
          onChange={onDescriptionChange}
        />
      </div>
      <button className='relative top-5 hover:bg-blue-500 text-blue-700 font-bold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>Add Schedule</button>
    </form>
  )
}

export default AddScheduleForm