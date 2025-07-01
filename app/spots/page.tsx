import { getAllSpots } from '@/lib/supabase/spots';
import SpotsPageClient from '@/components/SpotsPageClient';

export default async function SpotsPage() {
  const { spots } = await getAllSpots(1, 10000); // On charge tous les spots (limite haute)
  return (
    <SpotsPageClient
      spots={spots}
      allSpots={spots}
      currentPage={1}
      totalPages={1}
    />
  );
}