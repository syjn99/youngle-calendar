import { useSelector } from 'react-redux'
import Days from './Days'
import { Navbar } from './Navbar'

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Days />
      <div>{children}</div>
    </>
  )
}

export default Layout