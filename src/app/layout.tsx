import "./globals.css";
import { Roboto } from "next/font/google";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import Provider from "@/app/context/client-provider";
import { Theme, ToastContainer, ToastPosition } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const roboto = Roboto({
  weight: ['400', '500', '700', '900', '300', '100'],
  style: ['normal', 'italic'],
  variable: '--font-roboto',
  subsets: ['latin'],
  display: 'swap',
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const toastContainerOptions = {
    autoClose: 800,
    hideProgressBar: true,
    newestOnTop: true,
    closeOnClick:true,
    rtl: false,
    pauseOnFocusLoss:true,
    draggable: true,
    pauseOnHover:true,
    position: "top-center" as ToastPosition,
    theme: "colored" as Theme
  }

  return (

    <html lang="en">
      <body className={roboto.className}>
        <Provider session={session}>{children}</Provider>
        <ToastContainer {...toastContainerOptions} />
      </body>
    </html>
  );
}
