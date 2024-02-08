"use client";

import * as React from "react";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileAvatar() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>
            {session?.user.name
              .toUpperCase()
              .split(" ")
              .slice(0, 3)
              .map((s: string) => s.charAt(0))
              .join("")}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full my-2 mx-3" align="end">
        {/* <DropdownMenuLabel>
          {session?.user.name.split(" ").at(0)}
        </DropdownMenuLabel>
        <DropdownMenuSeparator /> */}
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-500 font-bold"
          onClick={() =>
            signOut({
              callbackUrl: "/signin",
              redirect: true,
            })
          }
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
