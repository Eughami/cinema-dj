import { Carousel } from '@mantine/carousel';
import classes from './HomeCaroussel.module.css';
import { Image } from '@mantine/core';
import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
const images = [
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png',
];

const HomeCaroussel = () => {
  const autoplay = useRef(Autoplay({ delay: 3000 }));

  const slides = images.map((url) => (
    <Carousel.Slide key={url}>
      <Image src={url} className={classes.carouselImage} />
    </Carousel.Slide>
  ));

  return (
    <div className={classes.myContainer}>
      <div className={classes.myCarouselWrapper}>
        <Carousel
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
          loop
          height="100%"
          style={{ flex: 1 }}
          withIndicators
          classNames={classes}
        >
          {slides}
        </Carousel>
      </div>
    </div>
  );
};

export default HomeCaroussel;
