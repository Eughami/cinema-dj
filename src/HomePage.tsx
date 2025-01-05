import HomeCaroussel from './components/HomeCaroussel';
import MovieList from './components/MovieList';

const HomePage = () => {
  return (
    <div className="appRoot">
      <HomeCaroussel />
      <MovieList title="Now on cinema" />
      <MovieList title="Future Premiers" />
    </div>
  );
};

export default HomePage;
