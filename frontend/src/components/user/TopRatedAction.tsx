import { useEffect, useState } from "react";
import { getTopRatedMovies } from "../../api/movie";
import MovieList from "./MovieList";
import { toast } from "sonner";

export default function TopRatedAction() {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    const { error, movies } = await getTopRatedMovies("Action");
    if (error) return toast.error(error);
    const sorted = movies.sort(
      (a, b) => Number(b.reviews.ratingAvg) - Number(a.reviews.ratingAvg)
    );

    setMovies([...sorted]);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return <MovieList movies={movies} title="Viewers choice (Action)" />;
}
