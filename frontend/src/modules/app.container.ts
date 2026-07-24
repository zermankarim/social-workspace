import type { AuthService } from "@/core/application/services/auth.service";
import type { CommentService } from "@/core/application/services/comment.service";
import type { CompanyService } from "@/core/application/services/company.service";
import type { ConnectionService } from "@/core/application/services/connection.service";
import type { ConversationService } from "@/core/application/services/conversation.service";
import type { DeviceService } from "@/core/application/services/device.service";
import type { FollowService } from "@/core/application/services/follow.service";
import type { GamificationService } from "@/core/application/services/gamification.service";
import type { HashtagService } from "@/core/application/services/hashtag.service";
import type { JobService } from "@/core/application/services/job.service";
import type { LikeService } from "@/core/application/services/like.service";
import type { NewsService } from "@/core/application/services/news.service";
import type { NotificationService } from "@/core/application/services/notification.service";
import type { PostService } from "@/core/application/services/post.service";
import type { ProfileService } from "@/core/application/services/profile.service";
import type { ProfileViewService } from "@/core/application/services/profile-view.service";
import type { ReportService } from "@/core/application/services/report.service";
import type { UploadService } from "@/core/application/services/upload.service";
import type { UserService } from "@/core/application/services/user.service";
import { HttpClient } from "@/infrastructure/http/http-client";
import { AuthModule } from "@/modules/auth.module";
import { CommentModule } from "@/modules/comment.module";
import { CompanyModule } from "@/modules/company.module";
import { ConnectionModule } from "@/modules/connection.module";
import { ConversationModule } from "@/modules/conversation.module";
import { DeviceModule } from "@/modules/device.module";
import { FollowModule } from "@/modules/follow.module";
import { GamificationModule } from "@/modules/gamification.module";
import { HashtagModule } from "@/modules/hashtag.module";
import { JobModule } from "@/modules/job.module";
import { LikeModule } from "@/modules/like.module";
import { NewsModule } from "@/modules/news.module";
import { NotificationModule } from "@/modules/notification.module";
import { PostModule } from "@/modules/post.module";
import { ProfileModule } from "@/modules/profile.module";
import { ProfileViewModule } from "@/modules/profile-view.module";
import { ReportModule } from "@/modules/report.module";
import { UploadModule } from "@/modules/upload.module";
import { UserModule } from "@/modules/user.module";

export class AppContainer {
  private static instance: AppContainer | null = null;

  readonly httpClient: HttpClient;
  readonly authService: AuthService;
  readonly userService: UserService;
  readonly profileService: ProfileService;
  readonly profileViewService: ProfileViewService;
  readonly uploadService: UploadService;
  readonly postService: PostService;
  readonly likeService: LikeService;
  readonly commentService: CommentService;
  readonly companyService: CompanyService;
  readonly connectionService: ConnectionService;
  readonly conversationService: ConversationService;
  readonly deviceService: DeviceService;
  readonly followService: FollowService;
  readonly gamificationService: GamificationService;
  readonly hashtagService: HashtagService;
  readonly jobService: JobService;
  readonly notificationService: NotificationService;
  readonly newsService: NewsService;
  readonly reportService: ReportService;

  private constructor() {
    this.httpClient = new HttpClient();
    this.authService = AuthModule.create(this.httpClient);
    this.userService = UserModule.create(this.httpClient);
    this.profileService = ProfileModule.create(this.httpClient);
    this.profileViewService = ProfileViewModule.create(this.httpClient);
    this.uploadService = UploadModule.create(this.httpClient);
    this.postService = PostModule.create(this.httpClient);
    this.likeService = LikeModule.create(this.httpClient);
    this.commentService = CommentModule.create(this.httpClient);
    this.companyService = CompanyModule.create(this.httpClient);
    this.connectionService = ConnectionModule.create(this.httpClient);
    this.conversationService = ConversationModule.create(this.httpClient);
    this.deviceService = DeviceModule.create(this.httpClient);
    this.followService = FollowModule.create(this.httpClient);
    this.gamificationService = GamificationModule.create(this.httpClient);
    this.hashtagService = HashtagModule.create(this.httpClient);
    this.jobService = JobModule.create(this.httpClient);
    this.notificationService = NotificationModule.create(this.httpClient);
    this.newsService = NewsModule.create(this.httpClient);
    this.reportService = ReportModule.create(this.httpClient);
  }

  static getInstance(): AppContainer {
    if (!AppContainer.instance) {
      AppContainer.instance = new AppContainer();
    }
    return AppContainer.instance;
  }
}

export const appContainer = AppContainer.getInstance();
