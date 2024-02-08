"use client";
import { ProfileAvatar } from "./profile-avatar";
import { Separator } from "./ui/separator";
import { ModeToggle } from "./mode-toggle";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import { IconType } from "react-icons/lib";
import { FaUserAlt } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { MdRestaurantMenu } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetClose,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MenuItemProps {
  title: string;
  icon: IconType;
  href: string;
}

type SidebarProps = {
  [key in "USER" | "CANTEEN" | "ADMIN"]: MenuItemProps[];
};

const SIDEBAR_OPTIONS: SidebarProps = {
  USER: [
    { title: "Home", icon: GoHomeFill, href: "/user" },
    { title: "Users", icon: FaUserAlt, href: "/user/users" },
    { title: "Menu", icon: MdRestaurantMenu, href: "/user/menu" },
  ],
  CANTEEN: [
    { title: "Home", icon: GoHomeFill, href: "/canteen" },
    { title: "Menu", icon: MdRestaurantMenu, href: "/canteen/menu" },
  ],
  ADMIN: [
    { title: "Home", icon: GoHomeFill, href: "/admin" },
    { title: "Menu", icon: MdRestaurantMenu, href: "/admin/menu" },
    { title: "Users", icon: FaUserAlt, href: "/admin/users" },
  ],
};

function SidebarOptions({ role }: { role: "USER" | "CANTEEN" | "ADMIN" }) {
  return (
    <>
      <div className="grow flex flex-col gap-4 py-2">
        {SIDEBAR_OPTIONS[role].map((item, index) => (
          <Link key={index} href={item.href}>
            <span className="w-full text-sm text-primary px-3 py-2.5 cursor-pointer hover:bg-secondary rounded-md flex items-center gap-4">
              <item.icon size={20} />
              {item.title}
            </span>
          </Link>
        ))}
      </div>
      <div className="grow flex flex-col gap-3"></div>
    </>
  );
}

function DesktopSidebar({ role }: { role: string | null }) {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });
  return (
    <div className="w-[400px] h-full text-white p-3 hidden lg:flex flex-col border-r-[1px] border-foreground-500">
      <div className="grow flex flex-col px-1.5 py-1">
        <div className="flex justify-between items-center mt-3 mb-5">
          <span className="text-xl font-bold uppercase text-primary">
            Canteen Management System
          </span>
        </div>
        <Separator />
        {role === "ADMIN" && <SidebarOptions role="ADMIN" />}
      </div>
      <Separator />
      <div className="w-full flex justify-start items-center gap-3 cursor-pointer p-1 mt-2 mx-1.5">
        <ProfileAvatar />
        <span className="text-primary text-sm text-ellipsis text-center">
          {session?.user.name}
        </span>
      </div>
    </div>
  );
}

function MobileSidebar({ role }: { role: string | null }) {
  return (
    <Sheet>
      <SheetTrigger asChild className="block lg:hidden">
        <Button variant="ghost" size="icon" className="absolute top-5 left-4">
          <HiMenuAlt2 size={25} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Canteen Management System</SheetTitle>
          {/* <SheetDescription>
            Make changes to your profile here. Click save when youre done.
          </SheetDescription> */}
        </SheetHeader>
        <div className="h-full text-white p-3 flex flex-col">
          {role === "ADMIN" && <SidebarOptions role="ADMIN" />}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function Sidebar() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });
  return (
    <>
      <DesktopSidebar role={session?.user ? session.user.role : null} />
      <MobileSidebar role={session?.user ? session.user.role : null} />
    </>
  );
}
