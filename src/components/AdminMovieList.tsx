import { useState, useEffect } from 'react';
import { Table, Button, Drawer, Grid, Text } from '@mantine/core';
import axios from 'axios';
import AddMovie from './AddMovie';

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
    <div>
      <Button onClick={handleAddMovie} mb="md">
        Add New Movie
      </Button>

      <Table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Genre</th>
            <th>Duration</th>
            <th>Release Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.title}</td>
              <td>{movie.genre}</td>
              <td>{movie.duration} minutes</td>
              <td>{new Date(movie.release_date).toLocaleDateString()}</td>
              <td>
                <Button onClick={() => handleEdit(movie)}>Edit</Button>
                <Button color="red" onClick={() => handleDelete(movie.id)}>
                  Delete
                </Button>
                <Button component="a" href={`admin/movie/${movie.id}`}>
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
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
