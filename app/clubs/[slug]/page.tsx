import { notFound } from "next/navigation";
import clubsData from "@/data/clubs.json";
import ClubDetails from "@/components/ClubDetails";

type Club = {
  slug: string;
  name: string;
  country: string;
  location: string;
  description: string;
  image: string;
  coords: [number, number];
  trainingSchool: string;
  activity: string;
  price: string;
  rating: number;
  reviews: {
    author: string;
    comment: string;
    rating: number;
  }[];
  instructors: {
    name: string;
    experience: string;
    speciality: string;
    photo?: string;
  }[];
  experiences: {
    slug: string;
    title: string;
    level: string;
    price: string;
    description: string;
    image: string;
    rating: number;
    animals: string[];
    activity: string;
    reviews: {
      author: string;
      comment: string;
      rating: number;
    }[];
  }[];
};

export default function ClubPage({ params }: { params: { slug: string } }) {
  const clubs = (clubsData as any[]).map((club) => ({
    ...club,
    coords: club.coords as [number, number],
  }));

  const club = clubs.find((c) => c.slug === params.slug);
  if (!club) return notFound();

  return <ClubDetails {...club} />;
}
