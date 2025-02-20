import { BsBoxArrowUpRight, BsPencilSquare, BsTrash } from 'react-icons/bs';
import ConfirmModal from './modals/ConfirmModal';
import { useState } from 'react';
import { deleteMovie } from '../api/movie';
import { useNotification } from '../hooks';
import UpdateMovie from './modals/UpdateMovie';
import { getPoster } from '../utils/helper';

const MovieListItem = ({ movie, afterDelete, afterUpdate }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const { updateNotification } = useNotification();

  const handleOnDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteMovie(movie.id);
    setBusy(false);

    if (error) return updateNotification('error', error);

    hideConfirmModal();
    updateNotification('success', message);
    afterDelete(movie);
  };

  const handleOnEditClick = () => {
    setShowUpdateModal(true);
    setSelectedMovieId(movie.id);
    console.log(movie);
  };

  const handleOnUpdate = (movie) => {
    afterUpdate(movie);
    setShowUpdateModal(false);
    setSelectedMovieId(null);
  };

  const displayConfirmModal = () => setShowConfirmModal(true);
  const hideConfirmModal = () => setShowConfirmModal(false);

  return (
    <>
      <MovieCard
        movie={movie}
        onDeleteClick={displayConfirmModal}
        onEditClick={handleOnEditClick}
      />
      <div className='p-0'>
        <ConfirmModal
          visible={showConfirmModal}
          onConfirm={handleOnDeleteConfirm}
          onCancel={hideConfirmModal}
          title='Are you sure?'
          subtitle='This action will remove this movie permanently!'
          busy={busy}
        />
        <UpdateMovie
          movieId={selectedMovieId}
          visible={showUpdateModal}
          onSuccess={handleOnUpdate}
        />
      </div>
    </>
  );
};

const MovieCard = ({ movie, onDeleteClick, onOpenClick, onEditClick }) => {
  const { poster, title, responsivePosters, genres = [], status } = movie;
  return (
    <table className='w-full border-b'>
      <tbody>
        <tr>
          <td>
            <div className='w-24'>
              <img
                className='w-full aspect-square object-cover'
                src={getPoster(responsivePosters) || poster}
                alt={title}
              />
            </div>
          </td>

          <td className='w-full pl-5'>
            <div>
              <h1 className='text-lg font-semibold text-primary dark:text-white'>
                {title}
              </h1>
              <div className='space-x-1'>
                {genres.map((g, index) => {
                  return (
                    <span
                      key={g + index}
                      className='text-primary dark:text-white text-xs'
                    >
                      {g}
                    </span>
                  );
                })}
              </div>
            </div>
          </td>

          <td className='px-5'>
            <p className='text-primary dark:text-white'>{status}</p>
          </td>

          <td>
            <div className='flex items-center space-x-3 text-primary dark:text-white text-lg'>
              <button onClick={onDeleteClick}>
                <BsTrash />
              </button>
              <button onClick={onEditClick}>
                <BsPencilSquare />
              </button>
              <button onClick={onOpenClick}>
                <BsBoxArrowUpRight />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default MovieListItem;
