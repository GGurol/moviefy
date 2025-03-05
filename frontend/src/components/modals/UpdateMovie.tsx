import { useState } from "react";
import { getMovieForUpdate, updateMovie } from "../../api/movie";
import MovieForm from "../admin/MovieForm";
import ModalContainer from "./ModalContainer";
import { useEffect } from "react";
import { toast } from "sonner";

function UpdateMovie({ visible, onSuccess, movieId }) {
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, movie, message } = await updateMovie(movieId, data);
    setBusy(false);
    if (error) return toast.error(error);

    toast.success(message);
    onSuccess(movie);
  };

  const fetchMovieToUpdate = async () => {
    const { movie, error } = await getMovieForUpdate(movieId);
    if (error) return toast.error(error);
    setSelectedMovie(movie);
    setReady(true);
  };

  useEffect(() => {
    if (movieId) fetchMovieToUpdate();
  }, [movieId]);

  return (
    <>
      <MovieForm
        initialState={selectedMovie}
        btnTitle="Update"
        onSubmit={!busy ? handleSubmit : null}
        busy={busy}
        isUpdate={true}
      />
    </>
  );
  // return (
  //   <>
  //     {ready ? (
  //       <MovieForm
  //         initialState={selectedMovie}
  //         btnTitle="Update"
  //         onSubmit={!busy ? handleSubmit : null}
  //         busy={busy}
  //       />
  //     ) : (
  //       <div className="w-full h-full flex justify-center items-center">
  //         <p className="text-light-subtle dark:text-dark-subtle animate-pulse text-xl">
  //           Please wait...
  //         </p>
  //       </div>
  //     )}
  //   </>
  // );
}

export default UpdateMovie;
