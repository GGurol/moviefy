import { useEffect, useState } from "react";
import { getRelatedMovies } from "../api/movie";
import { useNotification } from "../hooks";
import MovieList from "./user/MovieList";
import { toast } from "sonner";

function RelatedMovies({ movieId }) {
  const [movies, setMovies] = useState([]);

  const fetchRelatedMovies = async () => {
    const { error, movies } = await getRelatedMovies(movieId);
    if (error) return toast.error(error);

    setMovies([...movies]);
  };
  useEffect(() => {
    if (movieId) fetchRelatedMovies();
  }, [movieId]);

  return <MovieList title="Related Movies" movies={movies} />;
}

export default RelatedMovies;
