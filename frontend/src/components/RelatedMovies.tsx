import { useEffect, useState } from "react";
import { getRelatedMovies } from "../api/movie";
import { useNotification } from "../hooks";
import MovieList from "./user/MovieList";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function RelatedMovies({ movieId }) {
  const [movies, setMovies] = useState([]);
  const { t } = useTranslation();

  const fetchRelatedMovies = async () => {
    const { error, movies } = await getRelatedMovies(movieId);
    if (error) return toast.error(t(error));

    setMovies([...movies]);
  };
  useEffect(() => {
    if (movieId) fetchRelatedMovies();
  }, [movieId]);

  return <MovieList title={t("Related Movies")} movies={movies} />;
}
