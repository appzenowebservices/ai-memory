import { Metadata } from "next";
import { DashboardClientLayout } from "./dashboard-client-layout";

export const metadata: Metadata = {
  title: "Dashboard | AI Memory",
  description: "AI Memory Dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
