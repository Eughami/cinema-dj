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
      newErrors.email = 'Veuillez saisir un e-mail valide';
      isValid = false;
    }

    if (formData.phone.length !== 6) {
      newErrors.phone = 'Le numéro doit comporter 6 chiffres après « 77 »';
      isValid = false;
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
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
        <Grid.Col span={{ base: 12, sm: 12 }} className={styles.formSection}>
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
          {errors.email && (
            <Text c="red" size="xs">
              {errors.email}
            </Text>
          )}

          <input
            type="tel"
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
            type="text"
            placeholder="Nom"
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

        <Grid.Col span={{ base: 12, sm: 12 }} className={styles.priceSection}>
          <div className={styles.price}>
            <img
              src="/ticket-icon.svg"
              alt="Billet"
              className={styles.ticketIcon}
            />
            <span className={styles.amount}>{price} DJF</span>
          </div>
          <button className={styles.reserveButton}>RÉSERVATION DE BILLET</button>
          <div className={styles.notice}>
            Veuillez noter que vous devez venir au cinéma <strong>1 heure</strong>{' '}
            avant le début de la séance pour acheter votre billet, sinon votre
            réservation sera <strong>annulée</strong>.
          </div>
        </Grid.Col>
      </Grid>
    </form>
  );
};

export default ReservationForm;
