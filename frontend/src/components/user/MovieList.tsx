import GridContainer from "../GridContainer";
import { Link } from "react-router-dom";
import RatingStar from "../RatingStar";
import { getPoster } from "../../utils/helper";
import { useTranslation } from "react-i18next";

const trimTitle = (text = "") => {
  if (text.length <= 25) return text;
  return text.substring(0, 25) + "...";
};

export default function MovieList({ title, movies = [] }) {
  if (!movies.length) return null;

  return (
    <div>
      {title && (
        <h1 className="text-base sm:text-lg text-muted-foreground font-semibold mb-2">
          {title}
        </h1>
      )}
      <GridContainer>
        {movies.map((movie) => {
          return <ListItem key={movie.id} movie={movie} />;
        })}
      </GridContainer>
    </div>
  );
}

const ListItem = ({ movie }) => {
  const { t, i18n } = useTranslation();

  const { id, responsivePosters, title, poster, reviews } = movie;
  const getTitle = (movie) => {
    const title = `movies.${movie.id}.title`;
    if (i18n.exists(title)) {
      return trimTitle(t(title));
    }
    return trimTitle(movie.title);
  };
  return (
    <Link to={"/movie/" + id}>
      <div className="relative ">
        <img
          className="aspect-video object-cover w-full rounded-md"
          src={getPoster(responsivePosters) || poster}
          alt={title}
        />
        <h1
          className="text-white text-sm font-semibold absolute bottom-0 left-0 p-1 w-4/5"
          title={title}
        >
          {getTitle(movie)}
        </h1>
        <RatingStar
          rating={reviews.ratingAvg}
          className="absolute bottom-0 right-0 p-1 text-sm"
        />
      </div>
    </Link>
  );
};
