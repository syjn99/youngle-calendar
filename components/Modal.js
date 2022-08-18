import styles from "../styles/Modal.module.css"

const Modal = ({ closeModal, children }) => {
  return (
    <div className={styles.Modal} onClick={closeModal}>
      <div className={styles.modalBody} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={closeModal}>X</button>
        {children}
      </div>
    </div>
  )
}

export default Modal