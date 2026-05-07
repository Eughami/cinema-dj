import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Movie } from '../type';
import { toApiUrl } from '../config';

const fetchMovie = async (id: number) => {
  const response = await axios.get(toApiUrl(`/movies/${id}`));
  return response.data as Movie;
};

const useMovie = (id: number) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchMovie(id),
    enabled: Number.isInteger(id) && id > 0,
  });
};

export default useMovie;
