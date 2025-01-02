import { Carousel } from '@mantine/carousel';
import classes from './HomeCaroussel.module.css';
import { Image } from '@mantine/core';
const images = [
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png',
];

const HomeCaroussel = () => {
  const slides = images.map((url) => (
    <Carousel.Slide key={url}>
      <Image src={url} style={{ objectFit: 'contain' }} />
    </Carousel.Slide>
  ));

  return (
    <div style={{ height: 400, display: 'flex' }}>
      <Carousel
        withIndicators
        height="100%"
        style={{ flex: 1 }}
        classNames={classes}
      >
        {slides}
      </Carousel>
    </div>
  );
};

export default HomeCaroussel;
