import { useState, useEffect } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  Title,
  Container,
  Tabs,
} from '@mantine/core';
import axios from 'axios';
import AddMovie from './components/AddMovie';
import AddSession from './components/AddSession';

const Admin = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch movies when the component mounts
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:3000/movies');
        setMovies(response.data);
      } catch (error) {
        console.error('Failed to fetch movies', error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <AppShell padding="md">
      <Container>
        <Tabs defaultValue="add-movie">
          <Tabs.List>
            <Tabs.Tab value="add-movie">Add Movie</Tabs.Tab>
            <Tabs.Tab value="add-session">Add Session</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="add-movie" pt="md">
            <Title order={3} mb="md">
              Add Movie
            </Title>
            <AddMovie />
          </Tabs.Panel>

          <Tabs.Panel value="add-session" pt="md">
            <Title order={3} mb="md">
              Add Session
            </Title>
            <AddSession movies={movies} />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </AppShell>
  );
};

export default Admin;
