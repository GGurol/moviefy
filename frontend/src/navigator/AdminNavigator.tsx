import { Route, Routes } from "react-router-dom";
import NotFound from "../components/NotFound";
import Dashboard from "../components/admin/Dashboard";
import Movies from "../components/admin/Movies";
import Actors from "../components/admin/Actors";
import Navbar from "../components/admin/Navbar";
import Header from "../components/admin/Header";
import MovieUpload from "../components/admin/MovieUpload";
import { useState } from "react";
import ActorUpload from "../components/modals/ActorUpload";
import SearchMovies from "../components/admin/SearchMovies";
import { AppSidebar } from "@/components/ui/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

function AdminNavigator() {
  const [showMovieUploadModal, setShowMovieUploadModal] = useState(false);
  const [showActorUploadModal, setShowActorUploadModal] = useState(false);

  const displayMovieUploadModal = () => {
    setShowMovieUploadModal(true);
  };
  const hideMovieUploadModal = () => {
    setShowMovieUploadModal(false);
  };
  const displayActorUploadModal = () => {
    setShowActorUploadModal(true);
  };
  const hideActorUploadModal = () => {
    setShowActorUploadModal(false);
  };
  return (
    <>
      <AppSidebar />
      <SidebarInset className="w-full mx-auto">
        <Header
          onAddMovieClick={displayMovieUploadModal}
          onAddActorClick={displayActorUploadModal}
        />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/actors" element={<Actors />} />
          <Route path="/search" element={<SearchMovies />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </SidebarInset>
      <MovieUpload
        visible={showMovieUploadModal}
        onClose={hideMovieUploadModal}
      />
      <ActorUpload
        visible={showActorUploadModal}
        onClose={hideActorUploadModal}
      />
    </>
  );
}

export default AdminNavigator;
