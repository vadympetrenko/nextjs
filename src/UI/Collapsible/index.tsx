"use client";
import { PropsWithChildren, ReactNode, useState } from "react";
import classes from "./Collapsible.module.scss";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

type CollapsibleType = {
  title: string;
  icon?: ReactNode;
};

export const Collapsible: React.FunctionComponent<
  PropsWithChildren<CollapsibleType>
> = ({ children, title, icon }) => {
  const [show, setShow] = useState(false);
  const arrow = show ? <FaAngleDown /> : <FaAngleUp />;
  const titleClasses = `${classes.title} ${show ? classes.active : ''}`
  return (
      <li>
        <p className={titleClasses} onClick={() => setShow((prev) => !prev)}>
          {icon} {title} {arrow}
        </p>
        {show && <ul>{children}</ul>}
      </li>
  );
};
