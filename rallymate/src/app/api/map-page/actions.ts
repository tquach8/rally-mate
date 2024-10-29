"use server";

import { PointOfInterest } from '@/app/lib/types';

export async function getMapMarkers() {
  const locations: PointOfInterest[] = [
    { key: 'thornhill', location: { lat: 51.111839820880064, lng: -114.0650242969602} },
  ];

  return locations;
}
