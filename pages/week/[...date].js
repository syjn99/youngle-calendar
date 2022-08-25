import { useRouter } from 'next/router'
import { WeekNavbar } from '../../components/WeekNavbar'

export default function WeekView() {
  const router = useRouter()
  const [year, month, day] = router.query.date || []
  const date = {
    year,
    month,
    day
  }

  return (
    <>
      <WeekNavbar date={date} />
      <div>hi</div>
    </>
  )
}