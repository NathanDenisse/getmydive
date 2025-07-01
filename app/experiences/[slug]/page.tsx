import { notFound } from "next/navigation";
import clubs from "@/data/clubs.json";
import ExperienceDetails from "@/components/ExperienceDetails";

export async function generateStaticParams() {
  return (clubs || []).flatMap((club) =>
    (club.experiences || []).map((exp) => ({ slug: exp.slug }))
  );
}

export default function ExperiencePage({ params }: { params: { slug: string } }) {
  const experience = (clubs || [])
    .flatMap((club) =>
      (club.experiences || []).map((exp) => ({
        ...exp,
        clubSlug: club.slug,
        clubName: club.name,
        coords: (club.coords && club.coords.length === 2 ? club.coords : [0, 0]) as [number, number],
        price: typeof exp.price === 'string' ? parseFloat(exp.price.replace(/[^\d.]/g, '')) || 0 : exp.price || 0,
        duration: (exp as any).duration || '',
        maxDepth: (exp as any).maxDepth || 0,
        temperature: (exp as any).temperature || 0,
        visibility: (exp as any).visibility || 0,
        included: (exp as any).included || [],
        requirements: (exp as any).requirements || [],
        schedule: (exp as any).schedule || [],
      }))
    )
    .find((exp) => exp.slug === params.slug);

  if (!experience) return notFound();

  return <ExperienceDetails {...experience} />;
}
