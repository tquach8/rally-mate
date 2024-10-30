const users = [
  {
    id: 1,
    name: "Tan Quach",
    email: "rm1@test.com",
    password: "testtest",
  },
  {
    id: 2,
    name: "Karen Zhang",
    email: "rm2@test.com",
    password: "testtest",
  },
  {
    id: 3,
    name: "Emilio Alvarez",
    email: "rm3@test.com",
    password: "testtest",
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
];
const courtSessionPlayers = [
  {
    court_session_id: 1,
    user_id: 1,
  }
];

export { users, schedules, courts, courtSessions, courtSessionPlayers };
