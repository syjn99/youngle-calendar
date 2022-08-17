import Head from 'next/head';
import { useSelector } from 'react-redux';

export default function Seo() {
  const { year, month } = useSelector(state => state.currentMonth)
  return <Head>
    <title>Youngle Calendar - {year}년 {month + 1}월</title>
  </Head>
}