import React, { useEffect, useRef, useState } from 'react';
import styles from './TheaterSeating.module.css';
import { Seat } from './Seat';
import { Legend } from './Legend';
import ReservationForm from './ReservationForm/ReservationForm';
import { OtherOptions } from './OtherOptions/OtherOptions';
import type { SeatsMap, SeatStatus } from './types';
import { useNavigate, useParams } from 'react-router';
import { bookSeats, useSeats } from '../../api/booking';
import { formatDate } from '../../utils/date';
import { Booking, userDetails } from '../../type';
import {
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  Stack,
  Text,
} from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { useNotify } from '../../notifications/NotificationProvider';

interface BookingSummaryCardData {
  booking_id?: number;
  name?: string;
  email?: string;
  phone_number?: string;
  session_id?: number;
  seats: string[];
  movieTitle: string;
  hallNo: number;
  sessionDate: string;
  sessionTime: string;
  audio: string;
  subtitle?: string;
}

export const TheaterSeating: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [price, setPrice] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [opened, setOpened] = useState(false);
  const [bookingSummary, setBookingSummary] =
    useState<BookingSummaryCardData | null>(null);
  const downloadCardRef = useRef<HTMLDivElement | null>(null);
  const { warning } = useNotify();

  const [seats, setSeats] = useState<SeatsMap>({
    A: Array.from({ length: 10 }, (_, i) => ({
      id: `A${i + 1}`,
      status: 'available' as SeatStatus,
    })),
    B: Array.from({ length: 10 }, (_, i) => ({
      id: `B${i + 1}`,
      status: 'available' as SeatStatus,
    })),
    C: Array.from({ length: 10 }, (_, i) => ({
      id: `C${i + 1}`,
      status: 'available' as SeatStatus,
    })),
    D: Array.from({ length: 10 }, (_, i) => ({
      id: `D${i + 1}`,
      status: 'available' as SeatStatus,
    })),
    E: Array.from({ length: 10 }, (_, i) => ({
      id: `E${i + 1}`,
      status: 'available' as SeatStatus,
    })),
  });

  // Convert `id` to a number and validate it
  const numericId = Number(id); // or parseInt(id, 10)
  const { data: seatData, isLoading, isError, error } = useSeats(numericId);

  const handleSeatClick = (rowId: string, seatId: string) => {
    const currentSeat = seats[rowId].find((seat) => seat.id === seatId);
    if (!currentSeat || currentSeat.status === 'reserved') return;

    const selectedSeatsCount = Object.values(seats).reduce((count, row) => {
      return count + row.filter((seat) => seat.status === 'selected').length;
    }, 0);

    if (currentSeat.status === 'available' && selectedSeatsCount >= 5) {
      warning(
        'Vous ne pouvez sélectionner que 5 places maximum à la fois.',
        'Limite de places atteinte',
      );
      return;
    }

    setSeats((prevSeats) => {
      const newSeats = { ...prevSeats };
      const row = [...newSeats[rowId]];
      const seatIndex = row.findIndex((seat) => seat.id === seatId);

      if (seatIndex === -1 || row[seatIndex].status === 'reserved') {
        return prevSeats;
      }

      row[seatIndex] = {
        ...row[seatIndex],
        status:
          row[seatIndex].status === 'available' ? 'selected' : 'available',
      };

      newSeats[rowId] = row;
      return newSeats;
    });
  };

  const handleReserveSeats = (seatIds: string[]) => {
    setSeats((prevSeats) => {
      const newSeats = { ...prevSeats };

      // Iterate over the seat IDs to reserve
      seatIds.forEach((seatId) => {
        const [rowId, __] = seatId.split(/(\d+)/); // Split into row and number (e.g., 'A1' -> ['A', '1'])
        const row = [...newSeats[rowId]];

        // Find the seat in the row
        const seatIndex = row.findIndex((seat) => seat.id === seatId);

        // If the seat exists and is not already reserved, set it to reserved
        if (seatIndex !== -1 && row[seatIndex].status !== 'reserved') {
          row[seatIndex] = {
            ...row[seatIndex],
            status: 'reserved',
          };
          newSeats[rowId] = row;
        }
      });

      return newSeats;
    });
  };

  useEffect(() => {
    if (seatData?.seats.length) {
      handleReserveSeats(seatData.seats);
    }
  }, [seatData]);

  useEffect(() => {
    const sIds: string[] = [];
    Object.keys(seats).forEach((s) => {
      seats[s].forEach((seat) => {
        if (seat.status === 'selected') {
          sIds.push(seat.id);
        }
      });
    });
    setSelectedSeats(sIds);
    setPrice(1650 * sIds.length);
  }, [seats]);

  const handleDownload = async () => {
    if (!bookingSummary) return;
    if (!downloadCardRef.current) return;

    const bookingCode = formatBookingCode(
      bookingSummary.booking_id,
      bookingSummary.session_id
    );
    const canvas = await html2canvas(downloadCardRef.current, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
    });
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `${bookingCode}.png`;
    link.click();
  };

  const bookingMutation = useMutation({
    mutationFn: bookSeats,
    onSuccess: (response) => {
      setBookingSummary({
        ...response.bookingSummary,
        seats: Array.isArray(response.bookingSummary?.seats)
          ? response.bookingSummary.seats
          : [],
        movieTitle: seatData?.movieDetails.title ?? '',
        hallNo: seatData?.sessionDetails.hall_no ?? 0,
        sessionDate: seatData?.sessionDetails.date ?? '',
        sessionTime: seatData?.sessionDetails.time ?? '',
        audio: seatData?.sessionDetails.audio ?? '',
        subtitle: seatData?.sessionDetails.subtitle,
      });
      setOpened(true);
    },
    onError: (error) => {
      console.error('Échec de la réservation :', error);
      if (axios.isAxiosError(error)) {
        const response = error.response;
        if (response?.status === 409) {
          alert('Vous avez déjà fait une réservation pour cette session');
        } else if (response?.data?.details) {
          alert('Veuillez sélectionner d\'autres sièges');
        } else {
          alert('Une erreur est survenue. Veuillez réessayer.');
        }
      } else {
        alert('Une erreur est survenue. Veuillez réessayer.');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent, formData: userDetails) => {
    e.preventDefault();
    //! validate email??, number and name??
    //! no need for captcha (use a combination of userIp+phoneNum)
    //! if a reservation for the same session exists that has either
    //! the same IP or same phone number
    //! say "Vous avez deja fait une reservation pour cette session"
    //! add unique IP constraints on the backend as well
    //! Add a creation timestamp to the booking also (not updatable)
    const booking: Booking = {
      email: formData.email,
      name: formData.name,
      phone_number: `77${formData.phone}`,
      seats: selectedSeats,
      session_id: numericId,
    };
    bookingMutation.mutate(booking);
  };

  const formatBookingCode = (bookingId?: number, sessionId?: number) => {
    if (!bookingId) return `BK-${String(sessionId ?? numericId).padStart(3, '0')}-TMP`;
    return `BK-${String(bookingId).padStart(6, '0')}`;
  };

  const sessionDateLabel = bookingSummary?.sessionDate
    ? formatDate(bookingSummary.sessionDate, true)
    : ' N/D ';
  const bookingCodeLabel = formatBookingCode(
    bookingSummary?.booking_id,
    bookingSummary?.session_id
  );

  if (isNaN(numericId) || numericId <= 0) {
    return (
      <div>
        <h1>404 - Page non trouvée</h1>
        <p>L'identifiant du film est invalide ou non fourni.</p>
        <button onClick={() => navigate('/')}>Retour à l'accueil</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <Box p="xl" ta="center">
        <LoadingOverlay visible zIndex={1000} overlayProps={{ radius: 'lg', blur: 2 }}>
          Chargement de la sélection des places...
        </LoadingOverlay>
      </Box>
    );
  }
  if (isError) {
    return (
      <Box p="xl" ta="center">
        <Text c="red" size="lg" fw={500}>
          Erreur : {error?.message}
        </Text>
        <Button mt="md" onClick={() => window.location.reload()}>
          Recharger la page
        </Button>
      </Box>
    );
  }

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={bookingMutation.isPending || isLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />

      <div className={styles.container}>
        <div className={styles.movieInfo}>
          <h1 className={styles.title}>{seatData?.movieDetails.title}</h1>
          <div className={styles.details}>
            <span>
              Audio : {seatData?.sessionDetails.audio}
              {seatData?.sessionDetails.subtitle &&
                ` | Sous-titres : ${seatData?.sessionDetails.subtitle}`}
            </span>
            <div className={styles.showtime}>
              <span className={styles.date}>
                {formatDate(seatData?.sessionDetails.date!, true)}
                {seatData?.sessionDetails.time}
              </span>
              <span className={styles.hall}>
                Salle {seatData?.sessionDetails.hall_no}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.screen}>
          <div className={styles.screenText}>L'ÉCRAN EST ICI</div>
        </div>
        <Legend />

        <div className={styles.seatingScroll}>
          <div className={styles.seatingArea}>
            {Object.entries(seats).map(([rowId, rowSeats]) => (
              <div key={rowId} className={styles.row}>
                <div className={styles.rowLabel}>{rowId}</div>
                <div className={styles.seats}>
                  {rowSeats.slice(0, 5).map((seat) => (
                    <Seat
                      key={seat.id}
                      status={seat.status}
                      onClick={() => handleSeatClick(rowId, seat.id)}
                      seatNumber={seat.id.slice(1)}
                    />
                  ))}
                  <div className={styles.aisle} />
                  {rowSeats.slice(5).map((seat) => (
                    <Seat
                      key={seat.id}
                      status={seat.status}
                      onClick={() => handleSeatClick(rowId, seat.id)}
                      seatNumber={seat.id.slice(1)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <ReservationForm onSubmit={handleSubmit} price={price} />
        <OtherOptions />
      </div>
      <Modal
        opened={opened}
        onClose={() => {
          window.location.reload();
        }}
        title="Confirmation de votre réservation"
        centered
        closeOnClickOutside={false}
        size="lg"
      >
        <Stack align="center">
          <Alert
            color="green"
            radius="md"
            title="Réservation réussie !"
            variant="light"
            w="100%"
          >
            Votre place de cinéma a été réservée. Présentez cette carte de
            réservation au guichet.
          </Alert>
          <Paper
            w="100%"
            shadow="sm"
            radius="md"
            p="md"
            withBorder
            style={{ background: '#fbfcff' }}
          >
            <Group justify="space-between" mb="xs">
              <Text fw={700}>Résumé de la réservation</Text>
              <Badge color="grape" variant="filled" size="lg">
                {bookingCodeLabel}
              </Badge>
            </Group>
            <Text size="xs" c="dimmed" mb="sm">
              Conservez ce code de réservation pour l'enregistrement.
            </Text>
            <Divider mb="sm" />
            <Stack gap={6}>
              <Text size="sm">
                <strong>Nom :</strong> {bookingSummary?.name || 'N/D'}
              </Text>
              <Text size="sm">
                <strong>E-mail :</strong> {bookingSummary?.email || 'N/D'}
              </Text>
              <Text size="sm">
                <strong>Téléphone :</strong> {bookingSummary?.phone_number || 'N/D'}
              </Text>
              <Text size="sm">
                <strong>Film :</strong> {bookingSummary?.movieTitle || 'N/D'}
              </Text>
              <Text size="sm">
                <strong>Séance :</strong> Salle {bookingSummary?.hallNo} |{' '}
                {sessionDateLabel}
                {bookingSummary?.sessionTime || ''}
              </Text>
              <Text size="sm">
                <strong>Audio/Sous-titres :</strong> {bookingSummary?.audio || 'N/D'}
                {bookingSummary?.subtitle
                  ? ` / ${bookingSummary.subtitle}`
                  : ' / Aucun'}
              </Text>
              <Text size="sm">
                <strong>Places :</strong> {bookingSummary?.seats.join(', ') || 'N/D'}
              </Text>
            </Stack>
          </Paper>
          <Paper
            shadow="xs"
            radius="md"
            p="sm"
            bg="#fff3cd"
            style={{ border: '1px solid #ffeeba' }}
          >
            <Text size="sm" ta="center" c="black">
              Cette réservation expire si vous n'arrivez pas au moins 1 heure
              avant la séance. Veuillez faire une capture d'écran de cette carte
              ou l'enregistrer en image.
            </Text>
          </Paper>
          <Button onClick={() => void handleDownload()} variant="outline">
            Télécharger l'image de réservation
          </Button>
        </Stack>
      </Modal>
      {bookingSummary && (
        <div
          ref={downloadCardRef}
          style={{
            position: 'fixed',
            top: 0,
            left: '-10000px',
            width: '760px',
            padding: '28px',
            background: '#ffffff',
            color: '#111111',
            fontFamily: 'Arial, Helvetica, sans-serif',
            border: '2px solid #111111',
            borderRadius: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px solid #111111',
              paddingBottom: '12px',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 700 }}>
              Réservation Cinéma DJ
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 700,
                border: '1px solid #111111',
                borderRadius: '999px',
                padding: '6px 12px',
              }}
            >
              {bookingCodeLabel}
            </div>
          </div>
          <div style={{ fontSize: '16px', marginBottom: '10px' }}>
            Nom : {bookingSummary.name || 'N/D'}
          </div>
          <div style={{ fontSize: '16px', marginBottom: '10px' }}>
            E-mail : {bookingSummary.email || 'N/D'}
          </div>
          <div style={{ fontSize: '16px', marginBottom: '10px' }}>
            Téléphone : {bookingSummary.phone_number || 'N/D'}
          </div>
          <div style={{ fontSize: '16px', marginBottom: '10px' }}>
            Film : {bookingSummary.movieTitle || 'N/D'}
          </div>
          <div style={{ fontSize: '16px', marginBottom: '10px' }}>
            Séance : Salle {bookingSummary.hallNo} | {sessionDateLabel}
            {bookingSummary.sessionTime || ''}
          </div>
          <div style={{ fontSize: '16px', marginBottom: '10px' }}>
            Audio/Sous-titres : {bookingSummary.audio || 'N/D'}
            {bookingSummary.subtitle ? ` / ${bookingSummary.subtitle}` : ' / Aucun'}
          </div>
          <div style={{ fontSize: '16px', marginBottom: '18px' }}>
            Places : {bookingSummary.seats.join(', ') || 'N/D'}
          </div>
          <div
            style={{
              borderTop: '2px dashed #111111',
              paddingTop: '14px',
              fontSize: '15px',
              fontWeight: 700,
            }}
          >
            Cette réservation expire si vous n'arrivez pas au moins 1 heure
            avant la séance.
          </div>
        </div>
      )}
    </Box>
  );
};
