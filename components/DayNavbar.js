import { faAngleLeft, faAngleRight, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { add, sub } from 'date-fns'
import { useRouter } from 'next/router'
import { useState } from 'react'
import AddScheduleForm from './AddScheduleForm'
import Modal from './Modal'


export const DayNavbar = ({ date }) => {
  const router = useRouter()
  const today = new Date()
  const [year, month, day] = router.query.date || []
  date = {
    year,
    month,
    day
  }
  const currentDay = new Date(date.year, date.month - 1, date.day)
  const yesterday = sub(currentDay, { days: 1 })
  const tomorrow = add(currentDay, { days: 1 })
  const yesterdayRoute = `/day/${yesterday.getFullYear()}/${yesterday.getMonth() + 1}/${yesterday.getDate()}`
  const tomorrowRoute = `/day/${tomorrow.getFullYear()}/${tomorrow.getMonth() + 1}/${tomorrow.getDate()}`
  const todayRoute = `/day/${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`

  const [modalOpen, setModalOpen] = useState(false)

  const closeModal = () => setModalOpen(!modalOpen)


  const onViewChangeClicked = (e) => {
    if (e.target.value === '월') {
      router.push('/')
    } else if (e.target.value === '주') {
      router.push(`/week/${currentDay.getFullYear()}/${currentDay.getMonth() + 1}/${currentDay.getDate()}`)
    }
  }


  return (
    <>
      <nav className="h-16 bg-indigo-300 flex justify-between items-center font-bold text-white">
        <div className='flex w-1/3 justify-around items-center'>
          <h1 className='bg-indigo-400  p-2 border hover:cursor-pointer shadow hover:bg-indigo-500' onClick={() => router.push('/')}>Youngle Calendar</h1>
          <button className=" bg-indigo-500 hover:bg-indigo-900 py-1 px-2 rounded-full" onClick={() => router.push(todayRoute)}>오늘</button>
        </div>
        <div className='flex w-1/3 justify-around items-center'>
          <button className="text-xl bg-indigo-500 hover:bg-indigo-900 py-1 px-2 rounded-full" onClick={() => router.push(yesterdayRoute)}> {<FontAwesomeIcon icon={faAngleLeft} />}</button>
          <h2 className='text-xl'>{date.year}년 {date.month}월 {date.day}일</h2>
          <button className="text-xl bg-indigo-500 hover:bg-indigo-900 py-1 px-2 rounded-full" onClick={() => router.push(tomorrowRoute)}>{<FontAwesomeIcon icon={faAngleRight} />}</button>
        </div>
        <div className='flex w-1/3 justify-around items-center'>
          <select
            defaultValue={'일'}
            className='text-xl bg-indigo-500 hover:bg-indigo-900 py-1 px-2 rounded-full'
            onChange={onViewChangeClicked}
          >
            <option value='일'>일</option>
            <option value='주'>주</option>
            <option value='월'>월</option>
          </select>
          <button className=" bg-indigo-500 hover:bg-indigo-900 py-1 px-2 rounded-full" onClick={() => setModalOpen(!modalOpen)}>{<FontAwesomeIcon icon={faPlus} />}</button>
        </div>
      </nav>
      {modalOpen && (
        <Modal closeModal={closeModal}>
          <AddScheduleForm targetDate={new Date(date.year, date.month - 1, date.day)} closeModal={closeModal} />
        </Modal>)}
    </>

  )
}