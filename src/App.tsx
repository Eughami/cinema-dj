import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { theme } from './theme';
import '@mantine/carousel/styles.css';
import HomeCaroussel from './components/HomeCaroussel';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <div>
        <h1>Hello World!</h1>
        <HomeCaroussel />
      </div>
    </MantineProvider>
  );
}
