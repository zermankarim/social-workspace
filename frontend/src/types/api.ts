export type ProfileRole = "ADMIN" | "USER";

export interface User {
  id: string;
  email: string;
  role: ProfileRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupResponse {
  user: User;
}

export interface SigninResponse {
  message: string;
  user: User;
}

export interface SignoutResponse {
  message: string;
}

export interface RefreshResponse {
  message: string;
  user: User;
}

export interface UserByIdResponse {
  user: User;
}

export interface ApiErrorBody {
  message?: string | string[];
  statusCode?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
