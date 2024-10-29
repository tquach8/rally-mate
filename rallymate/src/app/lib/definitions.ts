export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type PointOfInterest = { key: string, location: google.maps.LatLngLiteral };

