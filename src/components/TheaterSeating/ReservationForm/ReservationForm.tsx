import React, { useState } from 'react';
import styles from './ReservationForm.module.css';
import { userDetails } from '../../../type';
import { Grid, Text } from '@mantine/core';

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

  const [errors, setErrors] = useState({
    email: '',
    phone: '',
    name: '',
  });

  const phonePrefix = '77';

  const formatPhone = (digits: string) => {
    return `${phonePrefix} ${digits.slice(0, 2)} ${digits.slice(
      2,
      4
    )} ${digits.slice(4, 6)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.startsWith(phonePrefix)) {
      value = value.slice(phonePrefix.length);
    }

    if (value.length > 6) value = value.slice(0, 6);

    setFormData({ ...formData, phone: value });
    setErrors({ ...errors, phone: '' });
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { email: '', phone: '', name: '' };

    if (
      !formData.email ||
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
    ) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (formData.phone.length !== 6) {
      newErrors.phone = 'Phone number must be 6 digits after "77"';
      isValid = false;
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(e, formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid className={styles.formContainer}>
        <Grid.Col span={{ base: 12, sm: 6 }} className={styles.formSection}>
          <input
            placeholder="E-mail"
            value={formData.email}
            required
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={styles.input}
          />
          {errors.email && (
            <Text c="red" size="xs">
              {errors.email}
            </Text>
          )}

          <input
            placeholder="77 XX XX XX"
            required
            value={formatPhone(formData.phone)}
            onChange={handlePhoneChange}
            className={styles.input}
          />
          {errors.phone && (
            <Text c="red" size="xs">
              {errors.phone}
            </Text>
          )}

          <input
            placeholder="Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={styles.input}
          />
          {errors.name && (
            <Text c="red" size="xs">
              {errors.name}
            </Text>
          )}
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
            Please note, that you must come to cinema <strong>1 hour</strong>{' '}
            before the session start to purchase your ticket or your reservation
            will be <strong>cancelled</strong>.
          </div>
        </Grid.Col>
      </Grid>
    </form>
  );
};

export default ReservationForm;
