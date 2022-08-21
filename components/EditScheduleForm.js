import styles from "../styles/AddScheduleForm.module.css"
import { faPen, faClockFour } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { formatDate } from '../modules/formatDate'
import { useDispatch } from 'react-redux'
import { scheduleEdited } from '../features/schedules/schedulesSlice'
import { add } from 'date-fns'

const EditScheduleForm = ({ schedule, closeModal }) => {
  const [title, setTitle] = useState(schedule.title)
  const [description, setDescription] = useState(schedule.description)
  const [startDate, setStartDate] = useState(schedule.time.startTime)
  const [endDate, setEndDate] = useState(schedule.time.endTime)
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
    dispatch(scheduleEdited(
      schedule.id,
      title,
      startDate,
      endDate,
      description,
    ))
    closeModal()
  }
  return (
    <form onSubmit={onSubmit}>
      <input
        className={styles.titleInput}
        type="text"
        placeholder="일정 제목"
        autoFocus
        value={title}
        onChange={onTitleChange}
      />
      <br />
      <br />
      <div onClick={() => setDetailTime(!detailTime)}>
        <FontAwesomeIcon icon={faClockFour} />
        {displayedTime}
      </div>
      {detailTime && (
        <>
          <label htmlFor='startDate'>
            시작 날짜:
            <input
              type="date"
              id='startDate'
              value={add(startDate, { hours: 9 }).toISOString().substring(0, 10)}
              max={endDate.toISOString().substring(0, 10)}
              onChange={onStartDateChange}
            />
          </label>
          <label htmlFor='endDate'>
            종료 날짜:
            <input
              type="date"
              id='endDate'
              value={add(endDate, { hours: 9 }).toISOString().substring(0, 10)}
              min={startDate.toISOString().substring(0, 10)}
              onChange={onEndDateChange}
            />
          </label>
        </>
      )
      }
      <br />
      <br />
      <div>
        <FontAwesomeIcon icon={faPen} />
        <textarea
          className={styles.descriptionInput}
          type="text"
          placeholder="내용 추가"
          value={description}
          onChange={onDescriptionChange}
        />
      </div>
      <button>Edit Schedule</button>
    </form>
  )

}

export default EditScheduleForm