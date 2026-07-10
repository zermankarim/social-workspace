export class LocationInput {
  constructor(
    public readonly lat: number,
    public readonly lng: number,
    public readonly label?: string,
    public readonly city?: string,
    public readonly country?: string,
    public readonly placeId?: string,
  ) {}
}
