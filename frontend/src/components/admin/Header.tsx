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
import { Input } from "../ui/input";
import { SidebarTrigger } from "../ui/sidebar";
import ThemeButton from "../ui/ThemeButton";
import MovieForm from "./MovieForm";
// import i18n from "i18next";
import { useTranslation } from "react-i18next";
import i18n from "@/utils/i18n";
import AppSearchForm from "../form/AppSearchForm";
import LanguageButton from "../ui/LanguageButton";

export default function Header() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();

  const { t } = useTranslation("translation");

  const handleSubmitMovie = async (data) => {
    setBusy(true);
    const { error, movie, message } = await createMovie(data);
    setBusy(false);
    if (error) {
      toast.error(t("Failed to create a movie"));
    }
    if (!error) {
      toast.success(t("Successfully created a movie"));
    }
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (query) => {
    // e.preventDefault();
    // if (!search.trim()) {
    //   return;
    // }
    navigate("/search?title=" + query);
    // setSearch("");
  };

  return (
    <div className="flex items-center justify-between gap-3 relative px-2 py-5 sm:p-5">
      <div className=" flex gap-3 items-center">
        <SidebarTrigger />
        <AppSearchForm
          placeholder={t("Search Movies...")}
          // inputClassName="border-dark-subtle text-white focus:border-white sm:w-auto w-40 sm:text-lg"
          onSubmit={handleSubmit}
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
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger className="gap-4" asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Users size="20" />
                  <span>{t("Create Actor")}</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent
                className="w-[500px]"
                onInteractOutside={(e) => {
                  e.preventDefault();
                }}
              >
                <DialogHeader>
                  <DialogTitle>{t("Create Actor")}</DialogTitle>
                  <DialogDescription>
                    {t("Submit to create an actor. All fields are required.")}
                  </DialogDescription>
                </DialogHeader>
                <ActorUpload setOpen={setOpen} />
              </DialogContent>
            </Dialog>
            <DropdownMenuSeparator />
            <Dialog>
              <DialogTrigger>
                <DropdownMenuItem
                  className="gap-4"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Clapperboard size="20" />
                  <span>{t("Create Movie")}</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent
                className="w-[900px]"
                onInteractOutside={(e) => {
                  e.preventDefault();
                }}
              >
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
