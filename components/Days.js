import styles from "../styles/Days.module.css"

const Days = () => {
  return (
    <div className={styles.Days}>
      <div className={styles.eachDay}>Sun</div>
      <div className={styles.eachDay}>Mon</div>
      <div className={styles.eachDay}>Tue</div>
      <div className={styles.eachDay}>Wed</div>
      <div className={styles.eachDay}>Thur</div>
      <div className={styles.eachDay}>Fri</div>
      <div className={styles.eachDay}>Sat</div>
    </div>
  )
}

export default Days