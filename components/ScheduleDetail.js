import { faClockFour, faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { scheduleDeleted } from '../features/schedules/schedulesSlice'
import { formatDate } from '../modules/formatDate'
import EditScheduleForm from './EditScheduleForm'

const ScheduleDetail = ({ scheduleId, closeModal }) => {
  const schedule = useSelector(state => state.schedules.schedulesList.find(schedule => schedule?.id === scheduleId))
  const [isEdit, setIsEdit] = useState(false)
  const dispatch = useDispatch()
  if (!schedule) {
    return
  }

  const isDetailSet = schedule.time.isDetailSet


  const formatTime = (startTime) => {
    return `${startTime.getHours()}:${startTime.getMinutes() === 0 ? '00' : startTime.getMinutes()} `
  }

  const onEditBtnClicked = () => {
    setIsEdit(!isEdit)
  }

  const onDeleteBtnClicked = () => {
    dispatch(scheduleDeleted(scheduleId))
    closeModal()
  }

  const ScheduleDetailPage = () => {
    return (
      <div className='my-10'>
        <h1 className='text-2xl font-semibold mb-8'>{schedule.title}</h1>
        <div className='flex justify-left py-4 px-1'>
          <FontAwesomeIcon className='text-3xl mr-4' icon={faClockFour} />
          <span className='text-xl'>
            {`${formatDate(schedule.time.startTime)} - ${formatDate(schedule.time.endTime)}`}
          </span>
        </div>
        {isDetailSet ? (
          <div className='text-lg'>
            {`${formatTime(schedule.time.startTime)} - ${formatTime(schedule.time.endTime)}`}
          </div>
        ) : null}
        <div className='flex justify-left py-4 px-1 rounded'>
          <FontAwesomeIcon className='text-3xl mr-4' icon={faPen} />
          <span className="">
            {schedule.description ? schedule.description : "No Description"}
          </span>
        </div>
        <button className='m-1 relative top-5 hover:bg-blue-500 text-blue-700 font-bold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded' onClick={onEditBtnClicked}>Edit this schedule</button>
        <button className='m-1 relative top-5 hover:bg-blue-500 text-blue-700 font-bold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded' onClick={onDeleteBtnClicked}>Delete this schedule</button>
      </div >
    )
  }

  return (
    <>
      {isEdit
        ? <EditScheduleForm schedule={schedule} closeModal={closeModal} />
        : <ScheduleDetailPage />
      }
    </>
  )
}

export default ScheduleDetail