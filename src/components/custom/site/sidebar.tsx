"use client";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../../ui/sidebar";
import FavIcon from "@app/favicon.ico";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import {
  BoxesIcon,
  BoxIcon,
  ChevronDown,
  LayoutDashboardIcon,
  LinkIcon,
  LogOutIcon,
  MapIcon,
  UserCircleIcon,
} from "lucide-react";
import { AuthUser, getCurrentUser, signOut } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/collapsible";

export default function SiteSidebar() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    (async () => {
      setUser(await getCurrentUser());
    })().catch((err) => {
      console.error(err);
    });
  }, []);

  const logout = () => {
    (async () => {
      await signOut();
    })()
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        window.location.reload();
      });
  };

  return (
    <Sidebar>
      <SidebarHeader className="h-12 border-b">
        <SidebarMenuButton asChild>
          <Link href="/client/dashboard">
            <img
              src={FavIcon.src}
              alt="Pic1Medical Icon"
              className="h-6 w-fit rounded"
            />
            <span className="font-bold text-lg">Pic1Medical Tracker</span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <Collapsible
          defaultOpen
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                <MapIcon className="mr-2" />
                <span className="font-semibold">Tracker</span>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
          </SidebarGroup>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenuSub>
                {/* <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/client/dashboard">
                      <LayoutDashboardIcon />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem> */}
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/client/tracker">
                      <BoxesIcon />
                      <span>Tracker</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarGroupContent>
          </CollapsibleContent>
        </Collapsible>
        <SidebarGroup></SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t h-12">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <UserCircleIcon />
              <span>{user && (user.signInDetails?.loginId ?? "Profile")}</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={logout}
              >
                <LogOutIcon />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
