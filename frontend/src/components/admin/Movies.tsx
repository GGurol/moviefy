import { useEffect, useState } from "react";
import MovieListItem from "../MovieListItem";
import { deleteMovie, getMovieForUpdate, getMovies } from "../../api/movie";
import { useMovies, useNotification } from "../../hooks";
import NextAndPrevButton from "../NextAndPrevButton";
import UpdateMovie from "../modals/UpdateMovie";
import ConfirmModal from "../modals/ConfirmModal";
import { DataTable } from "../ui/DataTable";
import { columns } from "./MovieListColumn";

const limit = 2;
let currentPageNo = 0;

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const { updateNotification } = useNotification();

  const {
    fetchMovies,
    movies: newMovies,
    fetchNextPage,
    fetchPrevPage,
  } = useMovies();

  useEffect(() => {
    fetchMovies(currentPageNo);
  }, []);

  // const hideUpdateForm = () => setShowUpdateModal(false);
  // const hideConfirmModal = () => setShowConfirmModal(false);

  const handleUIUpdate = () => fetchMovies();
  console.log(newMovies);

  return (
    <>
      <DataTable columns={columns} data={newMovies} />
    </>
  );

  // return (
  //   <>
  //     <div className="space-y-3 p-5">
  //       {newMovies.map((movie) => {
  //         return (
  //           <MovieListItem
  //             movie={movie}
  //             key={movie.id}
  //             afterDelete={handleUIUpdate}
  //             afterUpdate={handleUIUpdate}
  //             // onEditClick={() => handleOnEditClick(movie.id)}
  //             // onDeleteClick={() => handleOnDeleteClick(movie)}
  //           />
  //         );
  //       })}
  //       <NextAndPrevButton
  //         className="mt-5"
  //         onNextClick={fetchNextPage}
  //         onPrevClick={fetchPrevPage}
  //       />
  //     </div>
  //   </>
  // );
}
