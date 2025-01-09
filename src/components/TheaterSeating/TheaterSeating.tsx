import React, { useEffect, useState } from 'react';
import styles from './TheaterSeating.module.css';
import { Seat } from './Seat';
import { Legend } from './Legend';
import ReservationForm from './ReservationForm/ReservationForm';
import { OtherOptions } from './OtherOptions/OtherOptions';
import type { SeatsMap, SeatStatus } from './types';
import { useNavigate, useParams } from 'react-router';
import { useBookSeat, useSeats } from '../../api/booking';
import { formatDate } from '../../utils/date';
import { Booking, userDetails } from '../../type';
import { Box, LoadingOverlay } from '@mantine/core';

export const TheaterSeating: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [price, setPrice] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const [seats, setSeats] = useState<SeatsMap>({
    A: Array.from({ length: 10 }, (_, i) => ({
      id: `A${i + 1}`,
      status: 'available' as SeatStatus,
    })),
    B: Array.from({ length: 10 }, (_, i) => ({
      id: `B${i + 1}`,
      status: 'available' as SeatStatus,
    })),
    C: Array.from({ length: 10 }, (_, i) => ({
      id: `C${i + 1}`,
      status: 'available' as SeatStatus,
    })),
    D: Array.from({ length: 10 }, (_, i) => ({
      id: `D${i + 1}`,
      status: 'available' as SeatStatus,
    })),
    E: Array.from({ length: 10 }, (_, i) => ({
      id: `E${i + 1}`,
      status: 'available' as SeatStatus,
    })),
  });

  // Convert `id` to a number and validate it
  const numericId = Number(id); // or parseInt(id, 10)
  const { data, isLoading, isError, error } = useSeats(numericId);
  const { mutate, isPending } = useBookSeat();

  const handleSeatClick = (rowId: string, seatId: string) => {
    setSeats((prevSeats) => {
      const newSeats = { ...prevSeats };
      const row = [...newSeats[rowId]];
      const seatIndex = row.findIndex((seat) => seat.id === seatId);

      if (row[seatIndex].status === 'reserved') return prevSeats;

      row[seatIndex] = {
        ...row[seatIndex],
        status:
          row[seatIndex].status === 'available' ? 'selected' : 'available',
      };

      newSeats[rowId] = row;
      // if more than 5 seats are selected return old state
      let count = 0;
      Object.keys(newSeats).map((s) => {
        newSeats[s].forEach((seat) => {
          if (seat.status === 'selected') {
            count++;
          }
        });
      });
      if (count > 5) {
        alert('You can only select up to 5 seats at once');
        return prevSeats;
      }
      return newSeats;
    });
  };

  const handleReserveSeats = (seatIds: string[]) => {
    setSeats((prevSeats) => {
      const newSeats = { ...prevSeats };

      // Iterate over the seat IDs to reserve
      seatIds.forEach((seatId) => {
        const [rowId, seatNumber] = seatId.split(/(\d+)/); // Split into row and number (e.g., 'A1' -> ['A', '1'])
        const row = [...newSeats[rowId]];

        // Find the seat in the row
        const seatIndex = row.findIndex((seat) => seat.id === seatId);

        // If the seat exists and is not already reserved, set it to reserved
        if (seatIndex !== -1 && row[seatIndex].status !== 'reserved') {
          row[seatIndex] = {
            ...row[seatIndex],
            status: 'reserved',
          };
          newSeats[rowId] = row;
        }
      });

      return newSeats;
    });
  };

  useEffect(() => {
    if (data?.seats.length) {
      handleReserveSeats(data.seats);
    }
  }, [data]);
  useEffect(() => {
    console.log('Seats updated');
    const sIds: string[] = [];
    Object.keys(seats).map((s) => {
      seats[s].forEach((seat) => {
        if (seat.status === 'selected') {
          sIds.push(seat.id);
        }
      });
    });
    setSelectedSeats(sIds);
    setPrice(1650 * sIds.length);
  }, [seats]);

  const handleSubmit = (e: React.FormEvent, formData: userDetails) => {
    e.preventDefault();
    console.log({ formData, selectedSeats });
    /**
     * export interface Booking {
        id: number;
        session_id: number;
        name: string;
        email: string;
        phone_number: string;
        seats: string[];
      }
     */
    //TODO. in future check ip address
    const booking: Booking = {
      email: formData.email,
      name: formData.name,
      phone_number: formData.phone,
      seats: selectedSeats,
      session_id: numericId,
    };
    mutate(booking);
  };

  if (isNaN(numericId) || numericId <= 0) {
    return (
      <div>
        <h1>404 - Page Not Found</h1>
        <p>The movie ID is invalid or not provided.</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isPending}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />

      <div className={styles.container}>
        <div className={styles.movieInfo}>
          <h1 className={styles.title}>{data?.movieDetails.title}</h1>
          <div className={styles.details}>
            <span>
              Audio: {data?.sessionDetails.audio}
              {data?.sessionDetails.subtitle &&
                ` | Subtitles: ${data?.sessionDetails.subtitle}`}
            </span>
            <div className={styles.showtime}>
              <span className={styles.date}>
                {formatDate(data?.sessionDetails.date, true)}
                {data?.sessionDetails.time}
              </span>
              <span className={styles.hall}>
                Salon {data?.sessionDetails.hall_no}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.screen}>
          <div className={styles.screenText}>SCREEN IS HERE</div>
        </div>
        <Legend />

        <div className={styles.seatingArea}>
          {Object.entries(seats).map(([rowId, rowSeats]) => (
            <div key={rowId} className={styles.row}>
              <div className={styles.rowLabel}>{rowId}</div>
              <div className={styles.seats}>
                {rowSeats.slice(0, 5).map((seat) => (
                  <Seat
                    key={seat.id}
                    status={seat.status}
                    onClick={() => handleSeatClick(rowId, seat.id)}
                    seatNumber={seat.id.slice(1)}
                  />
                ))}
                <div className={styles.aisle} />
                {rowSeats.slice(5).map((seat) => (
                  <Seat
                    key={seat.id}
                    status={seat.status}
                    onClick={() => handleSeatClick(rowId, seat.id)}
                    seatNumber={seat.id.slice(1)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <ReservationForm onSubmit={handleSubmit} price={price} />
        <OtherOptions />
      </div>
    </Box>
  );
};
