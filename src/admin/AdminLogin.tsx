import { FormEvent, useState } from 'react';
import {
  Alert,
  Button,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import axios from 'axios';
import { Navigate, useLocation, useNavigate } from 'react-router';
import styles from './AdminRoutes.module.css';
import { toApiUrl } from '../config';
import { hasAdminToken, setAdminToken } from './adminAuth';

interface AdminLoginResponse {
  token: string;
  token_type: string;
  expires_in: number;
}

interface AdminLoginLocationState {
  from?: string;
}

const FALLBACK_ADMIN_ROUTE = '/admin';

const AdminLogin = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as AdminLoginLocationState | null;
  const redirectPath =
    typeof locationState?.from === 'string' && locationState.from.startsWith('/admin')
      ? locationState.from
      : FALLBACK_ADMIN_ROUTE;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (hasAdminToken()) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await axios.post<AdminLoginResponse>(
        toApiUrl('/admin/login'),
        {
          username: username.trim(),
          password,
        }
      );

      const token = response.data?.token?.trim();
      if (!token) {
        setError('Échec de la connexion : aucun jeton retourné par le serveur');
        return;
      }

      setAdminToken(token);
      navigate(redirectPath, { replace: true });
    } catch (requestError: unknown) {
      let errorMessage = 'Échec de la connexion';
      if (axios.isAxiosError(requestError)) {
        const apiError = requestError.response?.data?.error;
        if (typeof apiError === 'string' && apiError.trim()) {
          errorMessage = apiError;
        }
      }

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminContainer}>
        <Paper className={styles.loginCard}>
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <div>
                <Text className={styles.kicker}>Administration Cinéma DJ</Text>
                <Title order={2}>Connexion admin</Title>
                <Text c="dimmed" mt="xs">
                  Connectez-vous pour accéder à la gestion des films et des séances.
                </Text>
              </div>

              {error && (
                <Alert color="red" variant="light" title="Échec de l'authentification">
                  {error}
                </Alert>
              )}

              <TextInput
                label="Nom d'utilisateur"
                value={username}
                onChange={(event) => setUsername(event.currentTarget.value)}
                autoComplete="username"
                required
              />

              <PasswordInput
                label="Mot de passe"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                autoComplete="current-password"
                required
              />

              <Button type="submit" loading={submitting} color="dark">
                Se connecter
              </Button>
            </Stack>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default AdminLogin;
