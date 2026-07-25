"use client";

import { useParams } from "next/navigation";
import { CompanyPage } from "@/presentation/components/companies/company-page";

export default function CompanyRoutePage() {
  const params = useParams<{ name: string }>();
  const rawName = typeof params.name === "string" ? params.name : "";
  // Next.js route params keep the raw (percent-encoded) URL segment — decode
  // once here so callers always work with the plain name; findByName()
  // re-encodes exactly once when building the request URL.
  const name = decodeURIComponent(rawName);

  return <CompanyPage name={name} />;
}
