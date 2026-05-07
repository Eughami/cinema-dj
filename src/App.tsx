import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import { MantineProvider } from '@mantine/core';
import { theme } from './theme';
import './App.css';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import axios from 'axios';
import HomePage from './HomePage';
import Movie from './Movie';
import NotFound from './components/NotFound';
import { TheaterSeating } from './components/TheaterSeating/TheaterSeating';
import '@mantine/dates/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MovieDetails from './MovieDetails';
import AdminMovieList from './AdminMovieList';
import AdminSessionDetails from './AdminSessionDetails';
import NotificationProvider from './notifications/NotificationProvider';
import ErrorBoundary from './ErrorBoundary';
import AdminLogin from './admin/AdminLogin';
import RequireAdminAuth from './admin/RequireAdminAuth';
import { clearAdminToken } from './admin/adminAuth';

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (requestError) => {
        if (axios.isAxiosError(requestError)) {
          const status = requestError.response?.status;
          const requestUrl = requestError.config?.url || '';
          const isAdminApiCall = requestUrl.includes('/admin');
          const isAdminLoginCall = requestUrl.includes('/admin/login');

          if (status === 401 && isAdminApiCall && !isAdminLoginCall) {
            clearAdminToken();

            if (window.location.pathname.startsWith('/admin')) {
              window.location.assign('/admin/login');
            }
          }
        }

        return Promise.reject(requestError);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptorId);
    };
  }, []);

  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <NotificationProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movie/:id" element={<Movie />} />
                <Route path="/movie/booking/:id" element={<TheaterSeating />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route element={<RequireAdminAuth />}>
                  <Route path="/admin" element={<AdminMovieList />} />
                  <Route path="/admin/movie/:id" element={<MovieDetails />} />
                  <Route
                    path="/admin/session/:id"
                    element={<AdminSessionDetails />}
                  />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </NotificationProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </MantineProvider>
  );
}
