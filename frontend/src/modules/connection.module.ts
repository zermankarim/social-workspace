import { ConnectionService } from "@/core/application/services/connection.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { ConnectionApiRepository } from "@/infrastructure/repositories/connection-api.repository";

export class ConnectionModule {
  static create(httpClient: HttpClient): ConnectionService {
    return new ConnectionService(new ConnectionApiRepository(httpClient));
  }
}
