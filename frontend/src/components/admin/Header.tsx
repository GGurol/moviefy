import { createMovie } from "@/api/movie";
import { Clapperboard, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ActorUpload from "../modals/ActorUpload";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import AppSearchForm from "../form/AppSearchForm";
import LanguageButton from "../ui/LanguageButton";
import ThemeButton from "../ui/ThemeButton";
import MovieForm from "./MovieForm";
import { SidebarTrigger } from "../ui/sidebar";

export default function Header({ onMovieCreated, onActorCreated }) {
  const [openMovieDialog, setOpenMovieDialog] = useState(false);
  const [openActorDialog, setOpenActorDialog] = useState(false);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation("translation");

  const handleSubmitMovie = async (data) => {
    setBusy(true);
    const { error } = await createMovie(data);
    setBusy(false);
    
    if (error) return toast.error(t("Failed to create a movie"));
    
    toast.success(t("Successfully created a movie"));
    setOpenMovieDialog(false);
    onMovieCreated();
  };

  const handleActorUploadSuccess = () => {
    setOpenActorDialog(false);
    onActorCreated();
  };

  const handleSearchSubmit = (query) => {
    navigate("/search?title=" + query);
  };

  return (
    <div className="flex items-center justify-between gap-3 relative px-2 py-5 sm:p-5">
      <div className=" flex gap-3 items-center">
        <SidebarTrigger />
        <AppSearchForm
          placeholder={t("Search Movies...")}
          onSubmit={handleSearchSubmit}
        />
      </div>
      <div className="flex items-center space-x-3">
        <ThemeButton />
        <LanguageButton />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>{t("Create")}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Dialog open={openActorDialog} onOpenChange={setOpenActorDialog}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Users size="20" />
                  <span>{t("Create Actor")}</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="w-[305px] max-sm:rounded-md sm:w-[570px] overflow-y-scroll max-h-screen">
                <DialogHeader>
                  <DialogTitle>{t("Create Actor")}</DialogTitle>
                  <DialogDescription className="max-sm:hidden">
                    {t("Submit to create an actor. All fields are required.")}
                  </DialogDescription>
                </DialogHeader>
                <ActorUpload onSuccess={handleActorUploadSuccess} />
              </DialogContent>
            </Dialog>
            <DropdownMenuSeparator />
            <Dialog open={openMovieDialog} onOpenChange={setOpenMovieDialog}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Clapperboard size="20" />
                  <span>{t("Create Movie")}</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="w-[350px] sm:w-[600px] max-md:p-2 max-sm:rounded-md md:w-[750px] lg:w-[900px] overflow-y-scroll max-h-screen">
                <DialogHeader>
                  <DialogTitle>{t("Create Movie")}</DialogTitle>
                </DialogHeader>
                <MovieForm onSubmit={handleSubmitMovie} busy={busy} />
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}