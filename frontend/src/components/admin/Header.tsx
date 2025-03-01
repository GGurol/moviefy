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

export default function Header({ onAddActorClick, onAddMovieClick }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();

  const handleSubmitMovie = async (data) => {
    setBusy(true);
    const { error, movie, message } = await createMovie(data);
    setBusy(false);
    if (error) {
      toast.error("Failed to create a movie");
    }
    if (!error) {
      toast.success("Succeeded to create a movie");
    }
    console.log("error:", error);
    console.log("movie:", movie);
    console.log("message", message);
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) {
      return;
    }
    navigate("/search?title=" + search);
    setSearch("");
  };

  return (
    <div className="flex items-center justify-between relative p-5">
      <div className=" flex gap-5 items-center">
        <SidebarTrigger />

        <form onSubmit={handleSubmit}>
          <Input
            name="search"
            value={search}
            onChange={handleChange}
            placeholder="Search movies..."
          />
        </form>
      </div>

      <div className="flex items-center space-x-3">
        <ThemeButton />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Create</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger className="gap-4" asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Users size="20" />
                  <span>Create actors</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent
                className="w-[500px]"
                onInteractOutside={(e) => {
                  e.preventDefault();
                }}
              >
                <DialogHeader>
                  <DialogTitle>Create Actor</DialogTitle>
                  <DialogDescription>
                    Submit to create an actor, all fields are required.
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
                  <span>Create movies</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent
                className="w-[900px]"
                onInteractOutside={(e) => {
                  e.preventDefault();
                }}
              >
                <DialogHeader>
                  <DialogTitle>Create Movie</DialogTitle>
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
