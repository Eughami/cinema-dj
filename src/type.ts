export interface Movie {
  id: number;
  image: string;
  title: string;
  wide_image?: string | null;
  release_date: string;
  genre?: string;
  description: string;
  duration: number;
  actors?: string;
}

export interface Session {
  id: number;
  movie_id: number;
  audio: string;
  subtitle?: string;
  hall_no: number;
  date: string;
  time: string;
}

export interface Booking {
  session_id: number;
  name: string;
  email: string;
  phone_number: string;
  seats: string[];
}

export interface userDetails {
  email: string;
  phone: string;
  name: string;
}
