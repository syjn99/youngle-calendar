import { wrapper } from '../store/store'
import '../styles/globals.css'

function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <style global jsx>{`
          html,
          body,
          div#__next {
            height: 100vh;
          }
        `}</style>
    </>
  )
}

export default wrapper.withRedux(App)
