import { useRouter } from 'next/router';

export default function Detail() {
  const router = useRouter();
  const [year, month] = router.query.params || [];

  return (
    <div>
      <h4>{year} {month}</h4>
    </div>
  )
}