export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Court = { key: string, location: google.maps.LatLngLiteral };

export type Schedule = {
  id: string;
  user_id: string;
  availability_time: string
}
