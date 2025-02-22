import { useEffect, useState } from "react";
import { deleteMovie, getMovieForUpdate, getMovies } from "../api/movie";
import { useMovies, useNotification } from "../hooks";
import MovieListItem from "./MovieListItem";
import ConfirmModal from "./modals/ConfirmModal";
import UpdateMovie from "./modals/UpdateMovie";

const pageNo = 0;
const limit = 5;

function LatestUploads() {
  const [movies, setMovies] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [busy, setBusy] = useState(false);

  const { updateNotification } = useNotification();

  const { fetchLatestUploads, latestUploads } = useMovies();

  // const fetchLatestUploads = async () => {
  //   const { error, movies } = await getMovies(pageNo, limit);
  //   if (error) return updateNotification('error', error);

  //   setMovies([...movies]);
  // };

  // const handleOnEditClick = async ({ id }) => {
  //   const { error, movie } = await getMovieForUpdate(id);
  //   setShowUpdateModal(true);

  //   if (error) return updateNotification('error', error);

  //   setSelectedMovie(movie);
  // };

  // const handleOnDeleteClick = (movie) => {
  //   setSelectedMovie(movie);
  //   setShowConfirmModal(true);
  // };

  // const handleOnDeleteConfirm = async () => {
  //   setBusy(true);
  //   const { error, message } = await deleteMovie(selectedMovie.id);
  //   setBusy(false);

  //   if (error) return updateNotification('error', error);

  //   updateNotification('success', message);

  //   fetchLatestUploads();
  //   hideConfirmModal();
  // };

  // const handleOnUpdate = (movie) => {
  //   const updatedMovies = movies.map((m) => {
  //     if (m.id === movie.id) return movie;
  //     return m;
  //   });

  //   setMovies([...updatedMovies]);
  // };

  // const hideConfirmModal = () => setShowConfirmModal(false);
  // const hideUpdateModal = () => setShowUpdateModal(false);

  useEffect(() => {
    fetchLatestUploads();
  }, []);

  const handleUIUpdate = () => fetchLatestUploads();

  return (
    <>
      <div className="shadow p-5 rounded col-span-2">
        <h1 className="font-semibold text-2xl mb-2 text-primary dark:text-white ">
          Recent Uploads
        </h1>

        <div className="space-y-3">
          {latestUploads.map((movie) => {
            return (
              <MovieListItem
                movie={movie}
                key={movie.id}
                // onDeleteClick={() => handleOnDeleteClick(movie)}
                // onEditClick={() => handleOnEditClick(movie)}
                afterDelete={handleUIUpdate}
                afterUpdate={handleUIUpdate}
              />
            );
          })}
        </div>
      </div>
      {/* <ConfirmModal
        title='Are you sure?'
        subtitle='This action will remove this movie permanently'
        visible={showConfirmModal}
        onCancel={hideConfirmModal}
        onConfirm={handleOnDeleteConfirm}
        busy={busy}
      />

      <UpdateMovie
        visible={showUpdateModal}
        onClose={hideUpdateModal}
        initialState={selectedMovie}
        onSuccess={handleOnUpdate}
      /> */}
    </>
  );
}

export default LatestUploads;
