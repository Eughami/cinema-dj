import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Group,
  Stack,
  Text,
  Portal,
  Box,
} from '@mantine/core';
import {
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiAlertTriangle,
} from 'react-icons/fi';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  title?: string;
}

interface NotificationContextType {
  notify: (message: string, type?: NotificationType, title?: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const typeConfig: Record<NotificationType, { color: string; icon: React.ReactNode }> = {
  success: { color: 'teal', icon: <FiCheckCircle size={18} /> },
  error: { color: 'red', icon: <FiAlertCircle size={18} /> },
  warning: { color: 'yellow', icon: <FiAlertTriangle size={18} /> },
  info: { color: 'blue', icon: <FiInfo size={18} /> },
};

const NotificationContext = createContext<NotificationContextType | null>(null);

let nextId = 0;
const genId = () => `notif-${++nextId}`;

export function useNotify(): NotificationContextType {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotify must be used within NotificationProvider');
  }
  return ctx;
}

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<Notification[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  const dismiss = useCallback((id: string) => {
    setList((prev) => prev.filter((n) => n.id !== id));
    const t = timers.current.get(id);
    if (t != null) {
      clearTimeout(t);
      timers.current.delete(id);
    }
  }, []);

  const notify = useCallback(
    (message: string, type: NotificationType = 'info', title?: string) => {
      const id = genId();
      setList((prev) => [...prev, { id, message, type, title }]);
      const timer = window.setTimeout(() => dismiss(id), 5000);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  const success = useCallback(
    (message: string, title?: string) => notify(message, 'success', title),
    [notify],
  );
  const error = useCallback(
    (message: string, title?: string) => notify(message, 'error', title),
    [notify],
  );
  const warning = useCallback(
    (message: string, title?: string) => notify(message, 'warning', title),
    [notify],
  );
  const info = useCallback(
    (message: string, title?: string) => notify(message, 'info', title),
    [notify],
  );

  return (
    <NotificationContext.Provider value={{ notify, success, error, warning, info }}>
      {children}
      <Portal>
        <Box
          pos="fixed"
          top={16}
          right={16}
          zIndex={9999}
          style={{ maxWidth: 380, width: '100%' }}
        >
          <Stack gap="sm">
            {list.map((n) => {
              const cfg = typeConfig[n.type];
              return (
                <Alert
                  key={n.id}
                  icon={cfg.icon}
                  color={cfg.color}
                  radius="md"
                  title={n.title}
                  variant="light"
                  onClose={() => dismiss(n.id)}
                  withCloseButton
                >
                  <Text size="sm">{n.message}</Text>
                </Alert>
              );
            })}
          </Stack>
        </Box>
      </Portal>
    </NotificationContext.Provider>
  );
}
