import React, { useState } from 'react';
import styles from './TheaterSeating.module.css';
import { Seat } from './Seat';
import { Legend } from './Legend';
import { ReservationForm } from './ReservationForm/ReservationForm';
import { OtherOptions } from './OtherOptions/OtherOptions';
import type { SeatsMap, SeatStatus } from './types';

export const TheaterSeating: React.FC = () => {
  const [seats, setSeats] = useState<SeatsMap>({
    'A': Array.from({ length: 10 }, (_, i) => ({
      id: `A${i + 1}`,
      status: 'available' as SeatStatus
    })),
    'B': Array.from({ length: 10 }, (_, i) => ({
      id: `B${i + 1}`,
      status: 'available' as SeatStatus
    })),
    'C': Array.from({ length: 10 }, (_, i) => ({
      id: `C${i + 1}`,
      status: 'available' as SeatStatus
    })),
    'D': Array.from({ length: 10 }, (_, i) => ({
      id: `D${i + 1}`,
      status: 'available' as SeatStatus
    })),
    'E': Array.from({ length: 10 }, (_, i) => ({
      id: `E${i + 1}`,
      status: Math.random() > 0.7 ? 'reserved' : 'available' as SeatStatus
    }))
  });

  const handleSeatClick = (rowId: string, seatId: string) => {
    setSeats(prevSeats => {
      const newSeats = { ...prevSeats };
      const row = [...newSeats[rowId]];
      const seatIndex = row.findIndex(seat => seat.id === seatId);
      
      if (row[seatIndex].status === 'reserved') return prevSeats;
      
      row[seatIndex] = {
        ...row[seatIndex],
        status: row[seatIndex].status === 'available' ? 'selected' : 'available'
      };
      
      newSeats[rowId] = row;
      return newSeats;
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.movieInfo}>
        <h1 className={styles.title}>Mufasa: The Lion King (2024)</h1>
        <div className={styles.details}>
          <span>Audio: English | Subtitles: Turkish</span>
          <div className={styles.showtime}>
            <span className={styles.date}>06 January 2025 11:40</span>
            <span className={styles.hall}>Jupiter Hall</span>
          </div>
        </div>
      </div>

      <div className={styles.screen}>
        <div className={styles.screenText}>SCREEN IS HERE</div>
      </div>

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

      <Legend />
      <ReservationForm />
      <OtherOptions />
    </div>
  );
};