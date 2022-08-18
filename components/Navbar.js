import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { nextMonth, prevMonth } from '../features/currentMonth/currentMonthSlice'
import styles from "../styles/Navbar.module.css"
import AddScheduleForm from './AddScheduleForm'
import Modal from './Modal'

export const Navbar = () => {
  const dispatch = useDispatch()
  const { year, month } = useSelector(state => state.currentMonth)
  const [modalOpen, setModalOpen] = useState(false)

  const closeModal = () => setModalOpen(!modalOpen)

  return (
    <>
      <nav className={styles.nav}>
        <section className={styles.container}>
          <h1>Youngle Calendar</h1>
          <button className={styles.button} onClick={() => dispatch(prevMonth())}> {"<"}</button>
          <h2>{year}년 {month + 1}월</h2>
          <button className={styles.button} onClick={() => dispatch(nextMonth())}>{">"}</button>
          <button className={styles.button} onClick={() => setModalOpen(!modalOpen)}>+</button>
        </section>
      </nav>
      {modalOpen && (
        <Modal closeModal={closeModal}>
          <AddScheduleForm targetDate={new Date()} closeModal={closeModal} />
        </Modal>)}
    </>

  )
}