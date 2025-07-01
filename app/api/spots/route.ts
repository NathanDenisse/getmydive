import { getAllSpots } from '@/lib/supabase/spots';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const spots = await getAllSpots();
    return NextResponse.json(spots);
  } catch (error) {
    console.error('Error fetching spots:', error);
    return NextResponse.json({ error: 'Failed to fetch spots' }, { status: 500 });
  }
} 