import { useEffect, useState } from "react";

import { Court, CourtSession } from "@/app/lib/definitions";
import { getCourtSessions } from "@/app/api/find-courts/actions";
import Session from "@/app/dashboard/find-courts/session";

export default function SessionList({ court }: { court: Court }) {
  const [sessions, setSessions] = useState<CourtSession[]>([]);

  const fetchSessions = async () => {
    try {
      const sessions = await getCourtSessions(court);
      setSessions(sessions);
      console.log(sessions);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [court]);

  return (
    <div className="bg-white p-4">
      <h2 className="text-xl font-semibold">Sessions</h2>
      <ul>
        {sessions.map((session) => (
          <li key={session.id}>
            <Session session={session} />
          </li>
        ))}
      </ul>
    </div>
  );
}
