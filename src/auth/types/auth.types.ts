export interface UserType {
  _id: any;
  name: string;
  email: string;
}
export interface AuthResponse {
  message: string;
  token: string;
  user: UserType;
}
