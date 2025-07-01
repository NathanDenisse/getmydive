require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const spots = require('../data/spots.json');
const clubs = require('../data/clubs.json');
const experiences = require('../data/experiences.json');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function importData() {
  try {
    // Import des spots
    for (const spot of spots) {
      const { error } = await supabase
        .from('spots')
        .upsert({
          slug: spot.slug,
          name: spot.name,
          country: spot.country,
          description: spot.description,
          image: spot.image,
          coords: spot.coords,
          animals: spot.animals,
          level: spot.level,
          activity: spot.activity,
          price: spot.price,
          temperature: spot.temperature,
          visibility: spot.visibility,
          current: spot.current,
          depth_range: spot.depthRange,
          best_season: spot.bestSeason,
          category: spot.category
        });
      if (error) {
        console.error(`Erreur lors de l'import du spot ${spot.slug}:`, error);
      } else {
        console.log(`Spot ${spot.slug} importé avec succès`);
      }
    }

    // Import des clubs
    for (const club of clubs) {
      const { error } = await supabase
        .from('clubs')
        .upsert({
          slug: club.slug,
          name: club.name,
          country: club.country,
          location: club.location,
          description: club.description,
          image: club.image,
          training_school: club.trainingSchool,
          rating: club.rating
        });
      if (error) {
        console.error(`Erreur lors de l'import du club ${club.slug}:`, error);
      } else {
        console.log(`Club ${club.slug} importé avec succès`);
      }
    }

    // Import des expériences
    for (const experience of experiences) {
      const { error } = await supabase
        .from('experiences')
        .upsert({
          slug: experience.slug,
          title: experience.title,
          description: experience.description,
          image: experience.image,
          animals: experience.animals,
          level: experience.level,
          price: experience.price,
          rating: experience.rating,
          club_slug: experience.clubSlug
        });
      if (error) {
        console.error(`Erreur lors de l'import de l'expérience ${experience.slug}:`, error);
      } else {
        console.log(`Expérience ${experience.slug} importée avec succès`);
      }
    }

    console.log('Import terminé');
  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
  }
}

importData(); 