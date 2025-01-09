import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Drawer,
  Grid,
  Text,
  AppShell,
  Container,
} from '@mantine/core';
import axios from 'axios';
import AddMovie from './components/AddMovie';
import { CiEdit } from 'react-icons/ci';
import { FaRegTrashAlt, FaEye } from 'react-icons/fa';

const AdminMovieList = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:3000/movies');
      setMovies(response.data);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await axios.delete(`http://localhost:3000/admin/movies/${id}`);
        fetchMovies();
      } catch (error) {
        console.error('Failed to delete movie:', error);
      }
    }
  };

  const handleEdit = (movie: any) => {
    setSelectedMovie(movie);
    setDrawerOpened(true);
  };

  const handleAddMovie = () => {
    setSelectedMovie(null);
    setDrawerOpened(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpened(false);
    fetchMovies();
  };

  return (
    <div style={{ padding: '1em' }}>
      <Button onClick={handleAddMovie} m="md">
        Add New Movie
      </Button>

      <Table highlightOnHover withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th></Table.Th>
            <Table.Th>Title</Table.Th>
            <Table.Th>Genre</Table.Th>
            <Table.Th>Duration</Table.Th>
            <Table.Th>Release Date</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {movies.map((movie) => (
            <Table.Tr key={movie.id}>
              <Table.Td>
                <img
                  src={`http://localhost:3000/${movie.image}`}
                  alt="Image Preview"
                  style={{ maxWidth: 'auto', height: 70 }}
                />
              </Table.Td>
              <Table.Td>{movie.title}</Table.Td>
              <Table.Td>{movie.genre}</Table.Td>
              <Table.Td>{movie.duration} minutes</Table.Td>
              <Table.Td>
                {new Date(movie.release_date).toLocaleDateString('FR-fr')}
              </Table.Td>
              <Table.Td>
                <Button
                  mr="sm"
                  variant="outline"
                  size="xs"
                  component="a"
                  href={`admin/movie/${movie.id}`}
                >
                  <FaEye />
                </Button>
                <Button
                  mr="sm"
                  // size="compact-xs"
                  size="xs"
                  variant="outline"
                  onClick={() => handleEdit(movie)}
                >
                  <CiEdit />
                </Button>
                <Button
                  mr="sm"
                  color="red"
                  variant="outline"
                  size="xs"
                  onClick={() => handleDelete(movie.id)}
                >
                  <FaRegTrashAlt />
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

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
