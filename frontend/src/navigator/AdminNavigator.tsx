import { Route, Routes } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getMovies } from "@/api/movie";
import { getActors } from "@/api/actor";
import { AppSidebar } from "@/components/ui/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import NotFound from "../components/NotFound";
import Actors from "../components/admin/Actors";
import Dashboard from "../components/admin/Dashboard";
import Header from "../components/admin/Header";
import Movies from "../components/admin/Movies";
import SearchMovies from "../components/admin/SearchMovies";

const movieLimit = 6;
const actorLimit = 9;

function AdminNavigator() {
  const [movies, setMovies] = useState([]);
  const [moviePage, setMoviePage] = useState(0);
  const [totalMovies, setTotalMovies] = useState(0);
  const [actors, setActors] = useState([]);
  const [actorPage, setActorPage] = useState(0);
  const [totalActors, setTotalActors] = useState(0);
  const { t } = useTranslation();

  const fetchMovies = useCallback(async (pageNo: number) => {
    const { error, movies: newMovies, totalMovieCount: newTotal } = await getMovies(pageNo, movieLimit);
    if (error) return toast.error(t(error));
    setMovies(newMovies || []);
    setTotalMovies(newTotal || 0);
    setMoviePage(pageNo);
  }, [t]);

  const fetchActors = useCallback(async (pageNo: number) => {
    const { error, profiles, totalActorCount } = await getActors(pageNo, actorLimit);
    if (error) return toast.error(t(error));
    setActors(profiles || []);
    setTotalActors(totalActorCount || 0);
    setActorPage(pageNo);
  }, [t]);

  useEffect(() => {
    fetchMovies(0);
    fetchActors(0);
  }, [fetchMovies, fetchActors]);
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header 
          onMovieCreated={() => fetchMovies(0)} 
          onActorCreated={() => fetchActors(0)}
        />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route 
            path="/movies" 
            element={
              <Movies
                movies={movies}
                currentPage={moviePage}
                totalMovieCount={totalMovies}
                limit={movieLimit}
                fetchMovies={fetchMovies}
              />
            } 
          />
          <Route 
            path="/actors" 
            element={
              <Actors
                actors={actors}
                currentPage={actorPage}
                totalActorCount={totalActors}
                limit={actorLimit}
                fetchActors={fetchActors}
              />
            } 
          />
          <Route path="/search" element={<SearchMovies />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AdminNavigator;