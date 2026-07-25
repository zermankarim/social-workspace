"use client";

import { useState } from "react";
import {
  AlertCircle,
  Briefcase,
  Globe,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { AddCompanyAdminDialog } from "@/presentation/components/companies/add-company-admin-dialog";
import { UpdateCompanyDialog } from "@/presentation/components/companies/update-company-dialog";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import {
  useAddCompanyService,
  useCompany,
  useFollowCompany,
  useRemoveCompanyAdmin,
  useRemoveCompanyService,
  useUnfollowCompany,
} from "@/presentation/hooks/use-company";
import { useJobsFeed } from "@/presentation/hooks/use-jobs";
import { useAuthStore } from "@/presentation/stores/auth.store";

type CompanyPageProps = {
  name: string;
};

function AddServiceForm({
  companyId,
  companyName,
}: {
  companyId: string;
  companyName: string;
}) {
  const t = useTranslations("companies");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const addService = useAddCompanyService();

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
        {t("addService")}
      </button>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <Input
        label={t("serviceName")}
        hideLabel
        placeholder={t("serviceName")}
        value={name}
        onChange={(event) => setName(event.target.value)}
        maxLength={150}
        disabled={addService.isPending}
      />
      <Button
        type="button"
        className="shrink-0 text-xs"
        disabled={!name.trim() || addService.isPending}
        onClick={() => {
          addService.mutate(
            { companyId, name: name.trim(), companyName },
            { onSuccess: () => setName("") },
          );
        }}
      >
        {addService.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          t("add")
        )}
      </Button>
    </div>
  );
}

