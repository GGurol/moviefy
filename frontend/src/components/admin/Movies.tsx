import { useMemo } from "react";
import NextAndPrevButton from "../NextAndPrevButton";
import { DataTable } from "../ui/DataTable";
import { columns } from "./MovieListColumn"; // Use the simple, static import

// The component is now a "dumb" component that receives all its data and handlers as props.
export default function Movies({ movies, currentPage, totalMovieCount, limit, setCurrentPage, fetchMovies }) {
  
  // This is the refresh function that will be passed down
  const handleSuccess = () => {
    fetchMovies(currentPage);
  };
  
  const fetchNextPage = () => {
    const totalPages = Math.ceil(totalMovieCount / limit);
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const fetchPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const noPrev = currentPage <= 0;
  const noNext = (currentPage + 1) * limit >= totalMovieCount;

  return (
    <div className="mx-2 mt-3 sm:mx-5 sm:mt-5">
      <DataTable 
        columns={columns} 
        data={movies}
        // CORRECTED: Pass the meta prop directly to the DataTable,
        // just like we did in Actors.tsx
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