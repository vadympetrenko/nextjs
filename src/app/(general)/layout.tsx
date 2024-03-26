import classes from "@/app/admin/admin.module.scss";
import { Sidebar } from "@/app/components/Layout/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { Header } from "@/app/components/Layout/Header";
import { checkAdminStatus } from "@/utils/helper";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {  
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
