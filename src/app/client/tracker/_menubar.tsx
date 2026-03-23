"use client";
import ClientPortal from "@/src/components/custom/ClientPortal";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/src/components/ui/menubar";
import {
  BoxesIcon,
  BoxIcon,
  DatabaseIcon,
  EraserIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  TagsIcon,
  TriangleAlertIcon,
  WarehouseIcon,
} from "lucide-react";
import Link from "next/link";
import { useTrackerContext } from "./_context";

export default function TrackerMenubar() {
  const tracker = useTrackerContext();

  return (
    <ClientPortal selector="#header-portal">
      <h1 className="font-bold mr-2 flex items-center gap-1 pointer-none select-none">
        <BoxesIcon size="18" />
        <span>Tracker</span>
      </h1>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>
            <DatabaseIcon
              size="15"
              className="mr-1"
            />
            <span>Database</span>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarSub>
                <MenubarSubTrigger>
                  <BoxIcon
                    size="15"
                    className="mr-1"
                  />
                  <span>Product</span>
                </MenubarSubTrigger>
                <MenubarSubContent>
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
                  </MenubarGroup>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSub>
                <MenubarSubTrigger>
                  <TagsIcon
                    size="15"
                    className="mr-1"
                  />
                  <span>Category</span>
                </MenubarSubTrigger>
                <MenubarSubContent>
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
                  </MenubarGroup>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSub>
                <MenubarSubTrigger>
                  <MapPinIcon
                    size="15"
                    className="mr-1"
                  />
                  <span>Location</span>
                </MenubarSubTrigger>
                <MenubarSubContent>
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
                  </MenubarGroup>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem
                variant="destructive"
                disabled={!tracker?.canDestroy}
                onClick={tracker?.destroy}
              >
                <EraserIcon />
                <span>Delete Current</span>
                <TriangleAlertIcon />
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ClientPortal>
  );
}
