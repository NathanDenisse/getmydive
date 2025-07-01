import { NextResponse } from 'next/server';
import clubs from '@/data/clubs.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country');
  const location = searchParams.get('location');
  const trainingSchool = searchParams.get('trainingSchool');

  let filteredClubs = [...clubs];

  if (country) {
    filteredClubs = filteredClubs.filter(club =>
      club.country.toLowerCase() === country.toLowerCase()
    );
  }

  if (location) {
    filteredClubs = filteredClubs.filter(club =>
      club.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (trainingSchool) {
    filteredClubs = filteredClubs.filter(club =>
      club.trainingSchool.toLowerCase().includes(trainingSchool.toLowerCase())
    );
  }

  return NextResponse.json(filteredClubs);
} 