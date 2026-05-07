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
import { getAdminRequestConfig, toApiUrl, toAssetUrl } from '../config';

interface EditableMovie {
  id: number;
  title?: string;
  duration?: number;
  genre?: string;
  actors?: string;
  release_date?: string;
  image?: string;
  wide_image?: string | null;
  description?: string;
}

interface AddMovieProps {
  movie?: EditableMovie | null;
  onClose: () => void;
}

const AddMovie = ({ movie, onClose }: AddMovieProps) => {
  const [title, setTitle] = useState(movie?.title || '');
  const [duration, setDuration] = useState(movie?.duration || 0);
  const [genre, setGenre] = useState(movie?.genre || '');
  const [actors, setActors] = useState(movie?.actors || '');
  const [releaseDate, setReleaseDate] = useState<Date | null>(
    movie?.release_date ? new Date(movie.release_date) : null
  );
  const [image, setImage] = useState<File | null>(null);
  const [wideImage, setWideImage] = useState<File | null>(null);
  const [description, setDescription] = useState(movie?.description || '');

  // Default image URLs from the movie prop
  const defaultImageUrl = movie?.image || null;
  const defaultWideImageUrl = movie?.wide_image || null;

  // Preview URLs for selected files
  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultImageUrl ? toAssetUrl(defaultImageUrl) : null
  );
  const [wideImagePreview, setWideImagePreview] = useState<string | null>(
    defaultWideImageUrl ? toAssetUrl(defaultWideImageUrl) : null
  );

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(defaultImageUrl ? toAssetUrl(defaultImageUrl) : null);
    }
  };

  const handleWideImageChange = (file: File | null) => {
    setWideImage(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setWideImagePreview(previewUrl);
    } else {
      setWideImagePreview(
        defaultWideImageUrl ? toAssetUrl(defaultWideImageUrl) : null
      );
    }
  };

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
      const adminRequestConfig = getAdminRequestConfig();
      const requestConfig = {
        headers: {
          ...(adminRequestConfig.headers || {}),
        },
      };

      if (movie) {
        await axios.put(toApiUrl(`/admin/movies/${movie.id}`), formData, requestConfig);
      } else {
        await axios.post(toApiUrl('/admin/movies'), formData, requestConfig);
      }
      onClose();
    } catch (error) {
      alert('Failed to save movie');
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
            onChange={(value) => setDuration(Number(value) || 0)}
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
            onChange={handleImageChange}
            required={!movie}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Image Preview"
              style={{ marginTop: '10px', maxWidth: 'auto', height: 100 }}
            />
          )}
        </Grid.Col>
        <Grid.Col span={6}>
          <FileInput
            label="Wide Image"
            accept="image/*"
            onChange={handleWideImageChange}
          />
          {wideImagePreview && (
            <img
              src={wideImagePreview}
              alt="Wide Image Preview"
              style={{ marginTop: '10px', maxWidth: 'auto', height: 100 }}
            />
          )}
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
          <Button type="submit">Save Movie</Button>
        </Grid.Col>
      </Grid>
    </form>
  );
};

export default AddMovie;
