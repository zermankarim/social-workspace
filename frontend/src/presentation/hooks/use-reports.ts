"use client";

import { useMutation } from "@tanstack/react-query";
import type { ReportTargetType } from "@/core/domain/enums/report-target-type.enum";
import { appContainer } from "@/modules/app.container";

export function useCreateReport() {
  return useMutation({
    mutationFn: ({
      targetType,
      targetId,
      reason,
    }: {
      targetType: ReportTargetType;
      targetId: string;
      reason: string;
    }) => appContainer.reportService.create(targetType, targetId, reason),
  });
}
