import useMovies from './api/movies';
import HomeCaroussel from './components/HomeCaroussel';
import MovieList from './components/MovieList';

const HomePage = () => {
  const { data: movies, isLoading, isError, error } = useMovies();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  //! filter movie by release date
  //! if release < today
  //! current movie
  //! else
  //! futur premiers
  return (
    <div className="appRoot">
      <HomeCaroussel movies={movies} />
      <MovieList title="Now on cinema" movies={movies} />
      <MovieList title="Future Premiers" movies={movies} />
    </div>
  );
};

export default HomePage;
