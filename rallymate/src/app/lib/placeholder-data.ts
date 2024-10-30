const users = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "RallyMate01",
    email: "rallymate01@test.com",
    password: "testtest",
  },
];
const schedules = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442b",
    user_id: "1",
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
    start_time: "2024-10-29T12:00:00",
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
