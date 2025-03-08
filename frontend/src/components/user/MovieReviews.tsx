import { useNavigate, useParams } from "react-router-dom";
import Container from "../Container";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import CustomButtonLink from "../CustomButtonLink";
import RatingStar from "../RatingStar";
import { useEffect, useState } from "react";
import { deleteReview, getReviewByMovie } from "../../api/review";
import { useAuth } from "../../hooks";
import ConfirmModal from "../modals/ConfirmModal";
import NotFoundText from "../NotFoundText";
import EditRatingModal from "../modals/EditRatingModal";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const getNameInitial = (name = "") => {
  return name[0].toUpperCase();
};

export default function MovieReviews() {
  const [reviews, setReviews] = useState([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [profileOwnersReview, setProfileOwnersReview] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const { t } = useTranslation();

  const { movieId } = useParams();
  const navigate = useNavigate();
  const { authInfo } = useAuth();
  const profileId = authInfo.profile?.id;

  const fetchReviews = async () => {
    const { error, movie } = await getReviewByMovie(movieId);

    if (error) return toast.error(t(error));

    setReviews([...movie.reviews]);
    setMovieTitle(movie.title);
  };

  const findProfileOwnersReview = () => {
    if (profileOwnersReview) return setProfileOwnersReview(null);

    const matched = reviews.find((review) => review.owner.id === profileId);
    if (!matched) return toast.error(t("You don't have any review"));

    setProfileOwnersReview(matched);
  };

  const handleOnEditClick = () => {
    const { id, content, rating } = profileOwnersReview;
    setSelectedReview({
      id,
      content,
      rating,
    });

    setShowEditModal(true);
  };

  const handleDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteReview(profileOwnersReview.id);
    setBusy(false);
    if (error) return toast.error(t(error));

    toast.success(t(message));

    const updatedReviews = reviews.filter(
      (r) => r.id !== profileOwnersReview.id
    );
    setReviews([...updatedReviews]);
    setProfileOwnersReview(null);
    hideConfirmModal();
  };

  const handleOnReviewUpdate = (review) => {
    const updatedReview = {
      ...profileOwnersReview,
      rating: review.rating,
      content: review.content,
    };

    setProfileOwnersReview({ ...updatedReview });

    const newReviews = reviews.map((r) => {
      if (r.id === updatedReview.id) return updatedReview;
      return r;
    });

    setReviews([...newReviews]);
  };

  const displayConfirmModal = () => setShowConfirmModal(true);
  const hideConfirmModal = () => setShowConfirmModal(false);
  const hideEditModal = () => {
    setShowEditModal(false);
    setSelectedReview(null);
  };

  useEffect(() => {
    if (movieId) fetchReviews();
  }, [movieId]);

  return (
    <div className=" min-h-screen pb-10">
      <Container className="xl:px-0 px-2 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold space-x-4">
            <span className="font-normal text-muted-foreground">
              Reviews for:
            </span>
            <span className="">{movieTitle}</span>
          </h1>

          <div className="flex gap-4">
            <CustomButtonLink
              label={"Back"}
              onClick={() => navigate(`/movie/${movieId}`)}
            />
            {profileId ? (
              <CustomButtonLink
                label={profileOwnersReview ? "View All" : "My review"}
                onClick={findProfileOwnersReview}
              />
            ) : null}
          </div>
        </div>

        <NotFoundText text="No Reviews!" visible={!reviews.length} />

        {profileOwnersReview ? (
          <div className="mt-3">
            <ReviewCard review={profileOwnersReview} />
            <div className="flex gap-3 text-xl pt-2 ">
              <Button
                onClick={displayConfirmModal}
                type="button"
                className="px-4"
                variant="ghost"
              >
                <Trash2 />
              </Button>
              <Button
                onClick={handleOnEditClick}
                type="button"
                className="px-4"
                variant="ghost"
              >
                <Pencil />
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-4 justify-center">
            {reviews.map((review) => (
              <ReviewCard review={review} key={review.id} />
            ))}
          </div>
        )}
      </Container>

      <ConfirmModal
        title="Are you sure?"
        subtitle="This action will remove this review permanently"
        busy={busy}
        visible={showConfirmModal}
        onConfirm={handleDeleteConfirm}
        onCancel={hideConfirmModal}
      />

      <EditRatingModal
        visible={showEditModal}
        initialState={selectedReview}
        onSuccess={handleOnReviewUpdate}
        onClose={hideEditModal}
      />
    </div>
  );
}

const ReviewCard = ({ review }) => {
  if (!review) return null;
  const { owner, content, rating } = review;
  return (
    <Card className="w-96 h-44 overflow-auto">
      <CardHeader className="flex flex-row gap-6 py-2 px-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-full border-2  text-xl select-none">
          {getNameInitial(owner.name)}
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <h1 className="font-semibold  text-muted-foreground capitalize">
            {owner.name}
          </h1>
          <RatingStar rating={rating} />
        </div>
      </CardHeader>
      <CardContent className="pb-2 px-4">
        <div>
          <p className="text-sm">{content}</p>
        </div>
      </CardContent>
    </Card>
  );
};
