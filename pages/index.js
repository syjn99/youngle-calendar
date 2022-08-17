import Head from 'next/head'
import Image from 'next/image'
import { Calendar } from '../components/Calendar'
import Days from '../components/Days'
import Seo from '../components/Seo'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Seo />
      <Calendar />
    </>
  )
}
