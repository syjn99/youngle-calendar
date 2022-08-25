import { faAngleLeft, faAngleRight, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { nextMonth, prevMonth, todayMonth } from '../features/currentMonth/currentMonthSlice'
import AddScheduleForm from './AddScheduleForm'
import Modal from './Modal'

export const Navbar = () => {
  const dispatch = useDispatch()
  const { year, month } = useSelector(state => state.currentMonth)
  const [modalOpen, setModalOpen] = useState(false)
  const today = new Date()
  const todayRoute = `/day/${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`


  const router = useRouter()

  const closeModal = () => setModalOpen(!modalOpen)

  const onViewChangeClicked = (e) => {
    if (e.target.value === '일') {
      router.push(todayRoute)
    }
  }

  return (
    <>
      <nav className="h-16 bg-indigo-300 flex justify-between items-center font-bold text-white">
        <h1 className='bg-indigo-400  m-3 p-2 border'>Youngle Calendar</h1>
        <button className=" bg-indigo-500 hover:bg-indigo-900 py-1 px-2 rounded-full" onClick={() => dispatch(todayMonth())}>오늘</button>
        <button className="text-xl bg-indigo-500 hover:bg-indigo-900 py-1 px-2 rounded-full" onClick={() => dispatch(prevMonth())}> {<FontAwesomeIcon icon={faAngleLeft} />}</button>
        <h2 className='text-xl'>{year}년 {month + 1}월</h2>
        <button className="text-xl mr-1/7 bg-indigo-500 hover:bg-indigo-900 py-1 px-2 rounded-full" onClick={() => dispatch(nextMonth())}>{<FontAwesomeIcon icon={faAngleRight} />}</button>
        <select
          defaultValue={'월'}
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
          <AddScheduleForm targetDate={new Date()} closeModal={closeModal} />
        </Modal>)}
    </>

  )
}