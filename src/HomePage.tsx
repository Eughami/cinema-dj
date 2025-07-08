import { useEffect, useState } from 'react';
import useMovies from './api/movies';
import HomeCaroussel from './components/HomeCaroussel';
import MovieList from './components/MovieList';
import { Movie } from './type';
import { LoadingOverlay } from '@mantine/core';

const HomePage = () => {
  const [currentMovies, setCurrentMovies] = useState<Movie[]>([]);
  const [futureMovies, setFutureMovies] = useState<Movie[]>([]);
  const { data: movies, isLoading, isError, error } = useMovies();

  useEffect(() => {
    if (movies?.length) {
      console.log('Üpdateing movie');
      const todayDate = new Date().getTime();
      const cM: Movie[] = [];
      const fM: Movie[] = [];
      movies.forEach((m) => {
        if (new Date(m.release_date).getTime() < todayDate) {
          cM.push(m);
        } else {
          fM.push(m);
        }
      });
      setCurrentMovies(cM);
      setFutureMovies(fM);
    }
  }, [movies]);

  if (isLoading) {
    return (
      <LoadingOverlay
        visible
        zIndex={1000}
        overlayProps={{ radius: 'lg', blur: 2 }}
      />
    );
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="appRoot">
      <HomeCaroussel movies={movies} />
      <MovieList title="Now on cinema" movies={currentMovies} />
      <MovieList title="Future Premiers" movies={futureMovies} />
    </div>
  );
};

export default HomePage;
