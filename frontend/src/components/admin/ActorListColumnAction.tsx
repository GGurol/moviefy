import {
  Loader,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { deleteActor } from "@/api/actor";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import UpdateActor from "../modals/UpdateActor";

export default function ActorListColumnAction({ actor, onActionSuccess }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const { t } = useTranslation();

  const handleDelete = async () => {
    setBusy(true);
    const { error, message } = await deleteActor(actor.id);
    setBusy(false);

    if (error) return toast.error(t(error));
    
    toast.success(t(message));
    setIsDeleteDialogOpen(false);
    onActionSuccess();
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
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>{t("Edit")}</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="w-[500px]">
            <DialogHeader>
              <DialogTitle>{t("Update Actor")}</DialogTitle>
            </DialogHeader>
            <UpdateActor
              initialState={actor}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                onActionSuccess();
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
                {t("This action will remove this actor permanently!")}
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