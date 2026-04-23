import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Booking, Movie, Session } from '../type';
import { toApiUrl } from '../config';

const fetchSeats = async (id: number) => {
  const response = await axios.get(toApiUrl(`/sessions/${id}/seats`));
  return response.data as {
    seats: string[];
    sessionDetails: Session;
    movieDetails: Movie;
  };
};

const useSeats = (id: number) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => fetchSeats(id),
    enabled: Number.isInteger(id) && id > 0,
  });
};

const bookSeats = async (booking: Booking) => {
  const response = await axios.post(toApiUrl('/book'), booking);
  return response.data;
};

export { useSeats, bookSeats };
