export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Court = { id: number, name: string, display_name: string, location: google.maps.LatLngLiteral, number_of_courts: number };

export type CourtSession = { id: number, users: User[], court: Court, start_time: Date, number_of_hours: number, max_players: number, type: number };

export type SessionPayload = {
  userId: string;
  email: string;
}

export type Schedule = {
  id: string;
  user_id: string;
  availability_time: string
}
