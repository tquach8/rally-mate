const users = [
  {
    id: 1,
    name: "Novak Djokovic",
    email: "rm1@test.com",
    password: "testtest",
    profile_url: "/profile1.jpeg",
  },
  {
    id: 2,
    name: "Rafael Nadal",
    email: "rm2@test.com",
    password: "testtest",
    profile_url: "/profile2.jpeg",
  },
  {
    id: 3,
    name: "Roger Federer",
    email: "rm3@test.com",
    password: "testtest",
    profile_url: "/profile3.jpeg",
  },
  {
    id: 4,
    name: "Neel Parikh",
    email: "neel.p@test.com",
    password: "testtest",
    profile_url: "/profile4.jpeg",
  },
  {
    id: 5,
    name: "Tan Quach",
    email: "tan.q@test.com",
    password: "testtest",
    profile_url: "/profile5.jpeg",
  },
  {
    id: 6,
    name: "Emilio Alvarez",
    email: "emilio.a@test.com",
    password: "testtest",
    profile_url: "/profile6.jpeg",
  },
  {
    id: 7,
    name: "Karen Zhang",
    email: "karen.z@test.com",
    password: "testtest",
    profile_url: "/profile7.jpeg",
  },
];
const schedules = [
  {
    id: 1,
    user_id: 1,
    availability_time: "2024-10-29",
  },
];
const courts = [
  {
    id: 1,
    name: "calgary-thornhill",
    display_name: "Thornhill Tennis/Pickleball Courts",
    location: { lat: 51.111839820880064, lng: -114.0650242969602},
    number_of_courts: 5,
    image_url: "/ThorncliffeTennis.jpeg",
  }
]
const courtSessions = [
  {
    id: 1,
    user_id: 1,
    court_id: 1,
    start_time: "2024-10-31T12:00:00",
    number_of_hours: 2,
    max_players: 4,
    type: 0,
  },
  {
    id: 2,
    user_id: 4,
    court_id: 1,
    start_time: "2024-11-01T00:00:00",
    number_of_hours: 2,
    max_players: 4,
    type: 2,
  },
];
const courtSessionPlayers = [
  {
    court_session_id: 1,
    user_id: 1,
  },
  {
    court_session_id: 1,
    user_id: 2,
  },
  {
    court_session_id: 1,
    user_id: 3,
  },
  {
    court_session_id: 2,
    user_id: 4,
  },
  {
    court_session_id: 2,
    user_id: 5,
  },
  {
    court_session_id: 2,
    user_id: 6,
  },
  {
    court_session_id: 2,
    user_id: 7,
  },
];

export { users, schedules, courts, courtSessions, courtSessionPlayers };
