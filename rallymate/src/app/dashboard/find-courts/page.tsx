"use client";

import { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

import {
  getCourtPlayers,
  getMapMarkers,
} from "@/app/api/find-courts/actions";
import { Court } from "@/app/lib/definitions";
import SessionList from "@/app/dashboard/find-courts/session-list";
import Image from "next/image";

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
    <div className="w-full h-full flex gap-4">
      <div className="w-2/3 rounded-xl overflow-hidden">
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
      <div className="w-1/3 rounded-xl p-4 bg-slate-200 overflow-auto">
        {selectedCourt && (
          <>
            <div className="flex bg-white p-4 mb-4 rounded-xl">
              <h2 className="text-xl font-semibold">
                {selectedCourt.display_name}
              </h2>
              <p>{selectedCourt.number_of_courts} courts</p>
            </div>
            <SessionList court={selectedCourt} />
          </>
        )}
      </div>
    </div>
  );
}

function Marker({
  court,
  onClick,
}: {
  court: Court;
  onClick: (court: Court) => void;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [currentPlayers, setCurrentPlayers] = useState([]);

  const handleMarkerClick = (court: Court) => {
    setInfoWindowShown(!infoWindowShown);
    onClick(court);
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const players = await getCourtPlayers(court);
        setCurrentPlayers(players);
      } catch (error) {
        console.error(error);
      }
    };

    if (infoWindowShown) {
      fetchPlayers();
    }
  }, [infoWindowShown]);

  const handleClose = () => setInfoWindowShown(false);

  const borderColors = [
    "border-blue-200",
    "border-red-200",
    "border-green-200",
    "border-yellow-200",
    "border-purple-200",
    "border-pink-200",
    "border-teal-200",
    "border-orange-200",
  ];

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
        <InfoWindow anchor={marker} onClose={handleClose} headerDisabled={true}>
          <div className="flex justify-between">
            <div className="relative w-40 h-40 overflow-hidden rounded-lg">
              <Image
                layout="fill"
                className="rounded-lg"
                src={court.image_url}
                alt={court.display_name}
              />
            </div>
            <div className="ml-4">
              <h1 className="text-lg font-medium">{court.display_name}</h1>
              <p>{court.number_of_courts} courts</p>
              {currentPlayers.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-lg font-medium">Active players</h2>
                  <div className="flex gap-2">
                    {currentPlayers.map((player) => {
                      const randomColor =
                        borderColors[
                          Math.floor(Math.random() * borderColors.length)
                        ];
                      return (
                        <img
                          key={player.id}
                          src={player.profile_url}
                          alt={player.name}
                          className={`w-10 h-10 rounded-full object-cover border-4 ${randomColor}`}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
