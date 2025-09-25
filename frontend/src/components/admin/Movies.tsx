import { useMemo } from "react";
import NextAndPrevButton from "../NextAndPrevButton";
import { DataTable } from "../ui/DataTable";
import { columns as defaultColumns } from "./MovieListColumn";

// CORRECTED: The component is now a "dumb" component that receives all its data and handlers as props.
export default function Movies({ movies, currentPage, totalMovieCount, limit, setCurrentPage, fetchMovies }) {
  
  const handleSuccess = () => {
    fetchMovies(currentPage);
  };
  
  const columns = useMemo(() => defaultColumns.map(col => {
    if (col.id === 'actions') {
      return { ...col, meta: { onDeleteSuccess: handleSuccess, onUpdateSuccess: handleSuccess } };
    }
    return col;
  }), [handleSuccess]);

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