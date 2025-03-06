import { createContext, useState } from "react";
import { useNotification } from "../hooks";
import { getMovies } from "../api/movie";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const MovieContext = createContext();

let currentPageNo = 0;
const limit = 4;

const MoviesProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [latestUploads, setLatestUploads] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const { t } = useTranslation();

  const fetchLatestUploads = async (qty = 5) => {
    const { error, movies } = await getMovies(0, qty);
    if (error) return toast.error(t(error));

    setLatestUploads([...movies]);
  };

  const fetchMovies = async (pageNo) => {
    const { error, movies } = await getMovies(pageNo, limit);
    if (error) return toast.error(t(error));

    if (!movies.length) {
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }

    setMovies([...movies]);
  };

  const fetchNextPage = (pageNo) => {
    if (reachedToEnd) return;
    pageNo += 1;
    fetchMovies(pageNo);
    console.log("next", pageNo);
  };

  const fetchPrevPage = (pageNo) => {
    if (pageNo <= 0) return;
    if (reachedToEnd) setReachedToEnd(false);

    pageNo -= 1;
    console.log("prev", pageNo);

    fetchMovies(pageNo);
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
