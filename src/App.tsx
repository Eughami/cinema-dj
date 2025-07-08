import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import { MantineProvider } from '@mantine/core';
import { theme } from './theme';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import HomePage from './HomePage';
import Movie from './Movie';
import NotFound from './components/NotFound';
import { TheaterSeating } from './components/TheaterSeating/TheaterSeating';
import '@mantine/dates/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MovieDetails from './MovieDetails';
import AdminMovieList from './AdminMovieList';

export default function App() {
  const queryClient = new QueryClient();

  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<Movie />} />
            <Route path="/movie/booking/:id" element={<TheaterSeating />} />
            <Route path="/admin" element={<AdminMovieList />} />
            <Route path="/admin/movie/:id" element={<MovieDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}
