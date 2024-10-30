"use client";
import { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

import { getMapMarkers } from "@/app/api/find-courts/actions";
import { Court } from "@/app/lib/definitions";

export default function MapPage() {
  const [locations, setLocations] = useState<Court[]>([]);

  const fetchLocations = async () => {
    try {
      const locations = await getMapMarkers();
      setLocations(locations);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleMarkerClick = (court: Court) => {
    console.log("Marker clicked:", court);
  };

  return (
    <APIProvider apiKey="AIzaSyD2mujnNpmbA1SpYjE-p0NNGgYBis9ZwhM">
      <Map
        mapId="a36974837d33b973"
        style={{ width: "100vw", height: "100vh" }}
        defaultCenter={{ lat: 51.04455174216072, lng: -114.07054095807823 }}
        defaultZoom={11}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        {locations.map((court) => (
          <AdvancedMarker
            clickable={true}
            key={court.name}
            position={court.location}
            onClick={() => {
              handleMarkerClick(court);
            }}
          />
        ))}
      </Map>
    </APIProvider>
  );
}
