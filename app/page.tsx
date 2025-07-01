import { getAllSpots } from '@/lib/queries'
import HomeClient from '@/components/HomeClient'

export const revalidate = 3600

export default async function Home() {
  const spots = await getAllSpots({ pageSize: 50 })
  return <HomeClient spots={spots} total={spots.length} />
}
