import type { AuthService } from "@/core/application/services/auth.service";
import type { CommentService } from "@/core/application/services/comment.service";
import type { ConnectionService } from "@/core/application/services/connection.service";
import type { ConversationService } from "@/core/application/services/conversation.service";
import type { DeviceService } from "@/core/application/services/device.service";
import type { LikeService } from "@/core/application/services/like.service";
import type { PostService } from "@/core/application/services/post.service";
import type { ProfileService } from "@/core/application/services/profile.service";
import type { UploadService } from "@/core/application/services/upload.service";
import type { UserService } from "@/core/application/services/user.service";
import { HttpClient } from "@/infrastructure/http/http-client";
import { AuthModule } from "@/modules/auth.module";
import { CommentModule } from "@/modules/comment.module";
import { ConnectionModule } from "@/modules/connection.module";
import { ConversationModule } from "@/modules/conversation.module";
import { DeviceModule } from "@/modules/device.module";
import { LikeModule } from "@/modules/like.module";
import { PostModule } from "@/modules/post.module";
import { ProfileModule } from "@/modules/profile.module";
import { UploadModule } from "@/modules/upload.module";
import { UserModule } from "@/modules/user.module";

export class AppContainer {
  private static instance: AppContainer | null = null;

  readonly httpClient: HttpClient;
  readonly authService: AuthService;
  readonly userService: UserService;
  readonly profileService: ProfileService;
  readonly uploadService: UploadService;
  readonly postService: PostService;
  readonly likeService: LikeService;
  readonly commentService: CommentService;
  readonly connectionService: ConnectionService;
  readonly conversationService: ConversationService;
  readonly deviceService: DeviceService;

  private constructor() {
    this.httpClient = new HttpClient();
    this.authService = AuthModule.create(this.httpClient);
    this.userService = UserModule.create(this.httpClient);
    this.profileService = ProfileModule.create(this.httpClient);
    this.uploadService = UploadModule.create(this.httpClient);
    this.postService = PostModule.create(this.httpClient);
    this.likeService = LikeModule.create(this.httpClient);
    this.commentService = CommentModule.create(this.httpClient);
    this.connectionService = ConnectionModule.create(this.httpClient);
    this.conversationService = ConversationModule.create(this.httpClient);
    this.deviceService = DeviceModule.create(this.httpClient);
  }

  static getInstance(): AppContainer {
    if (!AppContainer.instance) {
      AppContainer.instance = new AppContainer();
    }
    return AppContainer.instance;
  }
}

export const appContainer = AppContainer.getInstance();
