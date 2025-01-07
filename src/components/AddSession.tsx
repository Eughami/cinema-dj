import { useState, useEffect } from 'react';
import { Button, Select, Grid, TextInput, NumberInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import axios from 'axios';

const AddSession = ({ mId, mTitle, session, onSuccess }) => {
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>('');
  const [audio, setAudio] = useState('English');
  const [subtitle, setSubtitle] = useState('');
  const [hallNo, setHallNo] = useState(1);

  useEffect(() => {
    if (session) {
      setSelectedMovie(session.movie_id.toString());
      setDate(new Date(session.date));
      setTime(session.time);
      setAudio(session.audio);
      setSubtitle(session.subtitle);
      setHallNo(session.hall_no);
    }
  }, [session]);

  const handleSubmit = async () => {
    console.log({ selectedMovie });
    if (!mId || !date || !time) {
      alert('Please fill all fields');
      return;
    }

    const sessionData = {
      movie_id: parseInt(mId),
      audio,
      subtitle,
      hall_no: hallNo,
      date: date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      time,
    };

    try {
      if (session) {
        await axios.put(
          `http://localhost:3000/admin/sessions/${session.id}`,
          sessionData
        );
      } else {
        await axios.post('http://localhost:3000/admin/sessions', sessionData);
      }
      onSuccess();
    } catch (error) {
      alert('Failed to add/update session');
      console.error(error);
    }
  };

  return (
    <Grid>
      <Grid.Col span={6}>
        <Select
          label="Select Movie"
          placeholder="Pick a movie"
          data={[
            {
              value: mId.toString(),
              label: mTitle,
            },
          ]}
          value={mId.toString()}
          disabled
          // onChange={setSelectedMovie}
          required
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <DateInput
          label="Select Date"
          value={date}
          onChange={setDate}
          required
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <TextInput
          label="Select Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Select
          label="Audio"
          placeholder="Select a language"
          data={['English', 'French']}
          value={audio}
          onChange={(e) => setAudio(e)}
          required
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <TextInput
          label="Subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Select
          label="Select Hall Number"
          placeholder="Select a hall number ..."
          data={['1', '2']}
          value={hallNo.toString()}
          onChange={(e) => setHallNo(parseInt(e, 10))}
          required
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <Button onClick={handleSubmit}>
          {session ? 'Update Session' : 'Add Session'}
        </Button>
      </Grid.Col>
    </Grid>
  );
};

export default AddSession;
