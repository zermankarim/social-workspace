import type { Attachment } from "@/core/domain/entities/attachment.entity";

export class Todo {
  constructor(
    public readonly id: string,
    public readonly text: string,
    public readonly completed: boolean,
    public readonly attachments: Attachment[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  toggleCompleted(): Todo {
    return new Todo(
      this.id,
      this.text,
      !this.completed,
      this.attachments,
      this.createdAt,
      this.updatedAt,
    );
  }

  withText(text: string): Todo {
    return new Todo(
      this.id,
      text,
      this.completed,
      this.attachments,
      this.createdAt,
      this.updatedAt,
    );
  }
}
