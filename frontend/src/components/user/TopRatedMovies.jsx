import { useEffect, useState } from 'react';
import { getTopRatedMovies } from '../../api/movie';
import { useNotification } from '../../hooks';
import MovieList from './MovieList';

function TopRatedMovies() {
  const [movies, setMovies] = useState([]);
  const { updateNotification } = useNotification();

  const fetchMovies = async (signal) => {
    const { error, movies } = await getTopRatedMovies(null, signal);
    if (error) return updateNotification('error', error);

    setMovies([...movies]);
  };

  useEffect(() => {
    const ac = new AbortController();
    // console.log(ac);
    fetchMovies(ac.signal);
    return () => {
      ac.abort();
    };
  }, []);

  return <MovieList movies={movies} title='Viewers choice (Movies)' />;
}

export default TopRatedMovies;
