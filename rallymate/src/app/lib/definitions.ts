export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Schedule = {
  id: string;
  user_id: string;
  availability_time: string
}
