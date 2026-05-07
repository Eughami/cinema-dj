import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Movie } from '../type';
import { toApiUrl } from '../config';

const fetchMovies = async () => {
  const response = await axios.get(toApiUrl('/movies'));
  return response.data as Movie[];
};

const useMovies = () => {
  return useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
  });
};

export default useMovies;
