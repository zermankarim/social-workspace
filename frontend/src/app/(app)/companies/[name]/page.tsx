"use client";

import { useParams } from "next/navigation";
import { CompanyPage } from "@/presentation/components/companies/company-page";

export default function CompanyRoutePage() {
  const params = useParams<{ name: string }>();
  const name = typeof params.name === "string" ? params.name : "";

  return <CompanyPage name={name} />;
}
