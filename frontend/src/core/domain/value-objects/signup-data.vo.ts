import type { LocationInput } from "@/core/domain/value-objects/location-input.vo";

export class SignupData {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly bio?: string,
    public readonly location?: LocationInput,
  ) {}
}
