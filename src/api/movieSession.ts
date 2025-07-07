import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Session } from '../type';

const fetchMovieSession = async (id: number) => {
  const response = await axios.get(
    `https://cinema-api.eughami.com/movies/${id}/sessions`
  );
  return response.data as Session[];
};

const useMovieSession = (id: number) => {
  return useQuery({
    queryKey: ['movieSession'], // Unique key for the query
    queryFn: () => fetchMovieSession(id), // Function to fetch data
  });
};

export default useMovieSession;
