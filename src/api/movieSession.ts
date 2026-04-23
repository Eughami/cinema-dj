import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Session } from '../type';
import { toApiUrl } from '../config';

const fetchMovieSession = async (id: number) => {
  const response = await axios.get(toApiUrl(`/movies/${id}/sessions`));
  return response.data as Session[];
};

const useMovieSession = (id: number) => {
  return useQuery({
    queryKey: ['movieSession', id],
    queryFn: () => fetchMovieSession(id),
    enabled: Number.isInteger(id) && id > 0,
  });
};

export default useMovieSession;
