export interface LocationResponseDto {
  id: string;
  lat: number;
  lng: number;
  label: string | null;
  city: string | null;
  country: string | null;
  placeId: string | null;
}

export interface UserResponseDto {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  headline?: string | null;
  bio: string | null;
  location: LocationResponseDto | null;
  avatarUrl: string | null;
  coverUrl?: string | null;
  preferredLocale?: string; // PreferredLocale en|ru from API
  github: string | null;
  linkedin: string | null;
  website: string | null;
  twitter: string | null;
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
