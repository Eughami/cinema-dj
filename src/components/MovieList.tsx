import classes from './MovieList.module.css';
import MovieCard from './MovieCard';
import { Movie } from '../type.ts';

interface MovieListProps {
  title: string;
  movies: Movie[] | undefined;
}
const MovieList = (props: MovieListProps) => {
  const { title, movies } = props;
  return (
    <div>
      <h2 className={classes.title}>{title}</h2>

      <div className={classes.movieCardContainer}>
        {movies?.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieList;
