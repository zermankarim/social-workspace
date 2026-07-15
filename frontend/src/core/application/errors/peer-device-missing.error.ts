export class PeerDeviceMissingError extends Error {
  readonly code = "PEER_DEVICE_MISSING" as const;

  constructor() {
    super("PEER_DEVICE_MISSING");
    this.name = "PeerDeviceMissingError";
  }
}

export function isPeerDeviceMissingError(
  error: unknown,
): error is PeerDeviceMissingError {
  return error instanceof PeerDeviceMissingError;
}
