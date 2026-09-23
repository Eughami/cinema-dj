import { useEffect, useMemo, useState } from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Drawer,
  Group,
  LoadingOverlay,
  Paper,
  ScrollArea,
  SimpleGrid,
  Table,
  Text,
  Title,
} from '@mantine/core';
import axios from 'axios';
import AddMovie from './components/AddMovie';
import { CiEdit } from 'react-icons/ci';
import { FaRegTrashAlt, FaEye } from 'react-icons/fa';
import { FiFilm, FiPlusCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import styles from './admin/AdminRoutes.module.css';
import { getAdminRequestConfig, toApiUrl, toAssetUrl } from './config';
import AdminLogoutButton from './admin/AdminLogoutButton';

interface AdminMovie {
  id: number;
  title: string;
  genre?: string;
  duration: number;
  release_date: string;
  image: string;
  actors?: string;
}

const releaseDateFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
});

const AdminMovieList = (): JSX.Element => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<AdminMovie[]>([]);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<AdminMovie | null>(null);
  const [loadingActions, setLoadingActions] = useState<{
    delete?: boolean;
    edit?: boolean;
    add?: boolean;
  }>({});

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(toApiUrl('/movies'));
      setMovies(response.data);
    } catch (error) {
      console.error('Échec de la récupération des films :', error);
    }
  };

  const upcomingMoviesCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return movies.filter((movie) => {
      const releaseDate = new Date(movie.release_date);
      releaseDate.setHours(0, 0, 0, 0);
      return releaseDate >= today;
    }).length;
  }, [movies]);

  const totalRuntime = useMemo(
    () => movies.reduce((acc, movie) => acc + Number(movie.duration || 0), 0),
    [movies]
  );

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
      setLoadingActions((prev) => ({ ...prev, delete: true }));
      try {
        await axios.delete(
          toApiUrl(`/admin/movies/${id}`),
          getAdminRequestConfig()
        );
        fetchMovies();
      } catch (error) {
        console.error('Échec de la suppression du film :', error);
      } finally {
        setLoadingActions((prev) => ({ ...prev, delete: false }));
      }
    }
  };

  const handleEdit = (movie: AdminMovie) => {
    setLoadingActions((prev) => ({ ...prev, edit: true }));
    setSelectedMovie(movie);
    setDrawerOpened(true);
  };

  const handleAddMovie = () => {
    setLoadingActions((prev) => ({ ...prev, add: true }));
    setSelectedMovie(null);
    setDrawerOpened(true);
  };

  const openMovieDetails = (id: number) => {
    navigate(`/admin/movie/${id}`);
  };

  const handleDrawerClose = () => {
    setDrawerOpened(false);
    setLoadingActions((prev) => ({ ...prev, edit: false, add: false }));
    fetchMovies();
  };

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminContainer}>
        <Paper className={styles.heroPanel}>
          <Group justify="space-between" align="flex-start" gap="sm">
            <div>
              <Text className={styles.kicker}>Administration Cinéma DJ</Text>
              <Title order={2}>Tableau de bord des films</Title>
              <Text mt="xs" className={styles.heroHint}>
                Gérez votre catalogue, vérifiez l'état de publication et accédez
                directement à la planification des séances.
              </Text>
            </div>
            <Group gap="xs">
              <AdminLogoutButton />
              <div style={{ position: 'relative' }}>
                <LoadingOverlay
                  visible={loadingActions.add}
                  zIndex={900}
                  overlayProps={{ radius: 'sm', blur: 2 }}
                />
                <Button
                  onClick={handleAddMovie}
                  leftSection={<FiPlusCircle size={16} />}
                  color="dark"
                  variant="white"
                  radius="xl"
                >
                  Ajouter un film
                </Button>
              </div>
            </Group>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 3 }} className={styles.statsGrid}>
            <Paper className={styles.statCard}>
              <Text size="xs" fw={600} c="gray.2">
                Total des films
              </Text>
              <Title order={3}>{movies.length}</Title>
            </Paper>
            <Paper className={styles.statCard}>
              <Text size="xs" fw={600} c="gray.2">
                Sorties à venir
              </Text>
              <Title order={3}>{upcomingMoviesCount}</Title>
            </Paper>
            <Paper className={styles.statCard}>
              <Text size="xs" fw={600} c="gray.2">
                Durée totale suivie
              </Text>
              <Title order={3}>{totalRuntime} min</Title>
            </Paper>
          </SimpleGrid>
        </Paper>

        <Paper className={styles.surfacePanel}>
          <div className={styles.panelHeader}>
            <Group justify="space-between">
              <Group gap="xs">
                <FiFilm size={18} />
                <Text fw={700}>Tous les films</Text>
              </Group>
              <Badge radius="sm" color="cyan" variant="light">
                {movies.length} films
              </Badge>
            </Group>
          </div>

          <div className={styles.tableWrap}>
            <ScrollArea>
              <Table highlightOnHover verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Affiche</Table.Th>
                    <Table.Th>Titre</Table.Th>
                    <Table.Th>Genre</Table.Th>
                    <Table.Th>Durée</Table.Th>
                    <Table.Th>Date de sortie</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {movies.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={6}>
                        <Text c="dimmed" ta="center" py="md">
                          Aucun film trouvé.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                  {movies.map((movie) => (
                    <Table.Tr key={movie.id} className={styles.tableRow}>
                      <Table.Td>
                        <img
                          src={toAssetUrl(movie.image)}
                          alt={`affiche de ${movie.title}`}
                          className={styles.posterThumb}
                        />
                      </Table.Td>
                      <Table.Td>
                        <div className={styles.movieMeta}>
                          <Text fw={700}>{movie.title}</Text>
                          {movie.actors && (
                            <Text size="xs" c="dimmed">
                              {movie.actors}
                            </Text>
                          )}
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Badge color="blue" variant="light" radius="sm">
                          {movie.genre || 'N/D'}
                        </Badge>
                      </Table.Td>
                      <Table.Td>{movie.duration} min</Table.Td>
                      <Table.Td>
                        {releaseDateFormatter.format(new Date(movie.release_date))}
                      </Table.Td>
                      <Table.Td>
                        <div className={styles.actionGroup}>
                          <ActionIcon
                            variant="light"
                            color="cyan"
                            onClick={() => openMovieDetails(movie.id)}
                            aria-label="Voir les séances du film"
                          >
                            <FaEye size={14} />
                          </ActionIcon>
                          <div style={{ position: 'relative' }}>
                            <LoadingOverlay
                              visible={loadingActions.edit}
                              zIndex={900}
                              overlayProps={{ radius: 'sm', blur: 2 }}
                            />
                            <ActionIcon
                              variant="light"
                              color="indigo"
                              onClick={() => handleEdit(movie)}
                              aria-label="Modifier le film"
                            >
                              <CiEdit size={17} />
                            </ActionIcon>
                          </div>
                          <div style={{ position: 'relative' }}>
                            <LoadingOverlay
                              visible={loadingActions.delete}
                              zIndex={900}
                              overlayProps={{ radius: 'sm', blur: 2 }}
                            />
                            <ActionIcon
                              variant="light"
                              color="red"
                              onClick={() => handleDelete(movie.id)}
                              aria-label="Supprimer le film"
                            >
                              <FaRegTrashAlt size={13} />
                            </ActionIcon>
                          </div>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </div>
        </Paper>
      </div>

      <Drawer
        opened={drawerOpened}
        onClose={handleDrawerClose}
        title={selectedMovie ? 'Modifier le film' : 'Ajouter un film'}
        padding="xl"
        size="xl"
      >
        <AddMovie movie={selectedMovie} onClose={handleDrawerClose} />
      </Drawer>
    </div>
  );
};

export default AdminMovieList;
