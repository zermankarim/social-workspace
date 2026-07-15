import { ConversationService } from "@/core/application/services/conversation.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { ConversationApiRepository } from "@/infrastructure/repositories/conversation-api.repository";

export class ConversationModule {
  static create(httpClient: HttpClient): ConversationService {
    return new ConversationService(new ConversationApiRepository(httpClient));
  }
}
