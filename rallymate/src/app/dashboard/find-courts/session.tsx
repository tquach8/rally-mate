import { CourtSession, User } from "@/app/lib/definitions";
import { joinCourtSession } from "@/app/api/find-courts/actions";
import { useUser } from "../user-context";
import { useState } from "react";

export default function Session({ session }: { session: CourtSession }) {
  const sessionType = {
    0: "Rally",
    1: "Singles",
    2: "Doubles",
  }[session.type];

  const [currentPlayers, setCurrentPlayers] = useState<User[] | []>(
    session.users,
  );
  const user = useUser();

  const handleClick = async () => {
    await joinCourtSession(session);
    if (user) {
      setCurrentPlayers([...currentPlayers, user]);
    }
  };

  return (
    <div className="p-2 flex flex-col gap-1">
      <h4 className="font-semibold">
        {session.start_time.toLocaleDateString("en-us", {
          weekday: "long", // "Thursday"
          year: "numeric", // "2024"
          month: "long", // "October"
          day: "numeric", // "31"
          hour: "numeric",
          minute: "numeric",
          hour12: true, // "12:00 PM"
        })}
      </h4>
      <h3>{sessionType}</h3>
      <h3>
        Players: {currentPlayers.length} / {session.max_players}
      </h3>
      <div className="flex gap-2">
        {currentPlayers.map((user: User) => (
          <img
            key={user.id}
            src={user.profile_url}
            alt={user.name}
            className={`w-10 h-10 rounded-full object-cover border-4 border-primary-500`}
          />
        ))}
      </div>
      {user && currentPlayers.find((u) => u.id === user["id"]) && (
        <button className="bg-red-200 rounded px-4 py-2" onClick={() => {}}>
          Leave
        </button>
      )}
      {user && !currentPlayers.find((u) => u.id === user["id"]) && (
        <button className="bg-primary rounded px-4 py-2" onClick={handleClick}>
          Join
        </button>
      )}
    </div>
  );
}
