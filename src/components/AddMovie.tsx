import { useState } from 'react';
import {
  Button,
  TextInput,
  NumberInput,
  Textarea,
  Grid,
  FileInput,
} from '@mantine/core';
import axios from 'axios';
import { DateInput } from '@mantine/dates';

const AddMovie = () => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(0);
  const [genre, setGenre] = useState('');
  const [actors, setActors] = useState('');
  const [releaseDate, setReleaseDate] = useState<Date | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [wideImage, setWideImage] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dd = releaseDate?.toISOString().split('T')[0] ?? '';
    const formData = new FormData();
    formData.append('title', title);
    formData.append('duration', duration.toString());
    formData.append('genre', genre);
    formData.append('actors', actors);
    formData.append('release_date', dd);
    formData.append('description', description);
    if (image) formData.append('image', image);
    if (wideImage) formData.append('wide_image', wideImage);

    try {
      const response = await axios.post(
        'http://localhost:3000/admin/movies',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert(`Movie added with ID: ${response.data.id}`);
    } catch (error) {
      alert('Failed to add movie');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label="Duration (minutes)"
            value={duration}
            onChange={(value) => setDuration(value || 0)}
            required
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Actors"
            value={actors}
            onChange={(e) => setActors(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <DateInput
            value={releaseDate}
            onChange={setReleaseDate}
            label="Release Date"
            placeholder="Release Date"
            required
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <FileInput
            label="Image"
            accept="image/*"
            onChange={setImage}
            required
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <FileInput
            label="Wide Image"
            accept="image/*"
            onChange={setWideImage}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autosize
            minRows={3}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Button type="submit">Add Movie</Button>
        </Grid.Col>
      </Grid>
    </form>
  );
};

export default AddMovie;
