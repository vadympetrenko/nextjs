import type { Metadata } from "next";
import classes from "@/app/admin/admin.module.scss";
import { Sidebar } from "@/app/components/Layout/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { Header } from "@/app/components/Layout/Header";
import { getServerFetch } from "@/lib/serverFetching";
import { checkAdminStatus } from "@/utils/helper";
import { RequestType } from "@/models/Request";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard description",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}){  
  const session = await getServerSession(authOptions);
  const isAdmin = checkAdminStatus(session?.role);

  return (
    <main className={classes.mainWrapper}>
      <Sidebar role={session?.role} />
      <div className={classes.main}>
        <Header isAdmin={isAdmin} />
        <div className={classes.content}>
          {children}
          </div>
      </div>
    </main>
  );
}

