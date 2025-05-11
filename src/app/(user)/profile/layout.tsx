import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    // Not signed in → send to sign-in page
    redirect("/api/auth/signin");
  }
  return <>{children}</>;
}
