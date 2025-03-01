import { useEffect, useState } from "react";
import { getTopRatedMovies } from "../../api/movie";
import { useNotification } from "../../hooks";
import MovieList from "./MovieList";
import { toast } from "sonner";

function TopRatedWebSeries() {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async (signal) => {
    const { error, movies } = await getTopRatedMovies("Web Series", signal);
    if (error) return toast.error(error);

    setMovies([...movies]);
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchMovies(ac.signal);

    return () => {
      ac.abort();
    };
  }, []);

  return <MovieList movies={movies} title="Viewers choice (Web Series)" />;
}

export default TopRatedWebSeries;
