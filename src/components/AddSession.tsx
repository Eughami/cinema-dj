import { useState, useEffect } from 'react';
import {
  Alert,
  Badge,
  Button,
  Chip,
  Grid,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import axios from 'axios';
import { FiCalendar, FiInfo } from 'react-icons/fi';
import { getAdminRequestConfig, toApiUrl } from '../config';

type SessionFormData = {
  id: number;
  movie_id: number;
  audio: string;
  subtitle?: string;
  hall_no: number;
  date: string;
  time: string;
};

type Iprops = {
  mId: string | number;
  mTitle: string;
  session: SessionFormData | null;
  onSuccess: () => void;
};

const SCHEDULABLE_DAYS_COUNT = 21;
const DEFAULT_SELECTED_DAYS_COUNT = 7;

const toIsoDate = (value: Date): string => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const fromIsoDate = (value: string): Date => new Date(`${value}T00:00:00`);

const buildDateList = (startAtTomorrow = true, count = SCHEDULABLE_DAYS_COUNT) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: count }, (_, index) => {
    const day = new Date(today);
    day.setDate(day.getDate() + index + (startAtTomorrow ? 1 : 0));
    return toIsoDate(day);
  });
};

const AddSession = (props: Iprops): JSX.Element => {
  const { mId, mTitle, session, onSuccess } = props;
  const [date, setDate] = useState<Date | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [time, setTime] = useState<string>('');
  const [audio, setAudio] = useState('Français');
  const [subtitle, setSubtitle] = useState('');
  const [hallNo, setHallNo] = useState(1);

  const dateOptions = buildDateList();

  useEffect(() => {
    if (session) {
      setDate(fromIsoDate(session.date));
      setSelectedDates([session.date]);
      setTime(session.time);
      setAudio(session.audio);
      setSubtitle(session.subtitle || '');
      setHallNo(session.hall_no);
      return;
    }

    const defaults = dateOptions.slice(0, DEFAULT_SELECTED_DAYS_COUNT);
    setDate(fromIsoDate(defaults[0]));
    setSelectedDates(defaults);
  }, [session]);

  const handleSubmit = async () => {
    if (!mId || !time) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (!session && selectedDates.length === 0) {
      alert('Sélectionnez au moins un jour pour créer des séances');
      return;
    }

    const normalizedTime = time.trim();
    const basePayload = {
      movie_id: Number(mId),
      audio,
      subtitle,
      hall_no: hallNo,
      time: normalizedTime,
    };

    try {
      if (session) {
        if (!date) {
          alert('Veuillez sélectionner une date');
          return;
        }

        await axios.put(
          toApiUrl(`/admin/sessions/${session.id}`),
          {
            ...basePayload,
            date: toIsoDate(date),
          },
          getAdminRequestConfig()
        );
        onSuccess();
      } else {
        const createRequests = selectedDates.map((selectedDate) =>
          axios.post(
            toApiUrl('/admin/sessions'),
            {
              ...basePayload,
              date: selectedDate,
            },
            getAdminRequestConfig()
          )
        );

        const results = await Promise.allSettled(createRequests);
        const createdCount = results.filter(
          (result) => result.status === 'fulfilled'
        ).length;
        const failedCount = results.length - createdCount;

        if (createdCount === 0) {
          alert(
            'Aucune séance créée. Vérifiez les conflits salle/date/heure et réessayez.'
          );
          return;
        }

        if (failedCount > 0) {
          alert(
            `${createdCount} séance(s) créée(s), ${failedCount} échouée(s) (probablement salle/date/heure en double).`
          );
        }

        onSuccess();
        return;
      }
    } catch (error) {
      alert("Échec de l'ajout / mise à jour de la séance");
      console.error(error);
    }
  };

  return (
    <Grid>
      <Grid.Col span={6}>
        <Select
          label="Choisir le film"
          placeholder="Choisir un film"
          data={[
            {
              value: mId.toString(),
              label: mTitle,
            },
          ]}
          value={mId.toString()}
          disabled
          required
        />
      </Grid.Col>
      <Grid.Col span={session ? 6 : 12}>
        <TextInput
          label="Choisir l'heure"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          type="time"
          placeholder="18:30"
          required
        />
      </Grid.Col>
      {session && (
        <Grid.Col span={6}>
          <DateInput
            label="Choisir la date"
            value={date}
            onChange={setDate}
            required
          />
        </Grid.Col>
      )}
      <Grid.Col span={6}>
        <Select
          label="Audio"
          placeholder="Choisir une langue"
          data={['Français', 'Anglais']}
          value={audio}
          onChange={(e) => setAudio(e || '')}
          required
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <TextInput
          label="Sous-titres"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Select
          label="Choisir le numéro de salle"
          placeholder="Choisir un numéro de salle ..."
          data={['1', '2']}
          value={hallNo.toString()}
          onChange={(e) => setHallNo(parseInt(e || '', 10))}
          required
        />
      </Grid.Col>
      {!session && (
        <Grid.Col span={12}>
          <Stack gap="xs">
            <Group justify="space-between">
              <Title order={5}>Choisir les jours de séance</Title>
              <Badge variant="light" color="cyan" leftSection={<FiCalendar />}>
                {selectedDates.length} sélectionné(s)
              </Badge>
            </Group>
            <Alert
              variant="light"
              color="cyan"
              icon={<FiInfo />}
              title="Création en masse activée"
            >
              Par défaut, demain + les 6 prochains jours sont sélectionnés. Activez
              ou désactivez des jours pour créer la même séance à la même heure
              sur toutes les dates sélectionnées.
            </Alert>
            <Chip.Group
              multiple
              value={selectedDates}
              onChange={setSelectedDates}
            >
              <Group gap="xs">
                {dateOptions.map((dateOption) => {
                  const parsedDate = fromIsoDate(dateOption);
                  return (
                    <Chip key={dateOption} value={dateOption} radius="md">
                      {parsedDate.toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </Chip>
                  );
                })}
              </Group>
            </Chip.Group>
            <Text size="sm" c="dimmed">
              Les conflits pour les combinaisons salle/date/heure existantes sont ignorés.
            </Text>
          </Stack>
        </Grid.Col>
      )}
      <Grid.Col span={12}>
        <Button onClick={handleSubmit}>
          {session ? 'Mettre à jour la séance' : 'Créer les séances'}
        </Button>
      </Grid.Col>
    </Grid>
  );
};

export default AddSession;
