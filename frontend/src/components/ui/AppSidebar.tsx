import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Home, LogOut, MonitorPlay, UserRound } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "./button";
import { useAuth } from "@/hooks";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Movies",
    url: "/movies",
    icon: MonitorPlay,
  },
  {
    title: "Actors",
    url: "/actors",
    icon: UserRound,
  },
];

export function AppSidebar() {
  const { handleLogout } = useAuth();
  return (
    <Sidebar variant="inset">
      <SidebarHeader className="pl-4 mb-7">
        <Link to="/">
          <img src="./logo.png" alt="logo" className="h-14 p-2" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton className="p-0">
                <NavLink
                  to={item.url}
                  className={({ isActive }) =>
                    (isActive ? "bg-muted" : " ") + " w-full"
                  }
                >
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start w-full py-1 px-2"
                    asChild
                  >
                    <div>
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </div>
                  </Button>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter className="p-0">
        <Button
          variant="default"
          onClick={handleLogout}
          className="flex items-center justify-start w-full py-1 px-2"
        >
          <LogOut size={18} />
          <span>Log out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
