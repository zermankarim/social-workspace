import { LocationResponseDto } from '../dto/location.dto';
import { Location } from '@prisma/client';

export class LocationMapper {
  static fromPrismaToResponse(location: Location): LocationResponseDto {
    return {
      id: location.id,
      lat: location.lat,
      lng: location.lng,
      label: location.label,
      city: location.city,
      country: location.country,
      placeId: location.placeId,
    };
  }
}
