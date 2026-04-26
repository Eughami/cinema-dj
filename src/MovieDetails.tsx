import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ActionIcon,
  Badge,
  Button,
  Drawer,
  Group,
  Image,
  LoadingOverlay,
  Paper,
  ScrollArea,
  SimpleGrid,
  Table,
  Text,
  Title,
} from '@mantine/core';
import axios from 'axios';
import AddSession from './components/AddSession';
import { CiEdit } from 'react-icons/ci';
import { FaEye, FaRegTrashAlt } from 'react-icons/fa';
import { FiArrowLeft, FiCalendar } from 'react-icons/fi';
import styles from './admin/AdminRoutes.module.css';
import { getAdminRequestConfig, toApiUrl, toAssetUrl } from './config';
import AdminLogoutButton from './admin/AdminLogoutButton';

interface MovieDetailsData {
  id: number;
  title: string;
  description: string;
  image: string;
  genre?: string;
  actors?: string;
  duration: number;
}

interface SessionData {
  id: number;
  movie_id: number;
  date: string;
  time: string;
  audio: string;
  subtitle?: string;
  hall_no: number;
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' });

const MovieDetails = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetailsData | null>(null);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [opened, setOpened] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(
    null
  );
  const [loadingActions, setLoadingActions] = useState<{
    delete?: boolean;
    edit?: boolean;
    add?: boolean;
  }>({});

  useEffect(() => {
    fetchMovieDetails();
    fetchSessions();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(toApiUrl(`/movies/${id}`));
      setMovie(response.data);
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await axios.get(toApiUrl(`/movies/${id}/sessions`));
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const handleDeleteSession = async (sessionId: number) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      setLoadingActions((prev) => ({ ...prev, delete: true }));
      try {
        await axios.delete(
          toApiUrl(`/admin/sessions/${sessionId}`),
          getAdminRequestConfig()
        );
        fetchSessions();
      } catch (error) {
        console.error('Failed to delete session:', error);
      } finally {
        setLoadingActions((prev) => ({ ...prev, delete: false }));
      }
    }
  };

  const handleEditSession = (session: SessionData) => {
    setLoadingActions((prev) => ({ ...prev, edit: true }));
    setSelectedSession(session);
    setOpened(true);
  };

  const totalHallsUsed = useMemo(
    () => new Set(sessions.map((session) => session.hall_no)).size,
    [sessions]
  );

  if (!movie || !sessions) {
    return (
      <div className={styles.adminPage}>
        <div className={styles.adminContainer}>
          <Paper className={styles.surfacePanel} p="lg">
            <Text>Loading...</Text>
          </Paper>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminContainer}>
        <Paper className={styles.heroPanel}>
          <Group justify="space-between" align="flex-start" gap="sm">
            <div>
              <Text className={styles.kicker}>Movie Sessions</Text>
              <Title order={2}>{movie.title}</Title>
              <Text mt="xs" className={styles.heroHint}>
                Add or edit sessions and inspect reservation details per session.
              </Text>
            </div>
            <Group gap="xs">
              <AdminLogoutButton />
              <Button
                variant="white"
                color="dark"
                radius="xl"
                leftSection={<FiArrowLeft size={14} />}
                onClick={() => navigate('/admin')}
              >
                Back to Movies
              </Button>
              <div style={{ position: 'relative' }}>
              <LoadingOverlay
                visible={loadingActions.add}
                zIndex={900}
                overlayProps={{ radius: 'sm', blur: 2 }}
              />
              <Button
                variant="white"
                color="dark"
                radius="xl"
                leftSection={<FiCalendar size={15} />}
                onClick={() => {
                  setSelectedSession(null);
                  setOpened(true);
                }}
              >
                Add Session
              </Button>
            </div>
            </Group>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 3 }} className={styles.statsGrid}>
            <Paper className={styles.statCard}>
              <Text size="xs" fw={600} c="gray.2">
                Sessions planned
              </Text>
              <Title order={3}>{sessions.length}</Title>
            </Paper>
            <Paper className={styles.statCard}>
              <Text size="xs" fw={600} c="gray.2">
                Halls used
              </Text>
              <Title order={3}>{totalHallsUsed}</Title>
            </Paper>
            <Paper className={styles.statCard}>
              <Text size="xs" fw={600} c="gray.2">
                Duration
              </Text>
              <Title order={3}>{movie.duration} min</Title>
            </Paper>
          </SimpleGrid>
        </Paper>

        <Paper className={styles.surfacePanel}>
          <div className={styles.panelHeader}>
            <div className={styles.movieHeader}>
              <Image
                src={toAssetUrl(movie.image)}
                alt={movie.title}
                className={styles.moviePoster}
              />
              <div>
                <Title order={4}>{movie.title}</Title>
                <Text mt="xs" c="dimmed">
                  {movie.description}
                </Text>
                <div className={styles.pillList}>
                  <span className={styles.miniPill}>{movie.genre || 'Genre N/A'}</span>
                  {movie.actors && <span className={styles.miniPill}>{movie.actors}</span>}
                </div>
              </div>
            </div>
          </div>
        </Paper>

        <Paper className={styles.surfacePanel}>
          <div className={styles.panelHeader}>
            <Group justify="space-between">
              <Text fw={700}>Sessions</Text>
              <Badge radius="sm" color="cyan" variant="light">
                {sessions.length} total
              </Badge>
            </Group>
          </div>
          <div className={styles.tableWrap}>
            <ScrollArea>
              <Table highlightOnHover verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Time</Table.Th>
                    <Table.Th>Audio</Table.Th>
                    <Table.Th>Subtitle</Table.Th>
                    <Table.Th>Hall</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {sessions.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={6}>
                        <Text c="dimmed" ta="center" py="md">
                          No sessions yet for this movie.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                  {sessions.map((session) => (
                    <Table.Tr key={session.id} className={styles.tableRow}>
                      <Table.Td>
                        {dateFormatter.format(new Date(session.date))}
                      </Table.Td>
                      <Table.Td>{session.time}</Table.Td>
                      <Table.Td>
                        <Badge variant="light" color="blue" radius="sm">
                          {session.audio}
                        </Badge>
                      </Table.Td>
                      <Table.Td>{session.subtitle || 'N/A'}</Table.Td>
                      <Table.Td>{session.hall_no}</Table.Td>
                      <Table.Td>
                        <div className={styles.actionGroup}>
                          <ActionIcon
                            variant="light"
                            color="teal"
                            onClick={() => navigate(`/admin/session/${session.id}`)}
                            aria-label="View session details"
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
                              onClick={() => handleEditSession(session)}
                              aria-label="Edit session"
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
                              onClick={() => handleDeleteSession(session.id)}
                              aria-label="Delete session"
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
        opened={opened}
        onClose={() => {
          setOpened(false);
          setSelectedSession(null);
          setLoadingActions((prev) => ({ ...prev, edit: false, add: false }));
        }}
        title={selectedSession ? 'Edit Session' : 'Add Session'}
        padding="xl"
        size="xl"
      >
        <AddSession
          key={selectedSession ? `edit-${selectedSession.id}` : 'new-session'}
          mId={movie.id}
          mTitle={movie.title}
          session={selectedSession}
          onSuccess={() => {
            fetchSessions();
            setOpened(false);
            setSelectedSession(null);
            setLoadingActions((prev) => ({ ...prev, edit: false, add: false }));
          }}
        />
      </Drawer>
    </div>
  );
};

export default MovieDetails;
