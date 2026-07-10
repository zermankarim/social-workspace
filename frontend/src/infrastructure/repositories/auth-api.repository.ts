import type { User } from "@/core/domain/entities/user.entity";
import type { AuthCredentials } from "@/core/domain/value-objects/auth-credentials.vo";
import type { SignupData } from "@/core/domain/value-objects/signup-data.vo";
import { AuthRepository } from "@/core/domain/repositories/auth.repository";
import type {
  RefreshResponseDto,
  SigninResponseDto,
  SignupResponseDto,
} from "@/infrastructure/api/dto/auth-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { UserMapper } from "@/infrastructure/mappers/user.mapper";

export class AuthApiRepository extends AuthRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async signup(data: SignupData): Promise<User> {
    const response = await this.httpClient.request<SignupResponseDto>(
      "/auth/signup",
      {
        method: "POST",
        body: {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          bio: data.bio,
          location: data.location
            ? {
                lat: data.location.lat,
                lng: data.location.lng,
                label: data.location.label,
                city: data.location.city,
                country: data.location.country,
                placeId: data.location.placeId,
              }
            : undefined,
        },
        skipRefresh: true,
      },
    );
    return UserMapper.fromApi(response.user);
  }

  async signin(credentials: AuthCredentials): Promise<User> {
    const response = await this.httpClient.request<SigninResponseDto>(
      "/auth/signin",
      {
        method: "POST",
        body: credentials,
        skipRefresh: true,
      },
    );
    return UserMapper.fromApi(response.user);
  }

  async signout(): Promise<void> {
    await this.httpClient.request<void>("/auth/signout", {
      method: "POST",
      skipRefresh: true,
    });
  }

  async refresh(): Promise<User> {
    const response = await this.httpClient.request<RefreshResponseDto>(
      "/auth/refresh",
      {
        method: "POST",
        skipRefresh: true,
      },
    );
    return UserMapper.fromApi(response.user);
  }
}
