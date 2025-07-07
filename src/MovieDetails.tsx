import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Table, Button, Text, Grid, Drawer, Image } from '@mantine/core';
import axios from 'axios';
import AddSession from './components/AddSession';
import { CiEdit } from 'react-icons/ci';
import { FaRegTrashAlt } from 'react-icons/fa';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [opened, setOpened] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  useEffect(() => {
    fetchMovieDetails();
    fetchSessions();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(
        `https://cinema-api.eughami.com/movies/${id}`
      );
      setMovie(response.data);
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await axios.get(
        `https://cinema-api.eughami.com/movies/${id}/sessions`
      );
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const handleDeleteSession = async (sessionId: number) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await axios.delete(
          `https://cinema-api.eughami.com/admin/sessions/${sessionId}`
        );
        fetchSessions();
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    }
  };

  const handleEditSession = (session: any) => {
    setSelectedSession(session);
    setOpened(true);
  };

  if (!movie) return <Text>Loading...</Text>;

  return (
    <div style={{ padding: '1em' }}>
      <Text size="xl" mb="md" fw="bolder">
        {movie.title}
      </Text>
      <Grid>
        <Grid.Col span="content">
          <Image
            src={`https://cinema-api.eughami.com/${movie.image}`}
            style={{ width: 100 }}
            alt={movie.title}
            mb="md"
          />
        </Grid.Col>
        <Grid.Col span="auto">
          <Text mb="md">{movie.description}</Text>
        </Grid.Col>
      </Grid>

      <Button onClick={() => setOpened(true)} mb="md">
        Add Session
      </Button>

      <Text size="lg" mb="md" fw="bold">
        Sessions
      </Text>
      <Table highlightOnHover withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Date</Table.Th>
            <Table.Th>Time</Table.Th>
            <Table.Th>Audio</Table.Th>
            <Table.Th>Subtitle</Table.Th>
            <Table.Th>Hall Number</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sessions.map((session) => (
            <Table.Tr key={session.id}>
              <Table.Td>
                {new Date(session.date).toLocaleDateString('FR-fr')}
              </Table.Td>
              <Table.Td>{session.time}</Table.Td>
              <Table.Td>{session.audio}</Table.Td>
              <Table.Td>{session.subtitle}</Table.Td>
              <Table.Td>{session.hall_no}</Table.Td>
              <Table.Td>
                <Button
                  variant="outline"
                  size="xs"
                  mr="sm"
                  onClick={() => handleEditSession(session)}
                >
                  <CiEdit />
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  mr="sm"
                  color="red"
                  onClick={() => handleDeleteSession(session.id)}
                >
                  <FaRegTrashAlt />
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Drawer
        opened={opened}
        onClose={() => {
          setOpened(false);
          setSelectedSession(null);
        }}
        title={selectedSession ? 'Edit Session' : 'Add Session'}
        padding="xl"
        size="xl"
      >
        <AddSession
          mId={movie.id}
          mTitle={movie.title}
          session={selectedSession}
          onSuccess={() => {
            fetchSessions();
            setOpened(false);
            setSelectedSession(null);
          }}
        />
      </Drawer>
    </div>
  );
};

export default MovieDetails;
