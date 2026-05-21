import { redirect } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { getServerSession } from "@/lib/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  return <AdminShell user={session.user}>{children}</AdminShell>;
}
