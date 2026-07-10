import type { AddressResult } from "@/presentation/components/shared/address-autocomplete/types";

type PhotonProperties = {
  osm_id?: number;
  osm_type?: string;
  name?: string;
  street?: string;
  housenumber?: string;
  city?: string;
  locality?: string;
  district?: string;
  state?: string;
  postcode?: string;
  country?: string;
  countrycode?: string;
};

type PhotonFeature = {
  geometry: {
    coordinates: [number, number];
  };
  properties: PhotonProperties;
};

type PhotonResponse = {
  features: PhotonFeature[];
};

function formatAddress(props: PhotonProperties): string {
  const street = [props.housenumber, props.street].filter(Boolean).join(" ");
  const parts = [
    street || props.name,
    props.city || props.locality || props.district,
    props.state,
    props.postcode,
    props.country,
  ].filter(Boolean);

  return [...new Set(parts)].join(", ");
}

function toAddressResult(feature: PhotonFeature): AddressResult {
  const props = feature.properties;
  const [lng, lat] = feature.geometry.coordinates;
  const streetAddress = [props.housenumber, props.street]
    .filter(Boolean)
    .join(" ");

  return {
    formattedAddress: formatAddress(props),
    lat,
    lng,
    streetAddress: streetAddress || undefined,
    city: props.city || props.locality || props.district || undefined,
    state: props.state || undefined,
    zipCode: props.postcode || undefined,
    country: props.country || undefined,
    placeId:
      props.osm_type && props.osm_id
        ? `${props.osm_type}:${props.osm_id}`
        : undefined,
  };
}

export async function searchAddresses(
  query: string,
  options?: {
    limit?: number;
    countryRestriction?: string;
    signal?: AbortSignal;
  },
): Promise<AddressResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const params = new URLSearchParams({
    q: trimmed,
    limit: String(options?.limit ?? 8),
    lang: "en",
  });

  const response = await fetch(
    `https://photon.komoot.io/api/?${params.toString()}`,
    {
      signal: options?.signal,
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Address search failed (${response.status})`);
  }

  const data = (await response.json()) as PhotonResponse;
  const country = options?.countryRestriction?.toLowerCase();
  const limit = options?.limit ?? 6;

  return (data.features ?? [])
    .filter((feature) => {
      if (!country) return true;
      return feature.properties.countrycode?.toLowerCase() === country;
    })
    .slice(0, limit)
    .map(toAddressResult);
}
