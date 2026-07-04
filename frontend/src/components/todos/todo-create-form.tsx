"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateTodo } from "@/hooks/use-todos";
import { uploadApi } from "@/lib/api/upload";
import {
  createTodoSchema,
  type CreateTodoFormValues,
} from "@/lib/validations/todo";
import { ApiError } from "@/types/api";

export function TodoCreateForm() {
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
      const attachments =
        files.length > 0
          ? await Promise.all(files.map((file) => uploadApi.upload(file)))
          : undefined;

      await createTodo.mutateAsync({
        text: values.text,
        attachments,
      });

      reset();
      setFiles([]);
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
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <Input
            label="New todo"
            placeholder="What needs to be done?"
            error={errors.text?.message}
            disabled={isBusy}
            {...register("text")}
          />
        </div>
        <Button
          type="submit"
          disabled={isBusy}
          className="sm:mt-6 sm:shrink-0"
        >
          {isUploading
            ? "Uploading…"
            : createTodo.isPending
              ? "Adding…"
              : "Add"}
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700" htmlFor="todo-files">
          Attach images
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
          className="block w-full text-sm text-zinc-600 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200"
        />
        {files.length > 0 ? (
          <p className="text-sm text-zinc-500">
            {files.length} file{files.length === 1 ? "" : "s"} selected
          </p>
        ) : null}
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : null}
    </form>
  );
}
