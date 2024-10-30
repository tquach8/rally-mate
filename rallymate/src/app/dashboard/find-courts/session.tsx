import { CourtSession, User } from "@/app/lib/definitions";

export default function Session({ session }: { session: CourtSession }) {
  const sessionType = {
    0: "Rally",
    1: "Singles",
    2: "Doubles",
  }[session.type];

  return (
    <div>
      <h3>{sessionType}</h3>
      <p>{session.start_time.toISOString()}</p>
      <h3>
        Players: {session.users.length} / {session.max_players}
      </h3>
      <p>{session.users.map((user: User) => user.name).join(", ")}</p>
    </div>
  );
}
