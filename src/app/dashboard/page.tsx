import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Redirect to the correct dashboard based on user type
  const userType = session.user.userType;

  if (userType === "CLIENT") redirect("/dashboard/client");
  if (userType === "SERVICE_PROVIDER") redirect("/dashboard/provider");
  if (userType === "POTENTIAL_PROVIDER") redirect("/dashboard/potential");
  if (userType === "ADMIN") redirect("/dashboard/admin");
  if (userType === "SUPER_ADMIN") redirect("/dashboard/super-admin");

  redirect("/login");
}