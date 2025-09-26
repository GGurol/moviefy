import { useEffect, useState, useMemo, useCallback } from "react";
import { getMovies } from "../../api/movie";
import NextAndPrevButton from "../NextAndPrevButton";
import { DataTable } from "../ui/DataTable";
import { columns } from "./MovieListColumn"; // Use the simple, static import
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const limit = 6;

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalMovieCount, setTotalMovieCount] = useState(0);
  const { t } = useTranslation();

  const fetchMovies = useCallback(async (pageNo) => {
    const { error, movies: newMovies, totalMovieCount: newTotal } = await getMovies(pageNo, limit);
    if (error) return toast.error(t(error));
    
    setMovies(newMovies || []);
    setTotalMovieCount(newTotal || 0);
  }, [t]);

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage, fetchMovies]);

  const handleSuccess = () => {
    fetchMovies(currentPage);
  };
  
  const fetchNextPage = () => {
    const totalPages = Math.ceil(totalMovieCount / limit);
    if (currentPage < totalPages - 1) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const fetchPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const noPrev = currentPage <= 0;
  const noNext = (currentPage + 1) * limit >= totalMovieCount;

  return (
    <div className="mx-2 mt-3 sm:mx-5 sm:mt-5">
      <DataTable 
        columns={columns} 
        data={movies}
        // CORRECTED: The meta object is now passed as a direct prop to the DataTable
        meta={{
          onDeleteSuccess: handleSuccess,
          onUpdateSuccess: handleSuccess,
        }}
      />
      <NextAndPrevButton
        className="mt-5"
        onNextClick={fetchNextPage}
        onPrevClick={fetchPrevPage}
        noNext={noNext}
        noPrev={noPrev}
      />
    </div>
  );
}