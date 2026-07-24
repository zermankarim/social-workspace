import { CompanyService } from "@/core/application/services/company.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { CompanyApiRepository } from "@/infrastructure/repositories/company-api.repository";

export class CompanyModule {
  static create(httpClient: HttpClient): CompanyService {
    return new CompanyService(new CompanyApiRepository(httpClient));
  }
}
