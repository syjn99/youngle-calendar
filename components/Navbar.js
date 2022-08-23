import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { nextMonth, prevMonth, todayMonth } from '../features/currentMonth/currentMonthSlice'
import AddScheduleForm from './AddScheduleForm'
import Modal from './Modal'

export const Navbar = () => {
  const dispatch = useDispatch()
  const { year, month } = useSelector(state => state.currentMonth)
  const [modalOpen, setModalOpen] = useState(false)

  const closeModal = () => setModalOpen(!modalOpen)

  return (
    <>
      <nav className="h-16 bg-indigo-300 flex justify-between items-center font-bold text-white">
        <h1 className='bg-indigo-400  m-3 p-2 border'>Youngle Calendar</h1>
        <button className=" bg-indigo-500 hover:bg-indigo-900 py-1 px-2 rounded-full" onClick={() => dispatch(todayMonth())}>오늘</button>
        <button className="text-xl bg-indigo-500 hover:bg-indigo-900 py-1 px-2 rounded-full" onClick={() => dispatch(prevMonth())}> {"<"}</button>
        <h2 className='text-xl'>{year}년 {month + 1}월</h2>
        <button className="text-xl mr-60 bg-indigo-500 hover:bg-indigo-900 py-1 px-2 rounded-full" onClick={() => dispatch(nextMonth())}>{">"}</button>
        <button className=" bg-indigo-500 hover:bg-indigo-900 py-1 px-2 rounded-full mr-10" onClick={() => setModalOpen(!modalOpen)}>+</button>
      </nav>
      {modalOpen && (
        <Modal closeModal={closeModal}>
          <AddScheduleForm targetDate={new Date()} closeModal={closeModal} />
        </Modal>)}
    </>

  )
}