import { useState } from 'react';
import { Text } from '@mantine/core';
import styles from './SeatingLayout.module.css';

const SeatingLayout = () => {
  const [seats, setSeats] = useState([
    { id: 'A1', status: 'available' },
    { id: 'A2', status: 'available' },
    { id: 'A3', status: 'reserved' },
    { id: 'A4', status: 'available' },
    { id: 'A5', status: 'available' },
    { id: 'A6', status: 'available' },
    // Add more seats as needed
  ]);

  const handleSeatClick = (id: string) => {
    setSeats(
      seats.map((seat) =>
        seat.id === id
          ? {
              ...seat,
              status: seat.status === 'selected' ? 'available' : 'selected',
            }
          : seat
      )
    );
  };

  return (
    <div className={styles.seatingLayout}>
      <div className={styles.row}>
        {seats.map((seat) => (
          <div
            key={seat.id}
            className={`${styles.seat} ${styles[seat.status]}`}
            onClick={() =>
              seat.status !== 'reserved' && handleSeatClick(seat.id)
            }
          >
            {seat.id}
          </div>
        ))}
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.available}`}></div>
          <Text>Available</Text>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.reserved}`}></div>
          <Text>Reserved</Text>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.selected}`}></div>
          <Text>Selected</Text>
        </div>
      </div>
    </div>
  );
};

export default SeatingLayout;
