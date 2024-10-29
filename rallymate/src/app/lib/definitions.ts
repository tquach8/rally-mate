export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Court = { id: number, name: string, display_name: string, location: google.maps.LatLngLiteral, number_of_courts: number };

export type Schedule = {
  id: string;
  user_id: string;
  availability_time: string
}
