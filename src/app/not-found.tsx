import type { Metadata } from "next";
import { NotFound } from "@/components/layout/NotFound";

export const metadata: Metadata = {
  title: "Page Not Found — Events",
  description: "The page you are looking for could not be found.",
};

export default function NotFoundPage() {
  return <NotFound />;
}
