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

const MovieListItem = ({ movie, afterDelete, afterUpdate }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const navigate = useNavigate();

  const handleOnDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteMovie(movie.id);
    setBusy(false);

    if (error) return toast.error(error);

    hideConfirmModal();
    toast.success(message);
    afterDelete(movie);
  };

  const handleOnEditClick = () => {
    setShowUpdateModal(true);
    setSelectedMovieId(movie.id);
    console.log(movie);
  };

  const handleOnOpenClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleOnUpdate = (movie) => {
    afterUpdate(movie);
    setShowUpdateModal(false);
    setSelectedMovieId(null);
  };

  const displayConfirmModal = () => setShowConfirmModal(true);
  const hideConfirmModal = () => setShowConfirmModal(false);

  const handleDelete = async () => {
    setBusy(true);
    const { error, message } = await deleteMovie(movie.id);
    setBusy(false);

    if (error) return toast.error(error);

    toast.success(message);
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
      />
      <div className="p-0">
        <UpdateMovie
          movieId={selectedMovieId}
          visible={showUpdateModal}
          onSuccess={handleOnUpdate}
        />
      </div>
    </>
  );
};

const MovieCard = ({
  movie,
  onDeleteClick,
  onOpenClick,
  onEditClick,
  handleDelete,
}) => {
  const { poster, title, responsivePosters, genres = [], status } = movie;
  const [open, setOpen] = useState(false);

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
      <div className="flex items-center justify-between w-full">
        <CardContent className="p-1 overflow-auto w-72">
          <h1 className="text-lg font-semibold capitalize">{title}</h1>
          <div className="space-x-1  pb-2">
            {genres.map((g, index) => {
              return (
                <span key={g + index} className="text-xs text-muted-foreground">
                  {g}
                </span>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="p-1">
          {/* Status */}
          {status === "public" ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <FolderOpen strokeWidth={0.75} size={20} />
                </TooltipTrigger>
                <TooltipContent>
                  <span>Public</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <FolderLock strokeWidth={0.75} size={20} />
                </TooltipTrigger>
                <TooltipContent>
                  <span>Private</span>
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
                    setOpen(true);
                  }}
                >
                  <Trash2 strokeWidth={0.75} size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <span>Delete</span>
              </TooltipContent>
            </Tooltip>
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will remove this movie permanently!
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TooltipProvider>

          {/* Edit */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={onEditClick}>
                  <Pencil strokeWidth={0.75} size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <span>Edit</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Open */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={onOpenClick}>
                  <ExternalLink strokeWidth={0.75} size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <span>Open</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </div>
    </Card>
  );
};

export default MovieListItem;
