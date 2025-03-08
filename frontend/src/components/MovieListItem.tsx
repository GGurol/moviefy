import { BsBoxArrowUpRight, BsPencilSquare, BsTrash } from "react-icons/bs";
import ConfirmModal from "./modals/ConfirmModal";
import { useState } from "react";
import { deleteMovie } from "../api/movie";
import { useNotification } from "../hooks";
import UpdateMovie from "./modals/UpdateMovie";
import { getPoster } from "../utils/helper";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ExternalLink,
  FolderLock,
  FolderOpen,
  Loader,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useNavigate } from "react-router-dom";
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
} from "./ui/alert-dialog";
import { toast } from "sonner";
import { Button, buttonVariants } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useTranslation } from "react-i18next";

const MovieListItem = ({ movie, afterDelete, afterUpdate }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleOnDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteMovie(movie.id);
    setBusy(false);

    if (error) return toast.error(t(error));

    hideConfirmModal();
    toast.success(t(message));
    afterDelete(movie);
  };

  const handleOnEditClick = () => {
    // setShowUpdateModal(true);
    setSelectedMovieId(movie.id);
    // console.log(movie);
  };

  const handleOnOpenClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleOnUpdate = (movie) => {
    afterUpdate(movie);
    // setShowUpdateModal(false);
    setSelectedMovieId(null);
  };

  const displayConfirmModal = () => setShowConfirmModal(true);
  const hideConfirmModal = () => setShowConfirmModal(false);

  const handleDelete = async (setOpenDialog) => {
    setBusy(true);
    const { error, message } = await deleteMovie(movie.id);
    setBusy(false);

    if (error) return toast.error(t(error));
    toast.success(t(message));
    setOpenDialog(false);
    afterDelete(movie);
  };

  return (
    <>
      <MovieCard
        movie={movie}
        onDeleteClick={displayConfirmModal}
        onEditClick={handleOnEditClick}
        onOpenClick={handleOnOpenClick}
        handleDelete={handleDelete}
        busy={busy}
      />
      {/* <div className="p-0">
        <UpdateMovie
          movieId={selectedMovieId}
          visible={showUpdateModal}
          onSuccess={handleOnUpdate}
        />
      </div> */}
    </>
  );
};

const MovieCard = ({
  movie,
  onDeleteClick,
  onOpenClick,
  onEditClick,
  handleDelete,
  busy,
}) => {
  const { poster, title, responsivePosters, genres = [], status } = movie;
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { t } = useTranslation();

  return (
    <Card className="rounded-sm flex items-center">
      <CardHeader className="p-1">
        <CardTitle className="w-24">
          <img
            className="w-full aspect-square object-cover rounded-lg p-1"
            src={getPoster(responsivePosters) || poster}
            alt={title}
          />
        </CardTitle>
      </CardHeader>
      <div className="flex justify-between w-full flex-col lg:flex-row">
        <CardContent className="p-1 overflow-auto w-full">
          <h1 className="text-sm lg:text-lg font-semibold capitalize pb-1">
            {t(`movies.${movie.id}.title`)}
          </h1>
          <div className="space-x-1 lg:pb-2 flex flex-wrap">
            {genres.map((g, index) => {
              return (
                <span key={g + index} className="text-xs text-muted-foreground">
                  {t(`genres.${g}`)}
                </span>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="px-1 py-0 lg:p-1">
          {/* Status */}
          {status === "public" ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <FolderOpen strokeWidth={0.75} className="w-4 lg:w-5" />
                </TooltipTrigger>
                <TooltipContent>
                  <span>{t("Public")}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <FolderLock strokeWidth={0.75} className="w-4 lg:w-5" />
                </TooltipTrigger>
                <TooltipContent>
                  <span>{t("Private")}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Delete */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    setOpenDelete(true);
                  }}
                >
                  <Trash2 strokeWidth={0.75} className="w-4 lg:w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <span>{t("Delete")}</span>
              </TooltipContent>
            </Tooltip>
            <AlertDialog open={openDelete}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("Are you sure?")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("This action will remove this movie permanently!")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    disabled={busy}
                    onClick={() => setOpenDelete(false)}
                  >
                    {t("Cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      handleDelete(setOpenDelete);
                    }}
                    className={buttonVariants({ variant: "destructive" })}
                    disabled={busy}
                  >
                    <span className="w-12 flex items-center justify-center">
                      {busy ? <Loader className="animate-spin" /> : t("Delete")}
                    </span>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TooltipProvider>

          {/* Edit */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => setOpenEdit(true)}>
                  <Pencil strokeWidth={0.75} className="w-4 lg:w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <span>{t("Edit")}</span>
              </TooltipContent>
            </Tooltip>
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
              <DialogContent
                className="w-[900px]"
                onInteractOutside={(e) => {
                  e.preventDefault();
                }}
              >
                <DialogHeader>
                  <DialogTitle>{t("Edit Movie")}</DialogTitle>
                  {/* <DialogDescription>
                    {t("Submit to update a movie")}
                  </DialogDescription> */}
                </DialogHeader>
                <UpdateMovie movieId={movie.id} />
              </DialogContent>
            </Dialog>
          </TooltipProvider>

          {/* Open */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={onOpenClick}>
                  <ExternalLink strokeWidth={0.75} className="w-4 lg:w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <span>{t("Open")}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </div>
    </Card>
  );
};

export default MovieListItem;
