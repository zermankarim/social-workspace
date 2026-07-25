"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  EducationInput,
  UpdateProfileInput,
  WorkExperienceInput,
} from "@/core/domain/repositories/profile.repository";
import type { LanguageProficiency } from "@/core/domain/enums/language-proficiency.enum";
import type { Skill } from "@/core/domain/entities/skill.entity";
import { UserMapper } from "@/infrastructure/mappers/user.mapper";
import { appContainer } from "@/modules/app.container";
import { useAuthStore } from "@/presentation/stores/auth.store";
import { useDebouncedValue } from "@/presentation/hooks/use-debounced-value";

export const profileQueryKey = ["profile"] as const;

function syncAuthUserFromProfile(
  profile: Awaited<ReturnType<typeof appContainer.profileService.getMe>>,
) {
  const user = UserMapper.fromProfile(profile);
  if (user) {
    useAuthStore.getState().setUser(user);
  }
}

export function useMyProfile(enabled = true) {
  return useQuery({
    queryKey: [...profileQueryKey, "me"],
    queryFn: () => appContainer.profileService.getMe(),
    enabled,
  });
}

export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: [...profileQueryKey, userId],
    queryFn: () => appContainer.profileService.getById(userId!),
    enabled: Boolean(userId),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      appContainer.profileService.updateMe(input),
    onSuccess: (profile) => {
      syncAuthUserFromProfile(profile);
      queryClient.setQueryData([...profileQueryKey, "me"], profile);
      queryClient.setQueryData([...profileQueryKey, profile.id], profile);
    },
  });
}

function invalidateProfiles(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: profileQueryKey });
}

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: WorkExperienceInput) =>
      appContainer.profileService.createExperience(input),
    onSuccess: () => invalidateProfiles(queryClient),
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; data: Partial<WorkExperienceInput> }) =>
      appContainer.profileService.updateExperience(input.id, input.data),
    onSuccess: () => invalidateProfiles(queryClient),
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      appContainer.profileService.deleteExperience(id),
    onSuccess: () => invalidateProfiles(queryClient),
  });
}

export function useCreateEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: EducationInput) =>
      appContainer.profileService.createEducation(input),
    onSuccess: () => invalidateProfiles(queryClient),
  });
}

export function useUpdateEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; data: Partial<EducationInput> }) =>
      appContainer.profileService.updateEducation(input.id, input.data),
    onSuccess: () => invalidateProfiles(queryClient),
  });
}

export function useDeleteEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appContainer.profileService.deleteEducation(id),
    onSuccess: () => invalidateProfiles(queryClient),
  });
}

export function useCreateUserLanguage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      languageId: string;
      proficiency: LanguageProficiency;
    }) =>
      appContainer.profileService.createLanguage(
        input.languageId,
        input.proficiency,
      ),
    onSuccess: () => invalidateProfiles(queryClient),
  });
}

export function useUpdateUserLanguage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; proficiency: LanguageProficiency }) =>
      appContainer.profileService.updateLanguage(input.id, input.proficiency),
    onSuccess: () => invalidateProfiles(queryClient),
  });
}

export function useDeleteUserLanguage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appContainer.profileService.deleteLanguage(id),
    onSuccess: () => invalidateProfiles(queryClient),
  });
}

export function useAddUserSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { skillId?: string; name?: string }) =>
      appContainer.profileService.addSkill(input),
    onSuccess: () => invalidateProfiles(queryClient),
  });
}

export function useRemoveUserSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (skillId: string) =>
      appContainer.profileService.removeSkill(skillId),
    onSuccess: () => invalidateProfiles(queryClient),
  });
}

export function useSyncUserSkills() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      current: Skill[];
      next: ReadonlyArray<{ skillId?: string; name: string }>;
    }) => appContainer.profileService.syncSkills(input.current, input.next),
    onSuccess: () => invalidateProfiles(queryClient),
  });
}

export function useSkillEndorsers(
  userId: string | undefined,
  skillId: string | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: ["profile", "skill-endorsers", userId, skillId],
    queryFn: () =>
      appContainer.profileService.listSkillEndorsers(userId!, skillId!),
    enabled: enabled && Boolean(userId) && Boolean(skillId),
  });
}

export function useEndorseSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { userId: string; skillId: string }) =>
      appContainer.profileService.endorseSkill(input.userId, input.skillId),
    onSuccess: (_data, variables) => {
      invalidateProfiles(queryClient);
      void queryClient.invalidateQueries({
        queryKey: [
          "profile",
          "skill-endorsers",
          variables.userId,
          variables.skillId,
        ],
      });
    },
  });
}

export function useRemoveSkillEndorsement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { userId: string; skillId: string }) =>
      appContainer.profileService.removeSkillEndorsement(
        input.userId,
        input.skillId,
      ),
    onSuccess: (_data, variables) => {
      invalidateProfiles(queryClient);
      void queryClient.invalidateQueries({
        queryKey: [
          "profile",
          "skill-endorsers",
          variables.userId,
          variables.skillId,
        ],
      });
    },
  });
}

export function useLanguageSearch(query: string, enabled = true) {
  const debounced = useDebouncedValue(query, 250);
  return useQuery({
    queryKey: ["catalog", "languages", debounced],
    queryFn: () => appContainer.profileService.searchLanguages(debounced),
    enabled: enabled && debounced.trim().length >= 1,
  });
}

export function useSkillSearch(query: string, enabled = true) {
  const debounced = useDebouncedValue(query, 250);
  return useQuery({
    queryKey: ["catalog", "skills", debounced],
    queryFn: () => appContainer.profileService.searchSkills(debounced),
    enabled: enabled && debounced.trim().length >= 1,
  });
}
