import {
  BackgroundImage,
  Button,
  Divider,
  Grid,
  Image,
  LoadingOverlay,
  Select,
  Text,
} from '@mantine/core';
import { useNavigate, useParams } from 'react-router';
import MovieProperty from './components/MovieProperty';
import classes from './Movie.module.css';
import MovieTime from './components/MovieTime';
import useMovie from './api/movieDetails';
import { useEffect, useState } from 'react';
import { formatDate, parseDateFR } from './utils/date';
import useMovieSession from './api/movieSession';
import { Session } from './type';

const Movie = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toLocaleDateString('FR-fr')
  );
  const [dateSession, setDateSession] = useState<Session[]>([]);
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
  const {
    data: sessions,
    isLoading: sL,
    isError: isE,
    error: sE,
  } = useMovieSession(numericId);

  useEffect(() => {
    if (sessions?.length) {
      setDateSession(
        sessions.filter((ss) => ss.date == parseDateFR(selectedDate))
      );
    }
  }, [sessions, selectedDate]);

  if (isLoading || sL) {
    return (
      <LoadingOverlay
        visible
        zIndex={1000}
        overlayProps={{ radius: 'lg', blur: 2 }}
      />
    );
  }
  if (isError || isE) {
    return <div>Error: {error?.message || sE?.message}</div>;
  }
  // fetch the movie details
  return (
    <BackgroundImage src={`https://cinema-api.eughami.com/${movie?.image}`}>
      <div className={classes.movieRoot}>
        <Grid className={classes.gridRoot}>
          <Grid.Col span={{ base: 12, sm: 'content' }}>
            <Image
              radius="md"
              h={300}
              w={250}
              src={`https://cinema-api.eughami.com/${movie?.image}`}
              alt="movie poster"
            />
            <MovieProperty label="Release Date" value={movie!.release_date} />
            <MovieProperty label="Genre" value={movie!.genre} />
            <MovieProperty label="Duration" value={`${movie!.duration} min`} />
            <MovieProperty label="Director" value="Barry Jenkins" />
            <MovieProperty label="Actors" value={movie!.actor} />
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
              <span className={classes.movieTitle}>{movie?.title}</span>
              <span className={classes.movieBadge}>8+</span>
            </h2>
            <Divider my="md" />
            <p>{movie?.description}</p>
            <div className={classes.dateSelection}>
              <div className={classes.dateLeft}>
                <img
                  className={classes.calendarIcon}
                  src="/calendar-icon.svg"
                  alt="calendar"
                />
                <span className={classes.today}>
                  {formatDate(parseDateFR(selectedDate))}
                </span>
              </div>
              <div className={classes.dateRight}>
                <Select
                  classNames={{
                    input: classes.selectRoot,
                  }}
                  placeholder="Select another date ..."
                  // placeholder="choisissez une autre date"
                  data={Array.from({ length: 6 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const dd = date.toLocaleDateString('FR-fr');
                    return {
                      value: dd,
                      label: formatDate(parseDateFR(dd)),
                      disabled: dd == selectedDate,
                    };
                  })}
                  value={selectedDate}
                  onChange={(value) => setSelectedDate(value!)}
                />
              </div>
            </div>
            {dateSession?.length ? (
              dateSession.map((s) => <MovieTime s={s} key={s.id} />)
            ) : (
              <Text c="dimmed" style={{ textAlign: 'center' }} p="xl">
                No Session for the selected Date.
              </Text>
            )}
          </Grid.Col>
        </Grid>
      </div>
    </BackgroundImage>
  );
};

export default Movie;
