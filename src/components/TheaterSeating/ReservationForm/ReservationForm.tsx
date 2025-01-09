import React, { useState } from 'react';
import styles from './ReservationForm.module.css';
import { userDetails } from '../../../type';
import { Grid } from '@mantine/core';

interface IReservationFormProps {
  onSubmit: (e: React.FormEvent, formData: userDetails) => void;
  price: number;
}
const ReservationForm = (props: IReservationFormProps) => {
  const { onSubmit, price } = props;
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    name: '',
  });

  return (
    <form onSubmit={(e) => onSubmit(e, formData)}>
      <Grid className={styles.formContainer}>
        <Grid.Col span={{ base: 12, sm: 6 }} className={styles.formSection}>
          <input
            type="email"
            placeholder="E-mail"
            value={formData.email}
            required
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={styles.input}
          />
          <input
            type="tel"
            placeholder="Phone"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={styles.input}
          />
          <div className={styles.captcha}>
            {/* Placeholder for reCAPTCHA */}
            <div className={styles.captchaPlaceholder}>I'm not a robot</div>
          </div>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }} className={styles.priceSection}>
          <div className={styles.price}>
            <img
              src="/ticket-icon.svg"
              alt="Ticket"
              className={styles.ticketIcon}
            />
            <span className={styles.amount}>{price} DJF</span>
          </div>
          <button className={styles.reserveButton}>TICKET RESERVATION</button>
          <div className={styles.notice}>
            Please note, that you must come to cinema <strong>1 hour </strong>
            before the session start to purchase your ticket or your reservation
            will be <strong>cancelled</strong>.
          </div>
        </Grid.Col>
      </Grid>
    </form>
  );
};

export default ReservationForm;
