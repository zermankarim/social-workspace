"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appContainer } from "@/modules/app.container";

export const resumesQueryKey = ["resumes", "me"] as const;

export function useMyResumes(enabled = true) {
  return useQuery({
    queryKey: resumesQueryKey,
    queryFn: () => appContainer.resumeService.listMine(),
    enabled,
  });
}

/** Uploads the file to storage, then registers it as one of the user's up-to-3 resumes. */
export function useUploadResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const uploaded = await appContainer.uploadService.uploadResume(file);
      return appContainer.resumeService.create({
        fileName: uploaded.fileName,
        fileUrl: uploaded.url,
        sizeBytes: uploaded.sizeBytes,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumesQueryKey });
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appContainer.resumeService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: resumesQueryKey });
    },
  });
}
