import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPublicMovies } from "../../api/movie";
import { useNotification } from "../../hooks";
import NotFoundText from "../NotFoundText";
import MovieList from "./MovieList";
import Container from "../Container";
import { toast } from "sonner";

function SearchMovies() {
  const [movies, setMovies] = useState([]);
  const [resultNotFound, setResultNotFound] = useState(false);

  const [searchParams] = useSearchParams();

  const query = searchParams.get("title");

  const searchMovies = async (val) => {
    const { error, results } = await searchPublicMovies(val);
    if (error) return toast.error(error);

    if (!results.length) {
      setResultNotFound(true);
      return setMovies([]);
    }

    setResultNotFound(false);
    setMovies([...results]);
  };

  useEffect(() => {
    if (query.trim()) searchMovies(query);
  }, [query]);

  return (
    <div className=" min-h-screen py-8">
      <Container className="px-2 xl:p-0">
        <NotFoundText text="Record not found!" visible={resultNotFound} />
        <MovieList movies={movies} />
      </Container>
    </div>
  );
}

export default SearchMovies;
