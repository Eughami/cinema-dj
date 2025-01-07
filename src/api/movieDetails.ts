import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Movie } from '../type';

const fetchMovie = async (id: number) => {
  const response = await axios.get(`http://localhost:3000/movies/${id}`);
  return response.data as Movie;
};

const useMovie = (id: number) => {
  return useQuery({
    queryKey: ['movie'], // Unique key for the query
    queryFn: () => fetchMovie(id), // Function to fetch data
  });
};

export default useMovie;
