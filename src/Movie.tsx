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
import { toAssetUrl } from './config';

const Movie = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toLocaleDateString('fr-FR')
  );
  const [dateSession, setDateSession] = useState<Session[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const numericId = Number(id);
  if (isNaN(numericId) || numericId <= 0) {
    return (
      <div>
        <h1>404 - Page non trouvée</h1>
        <p>L'identifiant du film est invalide ou non fourni.</p>
        <button onClick={() => navigate('/')}>Retour à l'accueil</button>
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
        sessions.filter((ss) => ss.date === parseDateFR(selectedDate))
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
    return <div>Erreur : {error?.message || sE?.message}</div>;
  }

  return (
    <BackgroundImage src={toAssetUrl(movie?.image)}>
      <div className={classes.movieRoot}>
        <Grid className={classes.gridRoot}>
          <Grid.Col span={{ base: 12, sm: 'content' }} className={classes.movieInfoCol}>
            <Image
              radius="md"
              h={300}
              w={250}
              src={toAssetUrl(movie?.image)}
              alt="affiche du film"
            />
            <MovieProperty label="Date de sortie" value={movie!.release_date} />
            <MovieProperty label="Genre" value={movie!.genre || ''} />
            <MovieProperty label="Durée" value={`${movie!.duration} min`} />
            <MovieProperty label="Acteurs" value={movie!.actors || ''} />
            <Button
              variant="filled"
              color="#f5efdf"
              classNames={{
                root: classes.root,
                label: classes.label,
              }}
            >
              Voir la bande-annonce
            </Button>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 'auto' }} className={classes.sessionsCol}>
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
                  alt="calendrier"
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
                  placeholder="Choisir une autre date ..."
                  data={Array.from({ length: 6 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const dd = date.toLocaleDateString('fr-FR');
                    return {
                      value: dd,
                      label: formatDate(parseDateFR(dd)),
                      disabled: dd === selectedDate,
                    };
                  })}
                  value={selectedDate}
                  onChange={(value) => setSelectedDate(value!)}
                />
              </div>
            </div>
            <div className={classes.sessionContainer}>
            {dateSession?.length ? (
              dateSession.map((s) => <MovieTime s={s} key={s.id} />)
            ) : (
              <Text className={classes.noSessionText} p="xl">
                Aucune séance pour la date sélectionnée.
              </Text>
            )}
            </div>
          </Grid.Col>
        </Grid>
      </div>
    </BackgroundImage>
  );
};

export default Movie;
