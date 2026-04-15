import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Badge,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import { FiArrowLeft, FiUsers } from 'react-icons/fi';
import axios from 'axios';
import styles from './admin/AdminRoutes.module.css';

interface SessionData {
  id: number;
  movie_id: number;
  audio: string;
  subtitle?: string;
  hall_no: number;
  date: string;
  time: string;
}

interface MovieData {
  id: number;
  title: string;
}

interface ReservationData {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  seats: string[];
  people_count: number;
}

interface SessionDetailsResponse {
  session: SessionData;
  movie: MovieData;
  reservations: ReservationData[];
  total_reservations: number;
  total_people: number;
}

const theaterRows = ['A', 'B', 'C', 'D', 'E'];
const seatCountPerRow = 10;
const dateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' });

const AdminSessionDetails = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const sessionId = Number(id);

  const [data, setData] = useState<SessionDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!Number.isInteger(sessionId) || sessionId <= 0) {
        setError('Invalid session id');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<SessionDetailsResponse>(
          `https://cinema-api.eughami.com/admin/sessions/${sessionId}/details`
        );
        setData(response.data);
      } catch (fetchError) {
        console.error('Failed to fetch session details:', fetchError);
        setError('Unable to load session details');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  useEffect(() => {
    if (!data) return;
    if (data.reservations.length === 0) {
      setSelectedReservationId(null);
      return;
    }

    setSelectedReservationId((currentValue) => {
      const exists = data.reservations.some(
        (reservation) => reservation.id === currentValue
      );
      return exists ? currentValue : data.reservations[0].id;
    });
  }, [data]);

  const selectedReservation = useMemo(() => {
    if (!data || !selectedReservationId) return null;
    return (
      data.reservations.find(
        (reservation) => reservation.id === selectedReservationId
      ) || null
    );
  }, [data, selectedReservationId]);

  const allReservedSeats = useMemo(() => {
    if (!data) return new Set<string>();
    return new Set(data.reservations.flatMap((reservation) => reservation.seats));
  }, [data]);

  const selectedReservationSeats = useMemo(() => {
    return new Set(selectedReservation?.seats || []);
  }, [selectedReservation]);

  if (loading) {
    return (
      <div className={styles.adminPage}>
        <div className={styles.adminContainer}>
          <Paper className={styles.surfacePanel} p="lg">
            <Text>Loading session details...</Text>
          </Paper>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.adminPage}>
        <div className={styles.adminContainer}>
          <Paper className={styles.surfacePanel} p="lg">
            <Group justify="space-between" mb="sm">
              <Title order={4}>Session details</Title>
              <Button
                variant="light"
                leftSection={<FiArrowLeft size={14} />}
                onClick={() => navigate('/admin')}
              >
                Back to Admin
              </Button>
            </Group>
            <Text c="red.7">{error || 'Session details not found'}</Text>
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
              <Text className={styles.kicker}>Session Reservations</Text>
              <Title order={2}>{data.movie.title}</Title>
              <Text mt="xs" className={styles.heroHint}>
                {dateFormatter.format(new Date(data.session.date))} at{' '}
                {data.session.time} | Hall {data.session.hall_no} | Audio:{' '}
                {data.session.audio}
                {data.session.subtitle ? ` | Subtitle: ${data.session.subtitle}` : ''}
              </Text>
            </div>
            <Button
              variant="white"
              color="dark"
              radius="xl"
              leftSection={<FiArrowLeft size={14} />}
              onClick={() => navigate(`/admin/movie/${data.movie.id}`)}
            >
              Back to Sessions
            </Button>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 3 }} className={styles.statsGrid}>
            <Paper className={styles.statCard}>
              <Text size="xs" fw={600} c="gray.2">
                Session ID
              </Text>
              <Title order={3}>#{data.session.id}</Title>
            </Paper>
            <Paper className={styles.statCard}>
              <Text size="xs" fw={600} c="gray.2">
                Reservations
              </Text>
              <Title order={3}>{data.total_reservations}</Title>
            </Paper>
            <Paper className={styles.statCard}>
              <Text size="xs" fw={600} c="gray.2">
                Seats booked
              </Text>
              <Title order={3}>{data.total_people}</Title>
            </Paper>
          </SimpleGrid>
        </Paper>

        <Paper className={styles.surfacePanel}>
          <div className={styles.panelHeader}>
            <Group gap="xs">
              <FiUsers size={18} />
              <Text fw={700}>Reservation details</Text>
            </Group>
          </div>

          <div className={styles.tableWrap}>
            <div className={styles.sessionLayout}>
              <div className={styles.reservationList}>
                {data.reservations.length === 0 && (
                  <Paper p="md" withBorder>
                    <Text c="dimmed" size="sm">
                      No reservations yet for this session.
                    </Text>
                  </Paper>
                )}

                {data.reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className={`${styles.reservationItem} ${
                      selectedReservationId === reservation.id
                        ? styles.reservationActive
                        : ''
                    }`}
                    onClick={() => setSelectedReservationId(reservation.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedReservationId(reservation.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <Group justify="space-between" mb={6}>
                      <Text fw={700}>{reservation.name}</Text>
                      <Badge variant="light" color="teal" radius="sm">
                        {reservation.people_count} seats
                      </Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {reservation.phone_number}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {reservation.email}
                    </Text>
                    <Text mt={6} size="xs">
                      Reservation #{reservation.id}
                    </Text>
                  </div>
                ))}
              </div>

              <div>
                {!selectedReservation && (
                  <Paper p="md" withBorder>
                    <Text c="dimmed" size="sm">
                      Select a reservation to view seats.
                    </Text>
                  </Paper>
                )}

                {selectedReservation && (
                  <>
                    <Paper withBorder p="md" mb="sm" radius="md">
                      <Group justify="space-between">
                        <div>
                          <Text fw={700}>{selectedReservation.name}</Text>
                          <Text size="sm" c="dimmed">
                            {selectedReservation.phone_number}
                          </Text>
                        </div>
                        <Badge variant="filled" color="orange" radius="sm">
                          {selectedReservation.people_count} people
                        </Badge>
                      </Group>
                      <Text size="sm" mt="xs">
                        Seats: {selectedReservation.seats.join(', ')}
                      </Text>
                    </Paper>

                    <div className={styles.seatShell}>
                      <div className={styles.screen}>SCREEN</div>
                      {theaterRows.map((rowId) => (
                        <div key={rowId} className={styles.seatRow}>
                          <div className={styles.seatRowLabel}>{rowId}</div>
                          <div className={styles.seatGrid}>
                            {Array.from(
                              { length: seatCountPerRow },
                              (_, seatIndex) => {
                                const seatNumber = seatIndex + 1;
                                const seatId = `${rowId}${seatNumber}`;
                                const seatStatusClass = selectedReservationSeats.has(
                                  seatId
                                )
                                  ? styles.seatHighlighted
                                  : allReservedSeats.has(seatId)
                                  ? styles.seatReserved
                                  : styles.seatAvailable;

                                return (
                                  <span
                                    key={seatId}
                                    className={`${styles.seat} ${seatStatusClass}`}
                                  >
                                    {seatNumber}
                                  </span>
                                );
                              }
                            )}
                          </div>
                        </div>
                      ))}

                      <div className={styles.legend}>
                        <span className={styles.legendItem}>
                          <span
                            className={`${styles.seat} ${styles.seatHighlighted}`}
                          >
                            1
                          </span>
                          Selected reservation
                        </span>
                        <span className={styles.legendItem}>
                          <span className={`${styles.seat} ${styles.seatReserved}`}>
                            1
                          </span>
                          Other reserved seats
                        </span>
                        <span className={styles.legendItem}>
                          <span className={`${styles.seat} ${styles.seatAvailable}`}>
                            1
                          </span>
                          Available
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default AdminSessionDetails;
