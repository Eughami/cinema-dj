import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Table, Button, Text, Grid, Drawer, Image } from '@mantine/core';
import axios from 'axios';
import AddSession from './components/AddSession';

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
      const response = await axios.get(`http://localhost:3000/movies/${id}`);
      setMovie(response.data);
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/movies/${id}/sessions`
      );
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const handleDeleteSession = async (sessionId: number) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await axios.delete(`http://localhost:3000/admin/sessions/${sessionId}`);
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
    <div>
      <Text size="xl" mb="md">
        {movie.title}
      </Text>
      <Image src={movie.imageUrl} alt={movie.title} mb="md" />
      <Text mb="md">{movie.description}</Text>

      <Button onClick={() => setOpened(true)} mb="md">
        Add Session
      </Button>

      <Text size="lg" mb="md">
        Sessions
      </Text>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Audio</th>
            <th>Subtitle</th>
            <th>Hall Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id}>
              <td>{new Date(session.date).toLocaleDateString('FR-fr')}</td>
              <td>{session.time}</td>
              <td>{session.audio}</td>
              <td>{session.subtitle}</td>
              <td>{session.hall_no}</td>
              <td>
                <Button
                  color="red"
                  onClick={() => handleDeleteSession(session.id)}
                  mr="sm"
                >
                  Delete
                </Button>
                <Button onClick={() => handleEditSession(session)}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
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
