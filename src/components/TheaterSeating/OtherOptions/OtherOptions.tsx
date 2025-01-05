import React from 'react';
import styles from './OtherOptions.module.css';

export const OtherOptions: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>OTHER OPTIONS</h2>
      <div className={styles.options}>
        <div className={styles.option}>
          <h3>Book via Facebook</h3>
          <p>Click the button to open chat with operator.</p>
          <button className={styles.chatButton}>
            Open chat
          </button>
        </div>
        <div className={styles.option}>
          <h3>Book via phone</h3>
          <p>Call directly to our operator for reservation.</p>
          <a href="tel:+903924443777" className={styles.phone}>
            +90 392 444 37 77
          </a>
        </div>
      </div>
    </div>
  );
};