const rawApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000';

const rawAdminToken = import.meta.env.VITE_ADMIN_TOKEN || '';

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, '');

export const getAdminRequestConfig = (): {
  headers?: Record<string, string>;
} => {
  const adminToken = rawAdminToken.trim();

  if (!adminToken) {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  };
};

export const toApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const toAssetUrl = (assetPath?: string | null): string => {
  if (!assetPath) {
    return '';
  }

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  return toApiUrl(assetPath.startsWith('/') ? assetPath : `/${assetPath}`);
};
