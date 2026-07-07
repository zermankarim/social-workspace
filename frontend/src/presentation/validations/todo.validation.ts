import { z } from "zod";

export const createTodoSchema = z.object({
  text: z.string().trim().min(1, "Enter todo text"),
});

export type CreateTodoFormValues = z.infer<typeof createTodoSchema>;

export const updateTodoTextSchema = z.object({
  text: z.string().trim().min(1, "Todo text cannot be empty"),
});

export type UpdateTodoTextFormValues = z.infer<typeof updateTodoTextSchema>;
