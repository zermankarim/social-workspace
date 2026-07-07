export interface UserResponseDto {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignupResponseDto {
  user: UserResponseDto;
}

export interface SigninResponseDto {
  message: string;
  user: UserResponseDto;
}

export interface RefreshResponseDto {
  message: string;
  user: UserResponseDto;
}

export interface UserByIdResponseDto {
  user: UserResponseDto;
}
