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
import { useTranslation } from "react-i18next";

// This constant should ideally come from an environment variable
const BACKEND_URL = "http://localhost:8000";

let currentPageNo = 0;
const limit = 9;
let totalPage;

export default function Actors() {
  const [actors, setActors] = useState([]);
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const { handleSearch, resetSearch, resultNotFound } = useSearch();
  const [noNext, setNoNext] = useState(false);
  const [noPrev, setNoPrev] = useState(false);
  const { t } = useTranslation();

  const fetchActors = async (pageNo) => {
    const { profiles, error, totalActorCount } = await getActors(pageNo, limit);
    if (error) return toast.error(t(error));
    if (currentPageNo === 0) {
      setNoPrev(true);
    }
    totalPage = Math.ceil(totalActorCount / limit);
    if (currentPageNo === totalPage - 1) setNoNext(true);

    if (!profiles.length) {
      currentPageNo = pageNo - 1;
      return setNoNext(true);
    }
    setActors([...profiles]);
  };

  const handleOnNextClick = () => {
    if (noNext) return;
    if (noPrev) setNoPrev(false);
    currentPageNo += 1;
    fetchActors(currentPageNo);
  };

  const handleOnPrevClick = () => {
    if (currentPageNo <= 0) {
      setNoPrev(true);
      return;
    }
    if (noNext) setNoNext(false);

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
    // const { error, message } = await deleteActor(selectedProfile.id);
    await new Promise((r) => setTimeout(r, 500));
    toast.error("Unauthorized");

    setBusy(false);

    // if (error) {
    //   return toast.error(t("Failed to delete an actor"));
    // }

    // toast.success(t(message));
    setOpenAlertModal(false);
    fetchActors(currentPageNo);
  };

  useEffect(() => {
    fetchActors(currentPageNo);
  }, []);

  return (
    <>
      <div className="p-2 sm:p-5">
        <div className="flex justify-end mb-5">
          <AppSearchForm
            onReset={handleSearchFormReset}
            onSubmit={handleOnSearchSubmit}
            placeholder={t("Search Actors...")}
            showResetIcon={results.length || resultNotFound}
          />
        </div>
        <NotFoundText text={t("No Actors Found")} visible={resultNotFound} />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
            noNext={noNext}
            noPrev={noPrev}
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
  const acceptedAboutLength = 70;
  const { t, i18n } = useTranslation();

  const handleOnMouseEnter = () => {
    setShowOptions(true);
  };
  const handleOnMouseLeave = () => {
    if (!open && !alertOpen) {
      setShowOptions(false);
    }
  };

  if (!profile) return null;

  const getName = (actor) => {
    const nm = `actors.${actor.id}.name`;
    let name = actor.name;
    if (i18n.exists(nm)) {
      name = t(nm);
    }
    if (name.length <= acceptedNameLength) return name;
    return name.substring(0, acceptedNameLength) + "...";
  };

  const getAbout = (about) => {
    if (about.length <= acceptedAboutLength) {
      return about;
    }
    return about.substring(0, acceptedAboutLength) + "...";
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
        className="flex rounded-md gap-2  hover:bg-muted relative h-40 lg:h-32 overflow-hidden"
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        <CardHeader className="p-0">
          <CardTitle className="h-40 w-32 lg:w-32 lg:h-32">
            {/* CORRECTED: Prepend the backend URL to the avatar path */}
            <img
              src={avatar ? `${BACKEND_URL}${avatar}` : "default-avatar.png"} // Added a fallback
              alt={name}
              className="w-full h-full aspect-square object-cover rounded-l-md"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="px-1 py-1 flex flex-col gap-1">
          <div className="capitalize">{getName(profile)}</div>
          <CardDescription> {getAbout(about)}</CardDescription>
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
                  <DialogTitle>{t("Update Actor")}</DialogTitle>
                  <DialogDescription>
                    {t("Submit to update an actor.")}
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
                  <AlertDialogTitle>{t("Are you sure?")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("This action will remove this actor permanently!")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    disabled={busy}
                    onClick={() => setOpenAlertModal(false)}
                  >
                    {t("Cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      handleOnDeleteConfirm(setOpenAlertModal);
                    }}
                    disabled={busy}
                    className={buttonVariants({ variant: "destructive" })}
                  >
                    <span className="w-12 flex items-center justify-center">
                      {busy ? <Loader className="animate-spin" /> : t("Delete")}
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