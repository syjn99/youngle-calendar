import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { scheduleDeleted, scheduleEdited } from '../features/schedules/schedulesSlice'
import { formatDate } from '../modules/formatDate'
import EditScheduleForm from './EditScheduleForm'

const ScheduleDetail = ({ scheduleId, closeModal }) => {
  const schedule = useSelector(state => state.schedules.schedulesList.find(schedule => schedule?.id === scheduleId))
  const [isEdit, setIsEdit] = useState(false)

  const dispatch = useDispatch()

  const onEditBtnClicked = () => {
    setIsEdit(!isEdit)
  }

  const onDeleteBtnClicked = () => {
    dispatch(scheduleDeleted(scheduleId))
    closeModal()
  }

  const ScheduleDetailPage = () => {
    return (
      <>
        <h1>{schedule.title}</h1>
        <h2>{`${formatDate(schedule.time.startTime)} - ${formatDate(schedule.time.endTime)}`}</h2>
        <h3>{schedule.description ? schedule.description : "No Description"}</h3>
        <button onClick={onEditBtnClicked}>Edit this schedule</button>
        <button onClick={onDeleteBtnClicked}>Delete this schedule</button>
      </>
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