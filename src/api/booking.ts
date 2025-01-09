import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Booking, Movie, Session } from '../type';

const fetchSeats = async (id: number) => {
  const response = await axios.get(
    `http://localhost:3000/sessions/${id}/seats`
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
  const response = await axios.post(`http://localhost:3000/book`, booking);
  return response.data as { success: boolean };
};

// React Query hook for booking a seat
const useBookSeat = () => {
  return useMutation({
    mutationFn: bookSeats,
    onSuccess: (data) => {
      console.log('Booking successful:', data);
      // You can add additional logic here, like showing a success message
    },
    onError: (error) => {
      console.error('Booking failed:', error);
      // You can add additional logic here, like showing an error message
    },
  });
};

export { useSeats, useBookSeat };
