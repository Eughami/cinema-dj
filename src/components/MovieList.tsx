import classes from './MovieList.module.css';
import MovieCard from './MovieCard';
interface MovieListProps {
  title: string;
}
const MovieList = (props: MovieListProps) => {
  const { title } = props;
  return (
    <div>
      <h2 className={classes.title}>{title}</h2>

      <div className={classes.movieCardContainer}>
        <MovieCard />
        <MovieCard />
        <MovieCard />
        <MovieCard />
        <MovieCard />
        <MovieCard />
      </div>
    </div>
  );
};

export default MovieList;
