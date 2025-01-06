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
import Admin from './Admin';
import '@mantine/dates/styles.css';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter basename="cinema-dj">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<Movie />} />
          <Route path="/booking/:id" element={<TheaterSeating />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
