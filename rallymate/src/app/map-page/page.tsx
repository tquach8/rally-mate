"use client";
import { useEffect, useState } from "react";
import {APIProvider, Map, AdvancedMarker} from '@vis.gl/react-google-maps';

import { getMapMarkers } from '@/app/api/map-page/actions';
import { Court } from '@/app/lib/definitions';

export default function MapPage() {
  const [locations, setLocations] = useState<Court[]>([]);

  const fetchLocations = async () => {
    try {
      const locations = await getMapMarkers();
      setLocations(locations);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <APIProvider apiKey="AIzaSyD2mujnNpmbA1SpYjE-p0NNGgYBis9ZwhM">
    <Map
      mapId="a36974837d33b973"
      style={{width: '100vw', height: '100vh'}}
      defaultCenter={{lat: 22.54992, lng: 0}}
      defaultZoom={3}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
    >
      {locations.map((marker) => (
        <AdvancedMarker
          key={marker.key}
          position={marker.location}
        />
      ))}
    </Map>
  </APIProvider>
  )
}
