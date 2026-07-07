"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/core/application/errors/api.error";
import { CreateTodoAttachmentDto } from "@/core/application/dtos/create-todo-attachment.dto";
import { appContainer } from "@/modules/app.container";
import { Button } from "@/presentation/components/ui/button";
import { useCreateTodo } from "@/presentation/hooks/use-todos";
import {
  createTodoSchema,
  type CreateTodoFormValues,
} from "@/presentation/validations/todo.validation";

interface TodoCreateFormProps {
  onCreated?: () => void;
}

const fieldClassName =
  "h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400";

export function TodoCreateForm({ onCreated }: TodoCreateFormProps) {
  const createTodo = useCreateTodo();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTodoFormValues>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: { text: "" },
  });

  const isBusy = createTodo.isPending || isUploading;

  const onSubmit = handleSubmit(async (values) => {
    setUploadError(null);

    try {
      setIsUploading(true);
      const uploaded =
        files.length > 0
          ? await appContainer.uploadService.uploadMany(files)
          : [];

      const attachments = uploaded.map(
        (file) =>
          new CreateTodoAttachmentDto(
            file.url,
            file.fileName,
            file.mimeType,
            file.sizeBytes,
          ),
      );

      await createTodo.mutateAsync({
        text: values.text,
        attachments:
          attachments.length > 0
            ? attachments.map((attachment) => ({
                url: attachment.url,
                fileName: attachment.fileName,
                mimeType: attachment.mimeType,
                sizeBytes: attachment.sizeBytes,
              }))
            : undefined,
      });

      reset();
      setFiles([]);
      onCreated?.();
    } catch (error) {
      setUploadError(
        error instanceof ApiError ? error.message : "Failed to create todo",
      );
    } finally {
      setIsUploading(false);
    }
  });

  const mutationError =
    createTodo.error instanceof ApiError ? createTodo.error.message : null;
  const errorMessage = uploadError ?? mutationError;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="new-task-text"
          className="block text-sm font-medium text-zinc-700"
        >
          New task
        </label>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <div className="min-w-0 flex-1 space-y-1">
            <input
              id="new-task-text"
              type="text"
              autoComplete="off"
              placeholder="What needs to be done?"
              disabled={isBusy}
              className={`${fieldClassName} ${errors.text ? "border-red-400 focus:ring-red-100" : ""}`}
              {...register("text")}
            />
            {errors.text?.message ? (
              <p className="text-xs text-red-600">{errors.text.message}</p>
            ) : null}
          </div>

          <Button
            type="submit"
            disabled={isBusy}
            className="h-10 w-full shrink-0 sm:w-auto sm:min-w-[7.5rem]"
          >
            {isUploading
              ? "Uploading…"
              : createTodo.isPending
                ? "Adding…"
                : "Add task"}
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3">
        <label
          htmlFor="todo-files"
          className="block text-sm font-medium text-zinc-700"
        >
          Attach images
          <span className="ml-1 font-normal text-zinc-400">(optional)</span>
        </label>
        <input
          id="todo-files"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          disabled={isBusy}
          onChange={(event) => {
            setUploadError(null);
            setFiles(Array.from(event.target.files ?? []));
          }}
          className="mt-2 block w-full text-sm text-zinc-600 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-100"
        />
        {files.length > 0 ? (
          <p className="mt-2 text-xs text-zinc-500">
            {files.length} file{files.length === 1 ? "" : "s"} selected
          </p>
        ) : null}
      </div>

      {errorMessage ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
