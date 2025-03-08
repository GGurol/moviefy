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
import { useTranslation } from "react-i18next";
import i18n from "@/utils/i18n";

const items = [
  {
    title: i18n.t("Home"),
    url: "/",
    icon: Home,
  },
  {
    title: i18n.t("Movies"),
    url: "/movies",
    icon: MonitorPlay,
  },
  {
    title: i18n.t("Actors"),
    url: "/actors",
    icon: UserRound,
  },
];

export function AppSidebar() {
  const { handleLogout } = useAuth();
  const { t } = useTranslation();
  return (
    <Sidebar variant="inset">
      <SidebarHeader className="mb-8">
        <Link to="/">
          <img src="./logo.svg" alt="MovieFy logo" className="w-full pt-2" />
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
                      <span>{t(item.title)}</span>
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
          variant="secondary"
          onClick={handleLogout}
          className="flex items-center justify-start w-full py-1 px-2"
        >
          <LogOut size={18} />
          <span>{t("Log out")}</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
