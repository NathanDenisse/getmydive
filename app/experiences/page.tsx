import ExperiencesPageClient from "@/components/ExperiencesPageClient";
import clubs from "@/data/clubs.json";

type Experience = {
  slug: string;
  title: string;
  description: string;
  price: string;
  level: string;
  activity: string;
  animals: string[];
  image: string;
  rating: number;
  coords: [number, number];
  clubSlug: string;
  clubName: string;
};

export default function ExperiencesPage() {
  const allExperiences: Experience[] = (clubs || []).flatMap((club) =>
    (club.experiences || []).map((exp) => ({
      ...exp,
      slug: exp.slug,
      coords: club.coords as [number, number],
      clubSlug: club.slug,
      clubName: club.name,
    }))
  );

  console.log('Expériences avec coordonnées:', allExperiences.map(exp => ({
    title: exp.title,
    coords: exp.coords,
    clubName: exp.clubName
  })));

  return (
    <ExperiencesPageClient experiences={allExperiences} />
  );
}
