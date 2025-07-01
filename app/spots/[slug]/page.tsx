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
  const slugs = await getSpotSlugs()
  return slugs.slice(0, 1000).map((slug) => ({ slug }))
}

export default async function SpotPage({ params }: Props) {
  const spot = await getSpotBySlug(params.slug);

  if (!spot) {
    notFound();
  }

  return <SpotDetails {...spot} />;
} 