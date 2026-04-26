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
      console.error('Failed to fetch movies:', error);
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
    if (window.confirm('Are you sure you want to delete this movie?')) {
      setLoadingActions((prev) => ({ ...prev, delete: true }));
      try {
        await axios.delete(
          toApiUrl(`/admin/movies/${id}`),
          getAdminRequestConfig()
        );
        fetchMovies();
      } catch (error) {
        console.error('Failed to delete movie:', error);
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
              <Text className={styles.kicker}>Cinema DJ Administration</Text>
              <Title order={2}>Movies Dashboard</Title>
              <Text mt="xs" className={styles.heroHint}>
                Manage your catalog, check publishing readiness, and jump directly
                to session planning.
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
                  Add New Movie
                </Button>
              </div>
            </Group>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 3 }} className={styles.statsGrid}>
            <Paper className={styles.statCard}>
              <Text size="xs" fw={600} c="gray.2">
                Total movies
              </Text>
              <Title order={3}>{movies.length}</Title>
            </Paper>
            <Paper className={styles.statCard}>
              <Text size="xs" fw={600} c="gray.2">
                Upcoming releases
              </Text>
              <Title order={3}>{upcomingMoviesCount}</Title>
            </Paper>
            <Paper className={styles.statCard}>
              <Text size="xs" fw={600} c="gray.2">
                Runtime tracked
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
                <Text fw={700}>All movies</Text>
              </Group>
              <Badge radius="sm" color="cyan" variant="light">
                {movies.length} items
              </Badge>
            </Group>
          </div>

          <div className={styles.tableWrap}>
            <ScrollArea>
              <Table highlightOnHover verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Poster</Table.Th>
                    <Table.Th>Title</Table.Th>
                    <Table.Th>Genre</Table.Th>
                    <Table.Th>Duration</Table.Th>
                    <Table.Th>Release Date</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {movies.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={6}>
                        <Text c="dimmed" ta="center" py="md">
                          No movies found.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                  {movies.map((movie) => (
                    <Table.Tr key={movie.id} className={styles.tableRow}>
                      <Table.Td>
                        <img
                          src={toAssetUrl(movie.image)}
                          alt={`${movie.title} poster`}
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
                          {movie.genre || 'N/A'}
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
                            aria-label="View movie sessions"
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
                              aria-label="Edit movie"
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
                              aria-label="Delete movie"
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
        title={selectedMovie ? 'Edit Movie' : 'Add Movie'}
        padding="xl"
        size="xl"
      >
        <AddMovie movie={selectedMovie} onClose={handleDrawerClose} />
      </Drawer>
    </div>
  );
};

export default AdminMovieList;
