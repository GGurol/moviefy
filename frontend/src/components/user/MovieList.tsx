import GridContainer from "../GridContainer";
import { Link } from "react-router-dom";
import RatingStar from "../RatingStar";
import { getPoster } from "../../utils/helper";

const trimTitle = (text = "") => {
  if (text.length <= 20) return text;
  return text.substring(0, 20) + "...";
};

export default function MovieList({ title, movies = [] }) {
  if (!movies.length) return null;
  return (
    <div>
      {title && <h1 className="text-2xl font-semibold mb-5">{title}</h1>}
      <GridContainer>
        {movies.map((movie) => {
          return <ListItem key={movie.id} movie={movie} />;
        })}
      </GridContainer>
    </div>
  );
}

const ListItem = ({ movie }) => {
  const { id, responsivePosters, title, poster, reviews } = movie;
  return (
    <Link to={"/movie/" + id}>
      <div className="relative ">
        <img
          className="aspect-video object-cover w-full rounded-md"
          src={getPoster(responsivePosters) || poster}
          alt={title}
        />
        <h1
          className="text-white font-semibold absolute bottom-0 left-0 p-1"
          title={title}
        >
          {trimTitle(title)}
        </h1>
        <RatingStar
          rating={reviews.ratingAvg}
          className="absolute bottom-0 right-0 p-1 text-sm"
        />
      </div>
    </Link>
  );
};