export function CompanyPage({ name }: CompanyPageProps) {
  const t = useTranslations("companies");
  const user = useAuthStore((state) => state.user);
  const companyQuery = useCompany(name);
  const company = companyQuery.data;
  const removeService = useRemoveCompanyService();
  const removeAdmin = useRemoveCompanyAdmin();
  const followCompany = useFollowCompany();
  const unfollowCompany = useUnfollowCompany();
  const [editOpen, setEditOpen] = useState(false);
  const [addAdminOpen, setAddAdminOpen] = useState(false);

  const jobsQuery = useJobsFeed({ companyId: company?.id }, 5);

  if (companyQuery.isLoading) {
    return (
      <FeedCard className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
      </FeedCard>
    );
  }

  if (companyQuery.error || !company) {
    return (
      <FeedCard className="px-4 py-8 text-center">
        <p className="inline-flex items-center gap-2 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {companyQuery.error instanceof ApiError
            ? companyQuery.error.message
            : t("loadFailed")}
        </p>
      </FeedCard>
    );
  }

  const jobs = jobsQuery.data?.pages[0]?.data ?? [];

  return (
    <div className="mx-auto max-w-[720px] space-y-2">
      <FeedCard className="overflow-hidden">
        <div
          className="h-28 bg-gradient-to-r from-primary to-primary-hover bg-cover bg-center"
          style={
            company.coverUrl
              ? { backgroundImage: `url(${company.coverUrl})` }
              : undefined
          }
        />
        <div className="px-4 pb-4">
          <div className="-mt-8 flex items-end justify-between">
            {company.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.logoUrl}
                alt=""
                className="h-16 w-16 rounded-lg border-2 border-surface object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-surface bg-primary-soft text-lg font-semibold text-primary">
                {company.initials}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={company.isViewerFollowing ? "secondary" : "primary"}
                className="text-xs"
                disabled={followCompany.isPending || unfollowCompany.isPending}
                onClick={() =>
                  company.isViewerFollowing
                    ? unfollowCompany.mutate({
                        companyId: company.id,
                        companyName: company.name,
                      })
                    : followCompany.mutate({
                        companyId: company.id,
                        companyName: company.name,
                      })
                }
              >
                {company.isViewerFollowing ? t("following") : t("follow")}
              </Button>
              {company.isViewerAdmin ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="gap-1.5 text-xs"
                  onClick={() => setEditOpen(true)}
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                  {t("editCompany")}
                </Button>
              ) : null}
            </div>
          </div>

          <h1 className="mt-2 text-lg font-semibold text-foreground">
            {company.name}
          </h1>
          {company.tagline ? (
            <p className="text-sm text-muted">{company.tagline}</p>
          ) : null}

          <p className="mt-1 flex flex-wrap gap-x-1.5 text-xs text-muted">
            {company.industry ? <span>{company.industry}</span> : null}
            {company.size ? (
              <span>· {t(`sizeValue.${company.size}`)}</span>
            ) : null}
            {company.foundedYear ? (
              <span>· {t("founded", { year: company.foundedYear })}</span>
            ) : null}
            {company.headquarters ? (
              <span>· {company.headquarters}</span>
            ) : null}
          </p>

          {company.websiteUrl ? (
            <a
              href={company.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Globe className="h-3.5 w-3.5" aria-hidden />
              {company.websiteUrl}
            </a>
          ) : null}

          <p className="mt-2 text-sm text-muted">
            {t("followersCount", { count: company.followersCount })}
            {" · "}
            {t("employeesCount", { count: company.employeesCount })}
            {" · "}
            {t("currentEmployeesCount", {
              count: company.currentEmployeesCount,
            })}
            {" · "}
            {t("jobsCount", { count: company.jobsCount })}
          </p>
        </div>
      </FeedCard>

      {company.description ? (
        <FeedCard className="px-4 py-4">
          <h2 className="text-sm font-semibold text-foreground">
            {t("about")}
          </h2>
          <p className="mt-1.5 whitespace-pre-wrap text-sm text-foreground">
            {company.description}
          </p>
        </FeedCard>
      ) : null}

      <FeedCard className="px-4 py-4">
        <h2 className="text-sm font-semibold text-foreground">
          {t("services")}
        </h2>
        {company.services.length === 0 && !company.isViewerAdmin ? (
          <p className="mt-1.5 text-sm text-muted">{t("noServices")}</p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-2">
            {company.services.map((service) => (
              <li
                key={service.id}
                className="flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1.5 text-sm text-foreground"
                title={service.description ?? undefined}
              >
                {service.name}
                {company.isViewerAdmin ? (
                  <button
                    type="button"
                    onClick={() =>
                      removeService.mutate({
                        companyId: company.id,
                        serviceId: service.id,
                        companyName: company.name,
                      })
                    }
                    aria-label={t("removeService")}
                    className="text-muted hover:text-danger"
                  >
                    <Trash2 className="h-3 w-3" aria-hidden />
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        {company.isViewerAdmin ? (
          <AddServiceForm companyId={company.id} companyName={company.name} />
        ) : null}
      </FeedCard>

      <FeedCard className="px-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Briefcase className="h-4 w-4 text-primary" aria-hidden />
            {t("openJobs")}
          </h2>
          <Link
            href={`/jobs?companyId=${company.id}`}
            className="text-xs font-medium text-primary hover:underline"
          >
            {t("viewAllJobs")}
          </Link>
        </div>
        {jobs.length === 0 ? (
          <p className="mt-1.5 text-sm text-muted">{t("noOpenJobs")}</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {jobs.map((job) => (
              <li key={job.id}>
                <Link
                  href="/jobs"
                  className="block rounded-lg border border-border px-3 py-2 hover:bg-surface-muted"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {job.title}
                  </p>
                  {job.location ? (
                    <p className="text-xs text-muted">{job.location}</p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {user && company.isViewerAdmin ? (
          <p className="mt-2 text-xs text-muted">{t("postJobHint")}</p>
        ) : null}
      </FeedCard>

      {company.isViewerAdmin ? (
        <FeedCard className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              {t("admins")}
            </h2>
            <button
              type="button"
              onClick={() => setAddAdminOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <UserPlus className="h-3.5 w-3.5" aria-hidden />
              {t("addAdmin")}
            </button>
          </div>
          <ul className="mt-2 space-y-2">
            {company.admins.map((admin) => (
              <li
                key={admin.userId}
                className="flex items-center gap-2 rounded-lg px-1 py-1"
              >
                {admin.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={admin.avatarUrl}
                    alt=""
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                    {admin.initials}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">
                    {admin.displayName}
                  </p>
                  <p className="text-xs text-muted">
                    {t(`adminRole.${admin.role}`)}
                  </p>
                </div>
                {user && admin.userId !== user.id ? (
                  <button
                    type="button"
                    onClick={() =>
                      removeAdmin.mutate({
                        companyId: company.id,
                        userId: admin.userId,
                        companyName: company.name,
                      })
                    }
                    aria-label={t("removeAdmin")}
                    className="shrink-0 rounded-full p-1.5 text-muted hover:bg-surface-muted hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </FeedCard>
      ) : null}

      <FeedCard className="overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 pt-4">
          <Users className="h-4 w-4 text-primary" aria-hidden />
          <h2 className="text-sm font-semibold text-foreground">
            {t("employees")}
          </h2>
        </div>
        {company.employees.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">
            {t("noEmployees")}
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-border">
            {company.employees.map((employee) => (
              <li key={employee.id}>
                <Link
                  href={`/users/${employee.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface-muted"
                >
                  {employee.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={employee.avatarUrl}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
                      {employee.initials}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {employee.displayName}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {employee.title}
                      {employee.isCurrent
                        ? ` · ${t("current")}`
                        : ` · ${t("past")}`}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </FeedCard>

      {editOpen ? (
        <UpdateCompanyDialog
          company={company}
          onClose={() => setEditOpen(false)}
        />
      ) : null}
      {addAdminOpen ? (
        <AddCompanyAdminDialog
          companyId={company.id}
          companyName={company.name}
          onClose={() => setAddAdminOpen(false)}
        />
      ) : null}
    </div>
  );
}
