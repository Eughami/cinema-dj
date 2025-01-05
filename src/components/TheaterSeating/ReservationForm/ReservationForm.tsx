import React, { useState } from 'react';
import styles from './ReservationForm.module.css';

export const ReservationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formSection}>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={styles.input}
          />
          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className={styles.input}
          />
          <input
            type="text"
            placeholder="First \ Last name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={styles.input}
          />
          <div className={styles.captcha}>
            {/* Placeholder for reCAPTCHA */}
            <div className={styles.captchaPlaceholder}>I'm not a robot</div>
          </div>
        </form>
      </div>

      <div className={styles.priceSection}>
        <div className={styles.price}>
          <img
            src="/ticket-icon.svg"
            alt="Ticket"
            className={styles.ticketIcon}
          />
          <span className={styles.amount}>440TL</span>
        </div>
        <button className={styles.reserveButton}>TICKET RESERVATION</button>
        <div className={styles.notice}>
          Please note, that you must come to cinema <strong>1 hour</strong>{' '}
          before the session start to purchase your ticket or your reservation
          will be <strong>cancelled</strong>.
        </div>
      </div>
    </div>
  );
};
