import { getAllSpots } from '@/lib/supabase/spots';
import SpotsPageClient from '@/components/SpotsPageClient';

export default async function SpotsPage() {
  const { spots } = await getAllSpots();
  const spotsWithDefaults = spots.map(spot => ({
    ...spot,
    infrastructure: (spot as any).infrastructure || [],
    marine_reserve: (spot as any).marine_reserve ?? false,
    certification_required: (spot as any).certification_required || [],
  }));
  return (
    <SpotsPageClient
      spots={spotsWithDefaults}
      allSpots={spotsWithDefaults}
      currentPage={1}
      totalPages={1}
    />
  );
}