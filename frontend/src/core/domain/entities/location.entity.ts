export class Location {
  constructor(
    public readonly id: string,
    public readonly lat: number,
    public readonly lng: number,
    public readonly label: string | null,
    public readonly city: string | null,
    public readonly country: string | null,
    public readonly placeId: string | null,
  ) {}
}
