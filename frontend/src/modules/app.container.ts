import type { AuthService } from "@/core/application/services/auth.service";
import type { UploadService } from "@/core/application/services/upload.service";
import type { UserService } from "@/core/application/services/user.service";
import { HttpClient } from "@/infrastructure/http/http-client";
import { AuthModule } from "@/modules/auth.module";
import { UploadModule } from "@/modules/upload.module";
import { UserModule } from "@/modules/user.module";

export class AppContainer {
  private static instance: AppContainer | null = null;

  readonly httpClient: HttpClient;
  readonly authService: AuthService;
  readonly userService: UserService;
  readonly uploadService: UploadService;

  private constructor() {
    this.httpClient = new HttpClient();
    this.authService = AuthModule.create(this.httpClient);
    this.userService = UserModule.create(this.httpClient);
    this.uploadService = UploadModule.create(this.httpClient);
  }

  static getInstance(): AppContainer {
    if (!AppContainer.instance) {
      AppContainer.instance = new AppContainer();
    }
    return AppContainer.instance;
  }
}

export const appContainer = AppContainer.getInstance();
