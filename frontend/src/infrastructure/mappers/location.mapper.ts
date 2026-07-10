import { Location } from "@/core/domain/entities/location.entity";
import type { LocationResponseDto } from "@/infrastructure/api/dto/auth-response.dto";

export class LocationMapper {
  static fromApi(dto: LocationResponseDto): Location {
    return new Location(
      dto.id,
      dto.lat,
      dto.lng,
      dto.label,
      dto.city,
      dto.country,
      dto.placeId,
    );
  }
}
