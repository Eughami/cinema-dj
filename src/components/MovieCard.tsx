import { Image } from '@mantine/core';
import classes from './MovieCard.module.css';
const MovieCard = () => {
  const baseRoute = import.meta.env.VITE_BASE_ROUTE;
  return (
    <div className={classes.movieCard}>
      <a title="Movie title" href={`${baseRoute}/movie/1`}>
        <Image
          radius="md"
          h={250}
          w={190}
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png"
          alt="movie poster"
        />
      </a>
      <h3>
        <a title="Movie title" href={`${baseRoute}/movie/1`}>
          Movie title
        </a>
      </h3>
    </div>
  );
};

export default MovieCard;
