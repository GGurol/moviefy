import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
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
    <Sidebar className="">
      <SidebarHeader className="pl-4 mb-7">
        <Link to="/">
          <img src="./logo.png" alt="logo" className="h-14 p-2" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="pl-4">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavItem to={item.url}>
                  <item.icon size={18} />
                  <span>{item.title}</span>
                </NavItem>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter className="pl-4">
        <Button variant="ghost" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Log out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

const NavItem = ({ children, to }) => {
  const commonClasses =
    " flex items-center text-md space-x-2 p-2 hover:opacity-80";
  return (
    <NavLink
      className={({ isActive }) =>
        (isActive ? "text-blue-400" : "") + commonClasses
      }
      to={to}
    >
      {children}
    </NavLink>
  );
};
