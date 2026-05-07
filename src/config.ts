import { getAdminToken } from './admin/adminAuth';

const rawApiBaseUrl ='https://cinema-api.eughami.com'

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, '');

export const getAdminRequestConfig = (): {
  headers?: Record<string, string>;
} => {
  const adminToken = getAdminToken();

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
