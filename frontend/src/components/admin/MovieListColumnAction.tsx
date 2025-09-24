import {
  ExternalLink,
  Loader,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { deleteMovie } from "@/api/movie";
import { useMovies } from "../../hooks";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import UpdateMovie from "../modals/UpdateMovie";

// Prop olarak artık tüm movie objesini alıyoruz
export default function MovieListColumnAction({ movie }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const { t } = useTranslation();
  const { fetchLatestUploads } = useMovies();

  const handleDelete = async () => {
    setBusy(true);
    const { error, message } = await deleteMovie(movie.id);
    setBusy(false);

    if (error) return toast.error(t(error));
    
    toast.success(t(message));
    setIsDeleteDialogOpen(false); // Close the delete confirmation dialog
    fetchLatestUploads(); // Refresh the movie list
  };

  return (
    <>
      {/* Edit Movie Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[900px]">
          <DialogHeader>
            <DialogTitle>{t("Edit Movie")}</DialogTitle>
          </DialogHeader>
          <UpdateMovie 
            movieId={movie.id} 
            // Pass the full movie object to pre-fill the form
            initialState={movie} 
            // Provide a function to close the dialog and refresh the list on success
            onSuccess={() => {
              setIsEditDialogOpen(false);
              fetchLatestUploads();
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Movie Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("Are you sure?")}</DialogTitle>
            <DialogDescription>
              {t("This action will remove this movie permanently!")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={busy}
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="secondary"
            >
              {t("Cancel")}
            </Button>
            <Button onClick={handleDelete} variant="destructive" disabled={busy}>
              <span className="w-12 flex items-center justify-center">
                {busy ? <Loader className="animate-spin" /> : t("Delete")}
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* The ... Action Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => window.open(`/movie/${movie.id}`, "_blank")}>
            <ExternalLink className="mr-2 h-4 w-4" />
            <span>{t("Open")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>{t("Edit")}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)} className="text-red-500">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>{t("Delete")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}