import {
  BackgroundImage,
  Button,
  Divider,
  Grid,
  Image,
  Select,
} from '@mantine/core';
import { useNavigate, useParams } from 'react-router';
import MovieProperty from './components/MovieProperty';
import classes from './Movie.module.css';
import MovieTime from './components/MovieTime';
import useMovie from './api/movieDetails';

const Movie = () => {
  const { id } = useParams(); // Get the `id` from the URL (as a string)
  const navigate = useNavigate(); // For navigation

  // Convert `id` to a number and validate it
  const numericId = Number(id); // or parseInt(id, 10)
  if (isNaN(numericId) || numericId <= 0) {
    return (
      <div>
        <h1>404 - Page Not Found</h1>
        <p>The movie ID is invalid or not provided.</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }
  const { data: movie, isLoading, isError, error } = useMovie(numericId);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  // fetch the movie details
  return (
    <BackgroundImage src={`http://localhost:3000/${movie.image}`}>
      <div className={classes.movieRoot}>
        <Grid className={classes.gridRoot}>
          <Grid.Col span={{ base: 12, sm: 'content' }}>
            <Image
              radius="md"
              h={300}
              w={250}
              src={`http://localhost:3000/${movie.image}`}
              alt="movie poster"
            />
            <MovieProperty label="Release Date" value={movie.release_date} />
            <MovieProperty label="Genre" value={movie.genre} />
            <MovieProperty label="Duration" value={`${movie.duration} min`} />
            <MovieProperty label="Director" value="Barry Jenkins" />
            <MovieProperty label="Actors" value={movie.actor} />
            <Button
              variant="filled"
              color="#f5efdf"
              classNames={{
                root: classes.root,
                label: classes.label,
              }}
            >
              Watch Trailer
            </Button>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 'auto' }}>
            <h2>
              <span className={classes.movieTitle}>{movie.title}</span>
              <span className={classes.movieBadge}>8+</span>
            </h2>
            <Divider my="md" />
            <p>{movie.description}</p>
            <div className={classes.dateSelection}>
              <div className={classes.dateLeft}>
                <img
                  className={classes.calendarIcon}
                  src="https://www.starluxcinema.com/assets/calendar-icon.svg"
                  alt="calendar"
                />
                <span className={classes.today}>Saturday, January 4, 2025</span>
              </div>
              <div className={classes.dateRight}>
                <Select
                  classNames={{
                    input: classes.selectRoot,
                  }}
                  placeholder="Select another date ..."
                  // placeholder="choisissez une autre date"
                  data={['Sunday, January 5, 2025', 'Angular', 'Vue', 'Svelte']}
                />
              </div>
            </div>
            <MovieTime />
            <MovieTime />
          </Grid.Col>
        </Grid>
      </div>
    </BackgroundImage>
  );
};

export default Movie;
