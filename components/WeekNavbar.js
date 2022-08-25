import { faAngleLeft, faAngleRight, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { add, sub } from 'date-fns'
import { useRouter } from 'next/router'
import { useState } from 'react'
import AddScheduleForm from './AddScheduleForm'
import Modal from './Modal'

export const WeekNavbar = ({ date }) => {
  const router = useRouter()
  const today = new Date()
  const currentDay = new Date(date.year, date.month - 1, date.day)
  const lastWeekDay = sub(currentDay, { weeks: 1 })
  const nextWeekDay = add(currentDay, { weeks: 1 })
  const lastWeekDayRoute = `/week/${lastWeekDay.getFullYear()}/${lastWeekDay.getMonth() + 1}/${lastWeekDay.getDate()}`
  const nextWeekDayRoute = `/week/${nextWeekDay.getFullYear()}/${nextWeekDay.getMonth() + 1}/${nextWeekDay.getDate()}`
  const todayRoute = `/week/${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`

  const [modalOpen, setModalOpen] = useState(false)

  const closeModal = () => setModalOpen(!modalOpen)

  const onViewChangeClicked = (e) => {
    if (e.target.value === '월') {
      router.push('/')
    } else if (e.target.value === '일') {
      router.push(`/day/${currentDay.getFullYear()}/${currentDay.getMonth() + 1}/${currentDay.getDate()}`)
    }
  }


  return (
    <>
      <nav className="h-16 bg-indigo-300 flex justify-between items-center font-bold text-white">
        <h1 className='bg-indigo-400  m-3 p-2 border'>Youngle Calendar</h1>
        <button className=" bg-indigo-500 hover:bg-indigo-900 py-1 px-2 rounded-full" onClick={() => router.push(todayRoute)}>오늘</button>
        <button className="text-xl bg-indigo-500 hover:bg-indigo-900 py-1 px-2 rounded-full" onClick={() => router.push(lastWeekDayRoute)}> {<FontAwesomeIcon icon={faAngleLeft} />}</button>
        <h2 className='text-xl'>{date.year}년 {date.month}월 {date.day}일</h2>
        <button className="text-xl mr-1/7 bg-indigo-500 hover:bg-indigo-900 py-1 px-2 rounded-full" onClick={() => router.push(nextWeekDayRoute)}>{<FontAwesomeIcon icon={faAngleRight} />}</button>
        <select
          defaultValue={'주'}
          className='text-xl bg-indigo-500 hover:bg-indigo-900 py-1 px-2 rounded-full'
          onChange={onViewChangeClicked}
        >
          <option value='일'>일</option>
          <option value='주'>주</option>
          <option value='월'>월</option>
        </select>
        <button className=" bg-indigo-500 hover:bg-indigo-900 py-1 px-2 rounded-full mr-10" onClick={() => setModalOpen(!modalOpen)}>{<FontAwesomeIcon icon={faPlus} />}</button>
      </nav>
      {modalOpen && (
        <Modal closeModal={closeModal}>
          <AddScheduleForm targetDate={new Date(date.year, date.month - 1, date.day)} closeModal={closeModal} />
        </Modal>)}
    </>

  )
}