import { Collapsible } from "@/UI/Collapsible";
import Link from "next/link";
import classes from "@/app/components/Layout/Sidebar/sidebar.module.scss";
import { Role } from "@/types/types";
import Image from "next/image";
import edoLogo from "/public/images/logo.svg";
import { AiOutlineDashboard } from "react-icons/ai";
import { ImUsers, ImCalendar, ImNewspaper } from "react-icons/im";
import { FaStore } from "react-icons/fa6";
import { getServerFetch } from "@/lib/serverFetching";
import { RestaurantType } from "@/models/Restaurant";
import { checkAdminStatus } from "@/utils/helper";
import { PiFilesFill } from "react-icons/pi";

export enum SidebarAdmin {
  admin = "admin",
}

export type SidebarType = {
  role: Role | SidebarAdmin;
};

export const Sidebar: React.FC<SidebarType> = async ({ role }) => {
  const { status, data: restaurants } = await getServerFetch(
    "/api/all-restaurants",
    { next: { tags: ["restaurants"] } }
  );

  const isAdmin = checkAdminStatus(role);

  const restaurantsList = restaurants.map((item: RestaurantType) => {
    return (
      <li key={item._id}>
        <Link href={`/admin/restaurants/${item._id}`}>{item.name}</Link>
      </li>
    );
  });
  return (
    <aside className={classes.sidebar}>
      <Image src={edoLogo} priority={true} alt="Edo Japan" />
      <nav>
        <ul>
          {isAdmin && (
            <li>
              <Link href={"/admin"}>
                <AiOutlineDashboard />
                Dashboard
              </Link>
            </li>
          )}
          {!isAdmin && (
            <li>
              <Link href={"/employee"}>
                <AiOutlineDashboard />
                Dashboard
              </Link>
            </li>
          )}
          {isAdmin && (
            <Collapsible title="Restaurants" icon={<FaStore />}>
              {status === "success" ? restaurantsList : ""}
              <li>
                <Link href={"/admin/restaurants/add-restaurant"}>Add restaurant</Link>
              </li>
            </Collapsible>
          )}
          {isAdmin && (
            <Collapsible title="Employees" icon={<ImUsers />}>
              <li>
                <Link href={"/admin/employees"}>All employees</Link>
              </li>
              <li>
                <Link href={"/admin/employees/add-employee"}>Add employee</Link>
              </li>
            </Collapsible>
          )}
          <li>
            <Link href={"/reports"}>
              <ImNewspaper />
              Reports
            </Link>
          </li>
          {!isAdmin && (
            <li>
              <Link href={"/employee/calendar"}>
                <ImCalendar />
                Calendar
              </Link>
            </li>
          )}
          <li>
            <Link href={"/requests"}>
              <PiFilesFill />
              Requests
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
