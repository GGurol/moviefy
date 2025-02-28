import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteActor, getActors, searchActor } from "../../api/actor";
import { useNotification, useSearch } from "../../hooks";
import NextAndPrevButton from "../NextAndPrevButton";
import NotFoundText from "../NotFoundText";
import AppSearchForm from "../form/AppSearchForm";
import UpdateActor from "../modals/UpdateActor";
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
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

let currentPageNo = 0;
const limit = 10;

export default function Actors() {
  const [actors, setActors] = useState([]);
  const [results, setResults] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const { updateNotification } = useNotification();
  const { handleSearch, resetSearch, resultNotFound } = useSearch();

  const fetchActors = async (pageNo) => {
    const { profiles, error } = await getActors(pageNo, limit);
    if (error) return updateNotification("error", error);

    if (!profiles.length) {
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }
    setActors([...profiles]);
  };

  const handleOnNextClick = () => {
    if (reachedToEnd) return;
    currentPageNo += 1;
    fetchActors(currentPageNo);
  };

  const handleOnPrevClick = () => {
    if (currentPageNo <= 0) return;
    if (reachedToEnd) setReachedToEnd(false);

    currentPageNo -= 1;
    fetchActors(currentPageNo);
  };

  const handleOnEditClick = (profile) => {
    setShowUpdateModal(true);
    setSelectedProfile(profile);
  };

  const hideUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleOnSearchSubmit = (value) => {
    handleSearch(searchActor, value, setResults);
  };

  const handleSearchFormReset = () => {
    resetSearch();
    setResults([]);
  };

  const handleOnActorUpdateSuccess = (profile) => {
    const updatedActors = actors.map((actor) => {
      if (profile.id === actor.id) {
        return profile;
      }
      return actor;
    });

    setActors([...updatedActors]);
  };

  const handleOnDeleteClick = (profile) => {
    setSelectedProfile(profile);
  };

  const handleOnDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteActor(selectedProfile.id);
    setBusy(false);

    if (error) return updateNotification("error", error);

    updateNotification("success", message);
    hideConfirmModal();
    fetchActors(currentPageNo);
  };

  const hideConfirmModal = () => setShowConfirmModal(false);

  useEffect(() => {
    fetchActors(currentPageNo);
  }, []);

  return (
    <>
      <div className="p-5">
        <div className="flex justify-end mb-5">
          <AppSearchForm
            onReset={handleSearchFormReset}
            onSubmit={handleOnSearchSubmit}
            placeholder="Search Actors..."
            showResetIcon={results.length || resultNotFound}
          />
        </div>
        <NotFoundText text="No Actors Found" visible={resultNotFound} />

        <div className="grid grid-cols-4 gap-5">
          {results.length || resultNotFound
            ? results.map((actor) => (
                <ActorProfile
                  profile={actor}
                  key={actor.id}
                  onEditClick={() => handleOnEditClick(actor)}
                  onDeleteClick={() => handleOnDeleteClick(actor)}
                  selectedProfile={selectedProfile}
                  handleOnActorUpdateSuccess={handleOnActorUpdateSuccess}
                />
              ))
            : actors.map((actor) => (
                <ActorProfile
                  profile={actor}
                  key={actor.id}
                  onEditClick={() => handleOnEditClick(actor)}
                  onDeleteClick={() => handleOnDeleteClick(actor)}
                  selectedProfile={selectedProfile}
                  handleOnActorUpdateSuccess={handleOnActorUpdateSuccess}
                />
              ))}
        </div>

        {!results.length && !resultNotFound ? (
          <NextAndPrevButton
            className="mt-5"
            onNextClick={handleOnNextClick}
            onPrevClick={handleOnPrevClick}
          />
        ) : null}
      </div>
    </>
  );
}

const ActorProfile = ({
  profile,
  onEditClick,
  onDeleteClick,
  selectedProfile,
  handleOnActorUpdateSuccess,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const acceptedNameLength = 15;

  const handleOnMouseEnter = () => {
    setShowOptions(true);
  };
  const handleOnMouseLeave = () => {
    if (!open && !alertOpen) {
      setShowOptions(false);
    }
  };

  if (!profile) return null;

  const getName = (name) => {
    if (name.length <= acceptedNameLength) return name;
    return name.substring(0, acceptedNameLength) + "..";
  };
  const { name, avatar, about = "" } = profile;

  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const setCloseModal = (val) => {
    setOpen(val);
    if (val === false) {
      setShowOptions(false);
    }
  };
  const setCloseAlertModal = (val) => {
    setAlertOpen(val);
    if (val === false) {
      setShowOptions(false);
    }
  };

  return (
    <>
      <Card
        className="flex rounded-md gap-2  hover:bg-muted relative h-20 overflow-hidden"
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        <CardHeader className="p-0">
          <CardTitle className="w-20">
            <img
              src={avatar}
              alt={name}
              className="w-full aspect-square object-cover rounded-l-md"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 py-1">
          <div className="capitalize">{getName(name)}</div>
          <CardDescription> {about.substring(0, 50)}</CardDescription>
        </CardContent>
        {showOptions && (
          <div className="absolute inset-0 backdrop-blur-md flex justify-center items-center space-x-5">
            <Dialog open={open} onOpenChange={setCloseModal}>
              <DialogTrigger className="gap-4" asChild>
                <Button
                  onClick={onEditClick}
                  className="px-3 py-1 hover:opacity-60 transition-all duration-200"
                  type="button"
                  variant="default"
                >
                  <Pencil />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="w-[500px]"
                onInteractOutside={(e) => {
                  e.preventDefault();
                }}
              >
                <DialogHeader>
                  <DialogTitle>Update Actor</DialogTitle>
                  <DialogDescription>
                    Submit to update an actor.
                  </DialogDescription>
                </DialogHeader>
                <UpdateActor
                  setOpen={setOpen}
                  initialState={selectedProfile}
                  onSuccess={handleOnActorUpdateSuccess}
                />
              </DialogContent>
            </Dialog>

            <AlertDialog open={alertOpen} onOpenChange={setCloseAlertModal}>
              <AlertDialogTrigger asChild>
                <Button
                  onClick={onDeleteClick}
                  className="px-3 py-1 hover:opacity-60 transition-all duration-200"
                  type="button"
                  variant="destructive"
                >
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will remove this actor permanently!
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {}}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </Card>
    </>
  );
};
