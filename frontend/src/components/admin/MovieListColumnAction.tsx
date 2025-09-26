import {
  ExternalLink,
  Loader,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { deleteMovie } from "@/api/movie";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { AlertDialogTrigger, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import UpdateMovie from "../modals/UpdateMovie";

export default function MovieListColumnAction({ movie, onDeleteSuccess, onUpdateSuccess }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const { t } = useTranslation();

  const handleDelete = async () => {
    setBusy(true);
    const { error, message } = await deleteMovie(movie.id);
    setBusy(false);
    if (error) return toast.error(t(error));
    toast.success(t(message));
    setIsDeleteDialogOpen(false);
    onDeleteSuccess();
  };

  return (
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
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>{t("Edit")}</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="w-[900px]">
            <DialogHeader>
              <DialogTitle>{t("Edit Movie")}</DialogTitle>
            </DialogHeader>
            <UpdateMovie 
              movieId={movie.id} 
              onSuccess={() => {
                setIsEditDialogOpen(false);
                onUpdateSuccess();
              }}
            />
          </DialogContent>
        </Dialog>
        <DropdownMenuSeparator />
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>{t("Delete")}</span>
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("Are you sure?")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("This action will remove this movie permanently!")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={busy}>{t("Cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={busy}>
                {busy ? <Loader className="animate-spin" /> : t("Delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}