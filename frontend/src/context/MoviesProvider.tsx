import { createContext, useState, useCallback } from "react";
import { getMovies, getLatestUploads } from "../api/movie";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const MovieContext = createContext(null);

const limit = 6;

const MoviesProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [latestUploads, setLatestUploads] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalMovieCount, setTotalMovieCount] = useState(0);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const { t } = useTranslation();

  const fetchLatestUploads = useCallback(async (qty = 5) => {
    const { error, movies } = await getLatestUploads(qty);
    if (error) return toast.error(t(error));
    setLatestUploads(movies);
  }, [t]);

  const fetchMovies = useCallback(async (pageNo) => {
    const { error, movies: newMovies, totalMovieCount: newTotal } = await getMovies(pageNo, limit);
    if (error) return toast.error(t(error));

    if (!newMovies.length && pageNo > 0) {
      setCurrentPage(pageNo - 1);
      return setReachedToEnd(true);
    }

    setMovies(newMovies);
    setTotalMovieCount(newTotal || 0);
    setCurrentPage(pageNo);
    setReachedToEnd(false);
  }, [t]);

  const fetchNextPage = () => {
    if ((currentPage + 1) * limit >= totalMovieCount) return;
    fetchMovies(currentPage + 1);
  };

  const fetchPrevPage = () => {
    if (currentPage <= 0) return;
    fetchMovies(currentPage - 1);
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        latestUploads,
        fetchLatestUploads,
        fetchMovies,
        fetchNextPage,
        fetchPrevPage,
        totalMovieCount,
        currentPage,
        limit
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export default MoviesProvider;