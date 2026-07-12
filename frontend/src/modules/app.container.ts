import type { AuthService } from "@/core/application/services/auth.service";
import type { CommentService } from "@/core/application/services/comment.service";
import type { LikeService } from "@/core/application/services/like.service";
import type { PostService } from "@/core/application/services/post.service";
import type { ProfileService } from "@/core/application/services/profile.service";
import type { UploadService } from "@/core/application/services/upload.service";
import type { UserService } from "@/core/application/services/user.service";
import { HttpClient } from "@/infrastructure/http/http-client";
import { AuthModule } from "@/modules/auth.module";
import { CommentModule } from "@/modules/comment.module";
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

  private constructor() {
    this.httpClient = new HttpClient();
    this.authService = AuthModule.create(this.httpClient);
    this.userService = UserModule.create(this.httpClient);
    this.profileService = ProfileModule.create(this.httpClient);
    this.uploadService = UploadModule.create(this.httpClient);
    this.postService = PostModule.create(this.httpClient);
    this.likeService = LikeModule.create(this.httpClient);
    this.commentService = CommentModule.create(this.httpClient);
  }

  static getInstance(): AppContainer {
    if (!AppContainer.instance) {
      AppContainer.instance = new AppContainer();
    }
    return AppContainer.instance;
  }
}

export const appContainer = AppContainer.getInstance();
