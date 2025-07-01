import { getAllSpots } from '@/lib/supabase/spots';
import { getAllClubs } from '@/lib/supabase/clubs';
import SpotsPageClient from '@/components/SpotsPageClient';

export default async function SpotsPage() {
  const [{ spots }, { clubs }] = await Promise.all([
    getAllSpots(),
    getAllClubs()
  ]);

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
      allClubs={clubs}
      currentPage={1}
      totalPages={1}
    />
  );
}