import { faPen, faClockFour, faMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { formatDate } from '../modules/formatDate'
import { useDispatch } from 'react-redux'
import { scheduleEdited } from '../features/schedules/schedulesSlice'
import { add } from 'date-fns'
import DetailTimeSet from './DetailTimeSet'
import { createDetailTimeObject } from '../modules/createDetailTimeObject'

const EditScheduleForm = ({ schedule, closeModal }) => {
  const [title, setTitle] = useState(schedule.title)
  const [description, setDescription] = useState(schedule.description)
  const [startDate, setStartDate] = useState(schedule.time.startTime)
  const [endDate, setEndDate] = useState(schedule.time.endTime)
  const [detailTime, setDetailTime] = useState(false)
  const [displayedTime, setDisplayedTime] = useState(`${formatDate(startDate)} - ${formatDate(endDate)}`)
  const [isTimeSet, setIsTimeSet] = useState(false)


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
    let time = null
    if (detailTime && isTimeSet) {
      time = createDetailTimeObject(e.target)
      if (!time) {
        return
      }
    }
    if (title === "") {
      return
    }
    if (!time) {
      time = {
        isDetailSet: false,
        startTime: startDate,
        endTime: endDate,
      }
    }
    dispatch(scheduleEdited(
      schedule.id,
      title,
      time,
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
        <>
          <div className='my-3 px-1 flex justify-around text-center'>
            <label htmlFor='startDate'>
              <span className='font-bold'>시작 날짜:</span>
              <input className='block p-2 m-2 border rounded'
                type="date"
                id='startDate'
                value={add(startDate, { hours: 9 }).toISOString().substring(0, 10)}
                max={add(endDate, { hours: 9 }).toISOString().substring(0, 10)}
                onChange={onStartDateChange}
              />
            </label>
            <label htmlFor='endDate'>
              <span className='font-bold'>종료 날짜:</span>
              <input className='block p-2 m-2 border rounded'
                type="date"
                id='endDate'
                value={add(endDate, { hours: 9 }).toISOString().substring(0, 10)}
                min={add(startDate, { hours: 9 }).toISOString().substring(0, 10)}
                onChange={onEndDateChange}
              />
            </label>
          </div>
          <div onClick={() => setIsTimeSet(!isTimeSet)} className='p-3 hover:bg-gray-100 hover:cursor-pointer'>
            <input type="checkbox" id='isWholeDay' checked={!isTimeSet} onChange={() => setIsTimeSet(!isTimeSet)} />
            <label className='hover:cursor-pointer'>하루종일</label>
          </div>
          {isTimeSet && (
            <>
              <DetailTimeSet isStart={true} />
              <FontAwesomeIcon icon={faMinus} />
              <DetailTimeSet isStart={false} />
            </>
          )}
        </>
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
      <button className='relative top-5 hover:bg-blue-500 text-blue-700 font-bold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>Edit Schedule</button>
    </form>
  )

}

export default EditScheduleForm