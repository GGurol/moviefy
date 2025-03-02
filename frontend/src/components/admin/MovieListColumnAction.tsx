import {
  ExternalLink,
  Loader,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import UpdateMovie from "../modals/UpdateMovie";
import { forwardRef, useEffect, useRef, useState } from "react";
import { deleteMovie } from "@/api/movie";
import { toast } from "sonner";
import { useMovies } from "@/hooks";

export default function MovieListColumnAction() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const [hasOpenDialog, setHasOpenDialog] = useState(false);
  const dropdownTriggerRef = useRef(null);
  // const focusRef = useRef(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [busy, setBusy] = useState(false);

  const { fetchLatestUploads, latestUploads } = useMovies();

  useEffect(() => {
    fetchLatestUploads();
  }, []);

  const handleUIUpdate = () => fetchLatestUploads();

  // function handleDialogItemSelect() {
  //   focusRef.current = dropdownTriggerRef.current;
  // }

  function handleOpenEdit(open) {
    // setHasOpenDialog(open);
    setOpenEditDialog(open);
    if (open === false) {
      setDropdownOpen(false);
    }
  }

  function handleOpenDelete(open) {
    // setHasOpenDialog(open);
    setOpenDeleteDialog(open);
    if (open === false) {
      setDropdownOpen(false);
    }
  }

  const handleDelete = async (setOpenDialog) => {
    setBusy(true);
    const { error, message } = await deleteMovie(movie.id);
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    setBusy(false);

    if (error) return toast.error(error);
    toast.success(message);
    setOpenDialog(false);
    handleUIUpdate();
  };

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          // ref={dropdownTriggerRef}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        // hidden={hasOpenDialog}
        hidden={openEditDialog || openDeleteDialog}
        // onCloseAutoFocus={(event) => {
        //   if (focusRef.current) {
        //     focusRef.current.focus();
        //     focusRef.current = null;
        //     event.preventDefault();
        //   }
        // }}
      >
        <DropdownMenuItem>
          <div className="flex items-center gap-3 w-full">
            <ExternalLink strokeWidth={0.9} size={20} />
            <span>Open</span>
          </div>
        </DropdownMenuItem>
        {/* <Dialog>
          <DialogTrigger className="w-full"> */}
        <DialogItem
          triggerChildren={
            <div className="flex items-center gap-3">
              <Pencil strokeWidth={0.9} size={20} />
              <span>Edit</span>
            </div>
          }
          // onSelect={handleDialogItemSelect}
          onOpenChange={handleOpenEdit}
          open={openEditDialog}
          className="w-[900px]"
        >
          {/* <DialogHeader> */}
          <DialogTitle>Edit Movie</DialogTitle>
          {/* </DialogHeader> */}
          <UpdateMovie />
        </DialogItem>
        {/* </DialogTrigger> */}
        {/* <DialogContent
            className="w-[900px]"
            // onInteractOutside={(e) => e.preventDefault()}
          > */}
        {/* <DialogHeader>
              <DialogTitle>Edit movie</DialogTitle>
            </DialogHeader>
            <UpdateMovie />
          </DialogContent>
        </Dialog> */}

        <DropdownMenuSeparator />
        <DialogItem
          triggerChildren={
            <div className="flex items-center gap-3">
              <Trash2 strokeWidth={0.9} size={20} />
              <span>Delete</span>
            </div>
          }
          // onSelect={handleDialogItemSelect}
          onOpenChange={handleOpenDelete}
          open={openDeleteDialog}
          // open={hasOpenDialog}
          className="w-[500px]"
        >
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action will remove this movie permanently!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={busy}
              onClick={() => setOpenDeleteDialog(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleDelete(setOpenDeleteDialog);
              }}
              variant="destructive"
              disabled={busy}
            >
              <span className="w-12 flex items-center justify-center">
                {busy ? <Loader className="animate-spin" /> : "Delete"}
              </span>
            </Button>
          </DialogFooter>
        </DialogItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const DialogItem = forwardRef((props, forwardedRef) => {
  const {
    triggerChildren,
    children,
    onSelect,
    onOpenChange,
    open,
    className,
    ...itemProps
  } = props;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          {...itemProps}
          // ref={forwardedRef}
          onSelect={(event) => {
            event.preventDefault();
            onSelect && onSelect();
          }}
        >
          {triggerChildren}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent
          className={className}
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          {children}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
});
