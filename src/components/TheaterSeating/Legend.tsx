import React from 'react';
import styles from './Legend.module.css';

export const Legend: React.FC = () => {
  return (
    <div className={styles.legend}>
      <div className={styles.legendItem}>
        <div className={`${styles.legendSeat} ${styles.available}`} />
        <span>Disponible</span>
      </div>
      <div className={styles.legendItem}>
        <div className={`${styles.legendSeat} ${styles.selected}`} />
        <span>Sélectionné</span>
      </div>
      <div className={styles.legendItem}>
        <div className={`${styles.legendSeat} ${styles.reserved}`} />
        <span>Réservé</span>
      </div>
    </div>
  );
};