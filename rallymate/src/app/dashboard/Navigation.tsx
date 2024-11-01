"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoMapOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoNotificationsOutline,
  IoTennisballOutline,
} from "react-icons/io5";
import { useUser } from "./user-context";

export default function Navigation() {
  const currentPath = usePathname();
  const user = useUser();

  const activeLink = (path: string) => {
    return currentPath === path
      ? "text-black bg-primary border-primary border-2 p-2 rounded"
      : "text-black p-2";
  };

  return (
    <div className="flex items-center justify-between">
      <h4 className="font-semibold text-lg">Hello, {user?.name}!</h4>
      <div className="flex flex-row gap-4">
        <Link className={`${activeLink("/dashboard/find-courts")}`} href="/dashboard/find-courts">
          <IoMapOutline className="w-8 h-6" />
        </Link>
        <Link className={activeLink("/dashboard/tracker")} href="/dashboard/tracker">
          <IoTennisballOutline className="w-8 h-6" />
        </Link>
        <Link className={activeLink("/scheduling")} href="/scheduling">
          <IoCalendarOutline className="w-8 h-6" />
        </Link>
      </div>
      <div className="flex flex-row gap-4">
        <Link className={activeLink("/notifications")} href="/notifications">
          <IoNotificationsOutline className="w-8 h-6" />
        </Link>
        <Link className={activeLink("/profile")} href="/profile">
          <IoPersonOutline className="w-8 h-6" />
        </Link>
      </div>
    </div>
  );
}
