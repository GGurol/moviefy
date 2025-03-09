import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchPublicMovies } from "../../api/movie";
import NotFoundText from "../NotFoundText";
import MovieList from "./MovieList";
import Container from "../Container";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

function SearchMovies() {
  const [movies, setMovies] = useState([]);
  const [resultNotFound, setResultNotFound] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();

  const query = searchParams.get("title");

  const searchMovies = async (val) => {
    const { error, results } = await searchPublicMovies(val);
    if (error) return toast.error(t(error));

    if (!results.length) {
      setResultNotFound(true);
      return setMovies([]);
    }

    setResultNotFound(false);
    setMovies([...results]);
  };

  useEffect(() => {
    if (query.trim()) {
      searchMovies(query);
    }
  }, [query]);

  return (
    <div className=" min-h-screen py-8">
      <Container className="px-2 xl:p-0">
        <Button
          variant="link"
          className="mb-4 p-0"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft />
          <span>{t("Go back")}</span>
        </Button>
        <NotFoundText text={t("Record not found")} visible={resultNotFound} />
        <MovieList movies={movies} />
      </Container>
    </div>
  );
}

export default SearchMovies;
