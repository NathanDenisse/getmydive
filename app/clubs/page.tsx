import clubs from "@/data/clubs.json";
import ClubsPageClient from "@/components/ClubsPageClient";

export default function ClubsPage() {
  return (
    <ClubsPageClient clubs={clubs as any[]} />
  );
}
