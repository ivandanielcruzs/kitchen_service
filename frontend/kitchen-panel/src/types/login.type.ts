export interface LoginType {
  access_token: string;
}

export type LoginForm = {
  username: string;
  password: string;
};

export type UserInformation = {
  username: string;
  role: string;
}
