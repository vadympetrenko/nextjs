"use client";
import { Button } from "@/UI/Button";
import classes from "@/app/components/Layout/Header/header.module.scss";
import { RequestType } from "@/models/Request";
import axios from "axios";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CiLogout } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa6";

type HeaderType = {
  isAdmin: boolean;
};

export const Header: React.FC<HeaderType> = ({ isAdmin }) => {
  const logoutHandler = async () => {
    await signOut({ callbackUrl: "/" });
  };
  const [notification, setNotification] = useState(undefined);

  useEffect(() => {
    (async () => {
      const { data: {data} } = await axios.get("/requests/api?limit=99");
      setNotification(
        data.requests.filter((item: RequestType) =>
          isAdmin
            ? item.adminStatus === "pending"
            : item.employeeStatus === "unread"
        ).length
      );
    })();
  });

  return (
    <div className={`${classes.header} flex items-center justify-end`}>
      <Button className={classes.requests}>
        <Link href={"/requests"}>
          <FaRegBell />
          {Boolean(notification) && (
            <span className={`${classes.amount} rounded-full`}>
              {notification}
            </span>
          )}
        </Link>
      </Button>
      <Button className={classes.logout} onClick={logoutHandler}>
        <CiLogout /> Logout
      </Button>
    </div>
  );
};
