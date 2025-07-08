import React from 'react';
import styles from './OtherOptions.module.css';
import { Button } from '@mantine/core';
import { FaFacebookMessenger } from 'react-icons/fa';

export const OtherOptions: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>OTHER OPTIONS</h2>
      <div className={styles.options}>
        <div className={styles.option}>
          <h3>Book via Facebook</h3>
          <p>Click the button to open chat with operator.</p>
          {/* <button className={styles.chatButton}>Open chat</button> */}
          <Button
            className={styles.chatButton}
            mt="md"
            component="a"
            href="https://m.me/StarCinemasDjibouti"
            target="_blank"
            rel="noopener noreferrer"
            color="blue"
            leftSection={<FaFacebookMessenger size={18} />}
          >
            Open chat
          </Button>
        </div>
        <div className={styles.option}>
          <h3>Book via phone</h3>
          <p>Call directly to our operator for reservation.</p>
          <a href="tel:+903924443777" className={styles.phone}>
            +253 21 25 21 21
          </a>
        </div>
      </div>
    </div>
  );
};
