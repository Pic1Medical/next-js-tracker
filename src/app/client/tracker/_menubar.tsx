"use client";
import ClientPortal from "@/src/components/custom/ClientPortal";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/src/components/ui/menubar";
import {
  BoxesIcon,
  BoxIcon,
  EraserIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import Link from "next/link";

export default function TrackerMenubar() {
  return (
    <ClientPortal selector="#header-portal">
      <h1 className="font-bold mr-2 flex items-center gap-1 pointer-none select-none">
        <BoxesIcon size="18" />
        <span>Tracker</span>
      </h1>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>
            <BoxIcon
              size="15"
              className="mr-1"
            />
            <span>Stock</span>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem asChild>
                <Link href="/client/tracker/stock">
                  <SearchIcon />
                  <span>Search Stock</span>
                </Link>
              </MenubarItem>
              <MenubarItem asChild>
                <Link href="/client/tracker/stock/create">
                  <PlusIcon />
                  <span>New Entry</span>
                </Link>
              </MenubarItem>
              <MenubarItem
                variant="destructive"
                disabled
              >
                <EraserIcon />
                <span>Remove Entry</span>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>
            <BoxIcon
              size="15"
              className="mr-1"
            />
            <span>Product</span>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem asChild>
                <Link href="/client/tracker/product">
                  <SearchIcon />
                  <span>Search Product</span>
                </Link>
              </MenubarItem>
              <MenubarItem asChild>
                <Link href="/client/tracker/product/create">
                  <PlusIcon />
                  <span>New Entry</span>
                </Link>
              </MenubarItem>
              <MenubarItem
                variant="destructive"
                disabled
              >
                <EraserIcon />
                <span>Remove Entry</span>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>
            <BoxIcon
              size="15"
              className="mr-1"
            />
            <span>Category</span>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem asChild>
                <Link href="/client/tracker/category">
                  <SearchIcon />
                  <span>Search Category</span>
                </Link>
              </MenubarItem>
              <MenubarItem asChild>
                <Link href="/client/tracker/category/create">
                  <PlusIcon />
                  <span>New Entry</span>
                </Link>
              </MenubarItem>
              <MenubarItem
                variant="destructive"
                disabled
              >
                <EraserIcon />
                <span>Remove Entry</span>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>
            <BoxIcon
              size="15"
              className="mr-1"
            />
            <span>Location</span>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem asChild>
                <Link href="/client/tracker/location">
                  <SearchIcon />
                  <span>Search Location</span>
                </Link>
              </MenubarItem>
              <MenubarItem asChild>
                <Link href="/client/tracker/location/create">
                  <PlusIcon />
                  <span>New Entry</span>
                </Link>
              </MenubarItem>
              <MenubarItem
                variant="destructive"
                disabled
              >
                <EraserIcon />
                <span>Remove Entry</span>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ClientPortal>
  );
}
