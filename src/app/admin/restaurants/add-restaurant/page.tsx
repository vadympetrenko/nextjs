import { AddRestaurant } from "@/app/components/Restaurant/AddRestaurant";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Restaurant",
};

export default function Page() {
  return <AddRestaurant />;
}
