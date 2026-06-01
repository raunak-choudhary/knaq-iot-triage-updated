import { use } from "react";
import { AlertDetail } from "@/features/alerts/components/AlertDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AlertDetailPage({ params }: PageProps) {
  const { id } = use(params);
  return <AlertDetail id={id} />;
}
