export type AddressResult = {
  formattedAddress: string;
  lat: number;
  lng: number;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  placeId?: string;
};

export type AddressAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (address: AddressResult) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  /** ISO 3166-1 alpha-2, e.g. "us" */
  countryRestriction?: string;
};
