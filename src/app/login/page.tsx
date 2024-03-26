import { Metadata } from "next";
import { SignIn } from "@/app/components/SignIn";

export const metadata: Metadata = {
  title: "Login Page",
};

export default function Page() {
  return <SignIn />;
}
