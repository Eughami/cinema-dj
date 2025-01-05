import React from 'react';
import styles from './Seat.module.css';

interface SeatProps {
  status: 'available' | 'selected' | 'reserved';
  onClick: () => void;
  seatNumber: string;
}

export const Seat: React.FC<SeatProps> = ({ status, onClick, seatNumber }) => {
  return (
    <button
      className={`${styles.seat} ${styles[status]}`}
      onClick={onClick}
      disabled={status === 'reserved'}
    >
      {seatNumber}
    </button>
  );
};