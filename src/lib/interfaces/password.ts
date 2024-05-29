export interface Password {
  id: string;
  url: string;
  username: string;
  password: string;
  note: string;
  userId: string;
}

export interface InsertPassword {
  url: string;
  username: string;
  password: string;
  note: string;
  user_id: string;
}
