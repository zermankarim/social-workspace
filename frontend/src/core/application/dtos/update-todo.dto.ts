export class UpdateTodoDto {
  constructor(
    public readonly text?: string,
    public readonly completed?: boolean,
  ) {}
}
