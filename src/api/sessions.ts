import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Session } from '../type';
import { toApiUrl } from '../config';

const fetchSessions = async () => {
  const response = await axios.get(toApiUrl('/sessions'));
  return response.data as Session[];
};

const useSessions = () => {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: fetchSessions,
  });
};

export default useSessions;
