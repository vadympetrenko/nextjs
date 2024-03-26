import type { Metadata } from "next";
import classes from "@/app/admin/admin.module.scss";
import { Sidebar } from "@/app/components/Layout/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { Header } from "@/app/components/Layout/Header";
import "react-big-calendar/lib/css/react-big-calendar.css"
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard description",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  return (
    <main className={classes.mainWrapper}>
      <Sidebar role={session?.role} />
      <div className={classes.main}>
        <Header  isAdmin={true} />
        <div className={classes.content}>
          {children}
          </div>
      </div>
    </main>
  );
}
