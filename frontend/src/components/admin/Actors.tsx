import { Loader, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteActor, getActors, searchActor } from "../../api/actor";
import { useSearch } from "../../hooks";
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
import { Button, buttonVariants } from "../ui/button";
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
const limit = 12;

export default function Actors() {
  const [actors, setActors] = useState([]);
  const [results, setResults] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const { handleSearch, resetSearch, resultNotFound } = useSearch();

  const fetchActors = async (pageNo) => {
    const { profiles, error } = await getActors(pageNo, limit);
    if (error) return toast.error(error);

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
    setSelectedProfile(profile);
  };

  const handleOnDeleteClick = (profile) => {
    setSelectedProfile(profile);
  };

  const handleOnSearchSubmit = (value) => {
    handleSearch(searchActor, value, [], setResults);
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

  const handleOnDeleteConfirm = async (setOpenAlertModal) => {
    setBusy(true);
    const { error, message } = await deleteActor(selectedProfile.id);
    setBusy(false);

    if (error) {
      return toast.error("Failed to delete an actor.");
    }

    toast.success(message);
    setOpenAlertModal(false);
    fetchActors(currentPageNo);
  };

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

        <div className="grid grid-cols-3 gap-5">
          {results.length || resultNotFound
            ? results.map((actor) => (
                <ActorProfile
                  profile={actor}
                  key={actor.id}
                  onEditClick={() => handleOnEditClick(actor)}
                  onDeleteClick={() => handleOnDeleteClick(actor)}
                  selectedProfile={selectedProfile}
                  handleOnActorUpdateSuccess={handleOnActorUpdateSuccess}
                  handleOnDeleteConfirm={handleOnDeleteConfirm}
                  busy={busy}
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
                  handleOnDeleteConfirm={handleOnDeleteConfirm}
                  busy={busy}
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
  handleOnDeleteConfirm,
  busy,
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
  const setOpenModal = (val) => {
    setOpen(val);
    if (val === false) {
      setShowOptions(false);
    }
  };
  const setOpenAlertModal = (val) => {
    setAlertOpen(val);
    if (val === false) {
      setShowOptions(false);
    }
  };

  return (
    <>
      <Card
        className="flex rounded-md gap-2  hover:bg-muted relative h-32 overflow-hidden"
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        <CardHeader className="p-0">
          <CardTitle className="w-32 h-32">
            <img
              src={avatar}
              alt={name}
              // className="w-full aspect-square object-cover rounded-l-md"
              className="w-full h-full aspect-square object-cover rounded-l-md"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="px-1 py-1 flex flex-col gap-1">
          <div className="capitalize">{getName(name)}</div>
          <CardDescription> {about.substring(0, 120)}</CardDescription>
        </CardContent>
        {showOptions && (
          <div className="absolute inset-0 backdrop-blur-md flex justify-center items-center space-x-5">
            <Dialog open={open} onOpenChange={setOpenModal}>
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
                  setOpen={setOpenModal}
                  initialState={selectedProfile}
                  onSuccess={handleOnActorUpdateSuccess}
                />
              </DialogContent>
            </Dialog>

            <AlertDialog open={alertOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  onClick={() => {
                    onDeleteClick();
                    setOpenAlertModal(true);
                  }}
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
                  <AlertDialogCancel
                    disabled={busy}
                    onClick={() => setOpenAlertModal(false)}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      handleOnDeleteConfirm(setOpenAlertModal);
                    }}
                    disabled={busy}
                    className={buttonVariants({ variant: "destructive" })}
                  >
                    <span className="w-12 flex items-center justify-center">
                      {busy ? <Loader className="animate-spin" /> : "Delete"}
                    </span>
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
