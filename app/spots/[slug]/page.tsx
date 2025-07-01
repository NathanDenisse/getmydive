import { notFound } from "next/navigation";
import { getSpotBySlug } from "@/lib/supabase/spots";
import SpotDetails from "@/components/SpotDetails";
import { getSpotSlugs } from '@/lib/queries'

type Props = {
  params: {
    slug: string;
  };
};

export const revalidate = 86400

export async function generateStaticParams() {
  try {
    const slugs = await getSpotSlugs()
    // Limiter à 100 spots pour éviter les timeouts lors du build
    return slugs.slice(0, 100).map((slug) => ({ slug }))
  } catch (error) {
    console.error('Erreur lors de la récupération des slugs:', error)
    // Retourner un tableau vide en cas d'erreur pour éviter l'échec du build
    return []
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page({ params }: any) {
  try {
    const spot = await getSpotBySlug(params.slug);

    if (!spot) {
      notFound();
    }

    return <SpotDetails {...spot} />;
  } catch (error) {
    console.error(`Erreur lors de la récupération du spot ${params.slug}:`, error);
    notFound();
  }
} 