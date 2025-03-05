import { useEffect, useState } from "react";
import { getSingleMovie } from "../../api/movie";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks";
import Container from "../Container";
import RatingStar from "../RatingStar";
import RelatedMovies from "../RelatedMovies";
import AddRatingModal from "../modals/AddRatingModal";
import CustomButtonLink from "../CustomButtonLink";
import ProfileModal from "../modals/ProfileModal";
import { convertReviewCount } from "../../utils/helper";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";

const convertDate = (date = "") => {
  return date.split("T")[0];
};

interface SingleMovieObj {
  id: string;
  title: string;
  storyLine: string;
  cast: [];
  writer: "";
  director: string;
  releaseDate: string;
  genres: [];
  tags: [];
  language: string;
  poster: string;
  video: string;
  type: string;
  reviews: {};
}

export default function SingleMovie() {
  const [ready, setReady] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState({});
  const [movie, setMovie] = useState<SingleMovieObj>({
    id: "",
    title: "",
    storyLine: "",
    cast: [],
    writer: "",
    director: "",
    releaseDate: "",
    genres: [],
    tags: [],
    language: "",
    poster: "",
    video: "",
    type: "",
    reviews: {},
  });

  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;
  const navigate = useNavigate();

  const { movieId } = useParams();

  const fetchMovie = async () => {
    const { error, movie }: { error: string; movie: SingleMovieObj } =
      await getSingleMovie(movieId);
    if (error) {
      return toast.error(error);
    }

    setReady(true);
    setMovie(movie);
  };

  const handleOnRateMovie = () => {
    if (!isLoggedIn) {
      return navigate("/auth/signin");
    }
    setShowRatingModal(true);
  };

  const hideRatingModal = () => {
    setShowRatingModal(false);
  };

  const handleOnRatingSuccess = (reviews) => {
    // console.log(reviews);
    setMovie({ ...movie, reviews: { ...reviews } });
  };

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setShowProfileModal(true);
  };

  const hideProfileModal = () => {
    setShowProfileModal(false);
  };

  useEffect(() => {
    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  if (!ready)
    return (
      <div className=" h-screen flex justify-center items-center dark:bg-primary ">
        <p className="text-light-subtle dark:text-dark-subtle animate-pulse">
          Please wait
        </p>
      </div>
    );

  const {
    id,
    video,
    poster,
    title,
    storyLine,
    language,
    releaseDate,
    type,
    reviews,
    director,
    writer,
    cast,
    genres,
  } = movie;

  return (
    <div className=" min-h-screen pb-10">
      <Container className="xl:px-0 px-2">
        <div className=" bg-muted rounded-md">
          <video
            title={title}
            poster={poster}
            controls
            src={video}
            muted
            width={1200}
            height={720}
            className="w-full mx-auto mt-5 p-4 bg-muted rounded-md"
          />
          <h1 className="pl-4 pb-4 font-semibold">{title}</h1>
        </div>

        <div className="mt-10 bg-muted p-4 rounded-md">
          <div className="space-y-3">
            {/* <ListWithLabel label="Description:">
              <CustomButtonLink label={storyLine} clickable={false} />
            </ListWithLabel> */}
            <p className="text-muted-foreground">{storyLine}</p>

            <ListWithLabel label="Director:">
              <CustomButtonLink
                label={director.name}
                onClick={() => handleProfileClick(director)}
              />
            </ListWithLabel>

            <ListWithLabel label="Writer:">
              <CustomButtonLink
                label={writer.name}
                onClick={() => handleProfileClick(writer)}
              />
            </ListWithLabel>

            <ListWithLabel label="Language:">
              <CustomButtonLink label={language} clickable={false} />
            </ListWithLabel>

            <ListWithLabel label="Release Date:">
              <CustomButtonLink
                label={convertDate(releaseDate)}
                clickable={false}
              />
            </ListWithLabel>

            <ListWithLabel label="Genres:">
              {genres.map((g) => (
                <CustomButtonLink
                  label={<Badge>{g}</Badge>}
                  key={g}
                  clickable={false}
                />
              ))}
            </ListWithLabel>

            <ListWithLabel label="Type:">
              <CustomButtonLink label={type} clickable={false} />
            </ListWithLabel>
          </div>
        </div>

        <div className="mt-10 bg-muted p-4 rounded-md">
          <CastProfiles cast={cast} handleProfileClick={handleProfileClick} />
        </div>

        <div className="mt-10 bg-muted p-4 rounded-md flex flex-col items-center">
          {/* <div className="flex flex-col items-end"> */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <p>Rating:</p>
            <RatingStar rating={reviews.ratingAvg} />
          </div>

          <CustomButtonLink
            label={convertReviewCount(reviews.reviewCount) + " Reviews"}
            onClick={() => navigate("/movie/reviews/" + id)}
          />
          <CustomButtonLink
            label="Rate The Movie"
            onClick={handleOnRateMovie}
          />
        </div>
        {/* </div> */}
        <div className="mt-10 bg-muted p-4 rounded-md">
          <RelatedMovies movieId={movieId} />
        </div>
      </Container>

      <ProfileModal
        visible={showProfileModal}
        onClose={hideProfileModal}
        profileId={selectedProfile.id}
      />

      <AddRatingModal
        visible={showRatingModal}
        onClose={hideRatingModal}
        onSuccess={handleOnRatingSuccess}
      />
    </div>
  );
}

const ListWithLabel = ({ label, children }) => {
  return (
    <div className="flex space-x-3 items-center text-muted-foreground">
      <p className="">{label}</p>
      {children}
    </div>
  );
};

const CastProfiles = ({ cast, handleProfileClick }) => {
  return (
    <div className="">
      <p className="text-muted-foreground mb-3">Leader Actors:</p>
      <div className="flex flex-wrap gap-4 ">
        {cast.map((e) => {
          return (
            <div
              key={e.id}
              className="p-2 w-36 max-h-56 flex flex-col items-center text-center mb-4 pb-2 border border-primary-foreground shadow-md rounded-sm overflow-hidden gap-2 cursor-pointer"
              onClick={() => handleProfileClick(e)}
            >
              <img
                className="w-full aspect-square object-cover rounded-t-sm "
                src={e.avatar}
                alt=""
              />
              <p className="text-sm ">{e.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
