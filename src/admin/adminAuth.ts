const ADMIN_TOKEN_STORAGE_KEY = 'cinema_dj_admin_token';

const hasLocalStorage = (): boolean =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const getAdminToken = (): string => {
  if (!hasLocalStorage()) {
    return '';
  }

  return window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)?.trim() || '';
};

export const setAdminToken = (token: string): void => {
  if (!hasLocalStorage()) {
    return;
  }

  const trimmedToken = token.trim();
  if (!trimmedToken) {
    window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, trimmedToken);
};

export const clearAdminToken = (): void => {
  if (!hasLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
};

export const hasAdminToken = (): boolean => getAdminToken().length > 0;
