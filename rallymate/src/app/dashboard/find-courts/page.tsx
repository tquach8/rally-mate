"use client";
import { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

import { getMapMarkers } from "@/app/api/find-courts/actions";
import { Court } from "@/app/lib/definitions";

export default function MapPage() {
  const [locations, setLocations] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

  const fetchLocations = async () => {
    try {
      const locations = await getMapMarkers();
      setLocations(locations);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (court: Court) => {
    setSelectedCourt(court);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <div className="w-full h-full flex">
      <div className="w-2/3">
        <APIProvider apiKey="AIzaSyD2mujnNpmbA1SpYjE-p0NNGgYBis9ZwhM">
          <Map
            mapId="a36974837d33b973"
            className="w-full h-full"
            defaultCenter={{ lat: 51.04455174216072, lng: -114.07054095807823 }}
            defaultZoom={11}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
          >
            {locations.map((court) => (
              <Marker key={court.id} court={court} onClick={handleClick} />
            ))}
          </Map>
        </APIProvider>
      </div>
      <div className="w-1/3">
        {selectedCourt && (
          <div className="bg-white p-4">
            <h2 className="text-xl font-semibold">{selectedCourt.display_name}</h2>
            <p>{selectedCourt.number_of_courts} courts</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Marker({ court, onClick }: { court: Court; onClick: (court: Court) => void }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const handleMarkerClick = (court: Court) => {
    setInfoWindowShown(true);
    onClick(court);
  };

  const handleClose = () => setInfoWindowShown(false);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        clickable={true}
        key={court.name}
        position={court.location}
        onClick={() => {
          handleMarkerClick(court);
        }}
      />

      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleClose}>
          <div>
            <h1>{court.display_name}</h1>
            <p>{court.number_of_courts} courts</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
