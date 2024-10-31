import { useEffect, useState } from "react";

import { Court, CourtSession } from "@/app/lib/definitions";
import { getCourtSessions } from "@/app/api/find-courts/actions";
import { createSession } from "@/app/actions/court-session";
import Session from "@/app/dashboard/find-courts/session";

export default function SessionList({ court }: { court: Court }) {
  const [sessions, setSessions] = useState<CourtSession[]>([]);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);

  const fetchSessions = async () => {
    try {
      const sessions = await getCourtSessions(court);
      setSessions(sessions);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateSession = () => {
    setSessionModalOpen(true);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    await createSession(event);
    setSessionModalOpen(false);
    fetchSessions();
  };

  useEffect(() => {
    fetchSessions();
  }, [court]);

  return (
    <div className="bg-white p-4 rounded-xl">
      {sessionModalOpen && (
        <div className="bg-white p-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Create session</h2>
            <button onClick={() => setSessionModalOpen(false)}>X</button>
          </div>
          <form action={handleFormSubmit}>
            <input type="hidden" name="courtId" value={court.id} />
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                defaultValue={new Date().toISOString()}
                type="date"
                name="date"
                id="date"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="maxPlayers" className="block text-sm font-medium text-gray-700">
                Players
              </label>
              <input
                min="2"
                defaultValue="2"
                type="number"
                name="maxPlayers"
                id="maxPlayers"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="hours" className="block text-sm font-medium text-gray-700">
                Hours
              </label>
              <input
                min="1"
                defaultValue="1"
                type="number"
                name="hours"
                id="hours"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                name="type"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="0">Rally</option>
                <option value="1">Singles</option>
                <option value="2">Doubles</option>
              </select>
            </div>
            <button className="bg-primary rounded px-4 py-2">Create</button>
          </form>
        </div>
      )}
      <h2 className="text-xl font-semibold mb-2">
        Sessions{" "}
        {!sessionModalOpen && (
          <button className="bg-primary rounded px-2" onClick={handleCreateSession}>
            +
          </button>
        )}
      </h2>
      <ul className="flex flex-col gap-2">
        {sessions.map((session) => (
          <li key={session.id} className="rounded-xl bg-gray-100 p-2">
            <Session session={session} />
          </li>
        ))}
      </ul>
    </div>
  );
}
