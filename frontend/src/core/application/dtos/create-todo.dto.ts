import type { CreateTodoAttachmentDto } from "@/core/application/dtos/create-todo-attachment.dto";

export class CreateTodoDto {
  constructor(
    public readonly text: string,
    public readonly attachments?: CreateTodoAttachmentDto[],
  ) {}
}
