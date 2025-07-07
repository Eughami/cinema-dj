import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Booking, Movie, Session } from '../type';

const fetchSeats = async (id: number) => {
  const response = await axios.get(
    `https://cinema-api.eughami.com/sessions/${id}/seats`
  );
  return response.data as {
    seats: string[];
    sessionDetails: Session;
    movieDetails: Movie;
  };
};

const useSeats = (id: number) => {
  return useQuery({
    queryKey: ['booking'], // Unique key for the query
    queryFn: () => fetchSeats(id), // Function to fetch data
  });
};

const bookSeats = async (booking: Booking) => {
  const response = await axios.post(
    `https://cinema-api.eughami.com/book`,
    booking
  );
  return response.data;
};

export { useSeats, bookSeats };
