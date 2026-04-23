import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Alert,
  Button,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { FiAlertTriangle } from 'react-icons/fi';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Stack ta="center" p="xl">
          <Alert
            icon={<FiAlertTriangle />}
            color="red"
            radius="md"
            title="Something went wrong"
            variant="light"
          >
            <Stack gap="sm">
              <Text size="sm">
                {this.state.error?.message || 'An unexpected error occurred.'}
              </Text>
              <Group justify="center">
                <Button onClick={this.handleReset} variant="outline">
                  Reload page
                </Button>
              </Group>
            </Stack>
          </Alert>
        </Stack>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
