import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Movie } from '../type';

const fetchMovies = async () => {
  const response = await axios.get('https://cinema-api.eughami.com/movies');
  return response.data as Movie[];
};

const useMovies = () => {
  return useQuery({
    queryKey: ['movies'], // Unique key for the query
    queryFn: fetchMovies, // Function to fetch data
  });
};

export default useMovies;
