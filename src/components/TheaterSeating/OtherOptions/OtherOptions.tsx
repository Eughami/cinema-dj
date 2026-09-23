import React from 'react';
import styles from './OtherOptions.module.css';
import { Button } from '@mantine/core';
import { FaFacebookMessenger } from 'react-icons/fa';

export const OtherOptions: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>AUTRES OPTIONS</h2>
      <div className={styles.options}>
        <div className={styles.option}>
          <h3>Réserver via Facebook</h3>
          <p>Cliquez sur le bouton pour ouvrir le chat avec un opérateur.</p>
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
            Ouvrir le chat
          </Button>
        </div>
        <div className={styles.option}>
          <h3>Réserver par téléphone</h3>
          <p>Appelez directement notre opérateur pour réserver.</p>
          <a href="tel:+903924443777" className={styles.phone}>
            +253 21 25 21 21
          </a>
        </div>
      </div>
    </div>
  );
};
