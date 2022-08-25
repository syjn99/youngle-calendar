const Modal = ({ closeModal, children }) => {
  return (
    <div className='fixed top-0 right-0 w-full h-full flex justify-center items-center bg-gray-700/40 z-50' onClick={closeModal}>
      <div className='absolute w-1/2 h-6/7 p-10 bg-white rounded-xl text-center shadow-md' onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4 w-8 h-8 rounded-full text-xl font-bold hover:bg-gray-200" onClick={closeModal}>X</button>
        {children}
      </div>
    </div>
  )
}

export default Modal