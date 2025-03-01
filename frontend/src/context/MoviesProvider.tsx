import { createContext, useState } from "react";
import { useNotification } from "../hooks";
import { getMovies } from "../api/movie";
import { toast } from "sonner";

export const MovieContext = createContext();

const limit = 10;
let currentPageNo = 0;

const MoviesProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [latestUploads, setLatestUploads] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);

  const fetchLatestUploads = async (qty = 5) => {
    const { error, movies } = await getMovies(0, qty);
    if (error) return toast.error(error);

    setLatestUploads([...movies]);
  };

  const fetchMovies = async (pageNo = currentPageNo) => {
    const { error, movies } = await getMovies(pageNo, limit);
    if (error) return toast.error(error);

    if (!movies.length) {
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }

    setMovies([...movies]);
  };

  const fetchNextPage = () => {
    if (reachedToEnd) return;
    currentPageNo += 1;
    fetchMovies(currentPageNo);
  };

  const fetchPrevPage = () => {
    if (currentPageNo <= 0) return;
    if (reachedToEnd) setReachedToEnd(false);

    currentPageNo -= 1;
    fetchMovies(currentPageNo);
  };

  return (
    <MovieContext.Provider
      value={{
        latestUploads,
        fetchLatestUploads,
        movies,
        fetchMovies,
        fetchNextPage,
        fetchPrevPage,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export default MoviesProvider;
