import { CourtSession, User } from "@/app/lib/definitions";
import { joinCourtSession } from "@/app/api/find-courts/actions";

export default function Session({ session }: { session: CourtSession }) {
  const sessionType = {
    0: "Rally",
    1: "Singles",
    2: "Doubles",
  }[session.type];

  const handleClick = async () => {
    joinCourtSession(session);
  };

  return (
    <div>
      <h3>{sessionType}</h3>
      <p>{session.start_time.toISOString()}</p>
      <h3>
        Players: {session.users.length} / {session.max_players}
      </h3>
      <p>{session.users.map((user: User) => user.name).join(", ")}</p>
      <button className="bg-primary rounded px-4 py-2" onClick={handleClick}>
        Join
      </button>
    </div>
  );
}
