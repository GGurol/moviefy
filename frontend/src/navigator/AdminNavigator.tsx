import { AppSidebar } from "@/components/ui/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Route, Routes } from "react-router-dom";
import NotFound from "../components/NotFound";
import Actors from "../components/admin/Actors";
import Dashboard from "../components/admin/Dashboard";
import Header from "../components/admin/Header";
import Movies from "../components/admin/Movies";
import SearchMovies from "../components/admin/SearchMovies";

function AdminNavigator() {
  return (
    <>
      <SidebarProvider
        style={{
          "--sidebar-width": "12rem",
          "--sidebar-width-mobile": "12rem",
        }}
      >
        <AppSidebar />
        <SidebarInset className="">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/actors" element={<Actors />} />
            <Route path="/search" element={<SearchMovies />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export default AdminNavigator;
