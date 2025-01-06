import { useState } from 'react';
import { Button, Select, Grid, TextInput, NumberInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import axios from 'axios';

const AddSession = ({ movies }) => {
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>('');
  const [audio, setAudio] = useState('English');
  const [subtitle, setSubtitle] = useState('');
  const [hallNo, setHallNo] = useState(1);

  const handleSubmit = async () => {
    if (!selectedMovie || !date || !time) {
      alert('Please fill all fields');
      return;
    }

    const sessionData = {
      movie_id: parseInt(selectedMovie),
      audio,
      subtitle,
      hall_no: hallNo,
      date: date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      time,
    };

    try {
      const response = await axios.post(
        'http://localhost:3000/admin/sessions',
        sessionData
      );
      alert(`Session added with ID: ${response.data.id}`);
    } catch (error) {
      alert('Failed to add session');
      console.error(error);
    }
  };

  return (
    <Grid>
      <Grid.Col span={6}>
        <Select
          label="Select Movie"
          placeholder="Pick a movie"
          data={movies.map((movie) => ({
            value: movie.id.toString(),
            label: movie.title,
          }))}
          value={selectedMovie}
          onChange={setSelectedMovie}
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
        <TextInput
          label="Audio"
          value={audio}
          onChange={(e) => setAudio(e.target.value)}
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
        <NumberInput
          label="Hall Number"
          value={hallNo}
          onChange={(value) => setHallNo(value)}
          required
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <Button onClick={handleSubmit}>Add Session</Button>
      </Grid.Col>
    </Grid>
  );
};

export default AddSession;
