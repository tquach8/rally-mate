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
import { set } from "react-datepicker/dist/date_utils";

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

  return (
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
          <Marker key={court.id} court={court} />
        ))}
      </Map>
    </APIProvider>
  );
}

function Marker({ court }: { court: Court }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const handleMarkerClick = (court: Court) => {
    setInfoWindowShown(true);
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
