"use server";

import { Court } from '@/app/lib/definitions';

export async function getMapMarkers() {
  const locations: Court[] = [
    { key: 'thornhill', location: { lat: 51.111839820880064, lng: -114.0650242969602} },
  ];

  return locations;
}
