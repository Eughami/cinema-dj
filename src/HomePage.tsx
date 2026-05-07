import { useMemo } from 'react';
import useMovies from './api/movies';
import useSessions from './api/sessions';
import HomeCaroussel from './components/HomeCaroussel';
import MovieList from './components/MovieList';
import { Movie } from './type';
import { LoadingOverlay } from '@mantine/core';

const HomePage = () => {
  const {
    data: movies,
    isLoading: isMoviesLoading,
    isError: isMoviesError,
    error: moviesError,
  } = useMovies();
  const {
    data: sessions,
    isLoading: isSessionsLoading,
    isError: isSessionsError,
    error: sessionsError,
  } = useSessions();

  const todayIsoDate = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const { currentMovies, futureMovies } = useMemo(() => {
    if (!movies?.length) {
      return {
        currentMovies: [] as Movie[],
        futureMovies: [] as Movie[],
      };
    }

    const sessionsByMovie = new Map<number, string[]>();
    sessions?.forEach((session) => {
      const movieSessions = sessionsByMovie.get(session.movie_id) ?? [];
      movieSessions.push(session.date);
      sessionsByMovie.set(session.movie_id, movieSessions);
    });

    const current: Movie[] = [];
    const future: Movie[] = [];

    movies.forEach((movie) => {
      const movieSessionDates = sessionsByMovie.get(movie.id) ?? [];
      const hasUpcomingOrTodaySession = movieSessionDates.some(
        (sessionDate) => sessionDate >= todayIsoDate
      );
      const hasAnySession = movieSessionDates.length > 0;
      const isUpcomingTitle = movie.release_date >= todayIsoDate;

      if (hasUpcomingOrTodaySession) {
        current.push(movie);
        return;
      }

      if (!hasAnySession && isUpcomingTitle) {
        future.push(movie);
      }
    });

    return {
      currentMovies: current,
      futureMovies: future,
    };
  }, [movies, sessions, todayIsoDate]);

  if (isMoviesLoading || isSessionsLoading) {
    return (
      <LoadingOverlay
        visible
        zIndex={1000}
        overlayProps={{ radius: 'lg', blur: 2 }}
      />
    );
  }
  if (isMoviesError || isSessionsError) {
    return <div>Error: {moviesError?.message || sessionsError?.message}</div>;
  }

  const carouselMovies = [...currentMovies, ...futureMovies];

  return (
    <div className="appRoot">
      <HomeCaroussel movies={carouselMovies} />
      <MovieList title="Now on cinema" movies={currentMovies} />
      <MovieList title="Future Premiers" movies={futureMovies} />
    </div>
  );
};

export default HomePage;
