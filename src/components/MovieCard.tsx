import { Image } from '@mantine/core';
import classes from './MovieCard.module.css';
import { Movie } from '../type';
interface MovieCardProps {
  movie: Movie;
}
const MovieCard = (props: MovieCardProps) => {
  const { movie } = props;
  return (
    <div className={classes.movieCard}>
      <a title={movie.title} href={`movie/${movie.id}`}>
        <Image
          radius="md"
          h={250}
          w={190}
          src={`https://cinema-api.eughami.com/${movie.image}`}
          alt="movie poster"
        />
      </a>
      <h3>
        <a title={movie.title} href={`movie/${movie.id}`}>
          {movie.title}
        </a>
      </h3>
    </div>
  );
};

export default MovieCard;
