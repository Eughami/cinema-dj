import { Carousel } from '@mantine/carousel';
import classes from './HomeCaroussel.module.css';
import { Image } from '@mantine/core';
import { useMemo } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Movie } from '../type';
import { toAssetUrl } from '../config';

interface HomeCarousselProps {
  movies: Movie[] | undefined;
}
const HomeCaroussel = (props: HomeCarousselProps) => {
  const { movies } = props;

  const autoplay = useMemo(() => Autoplay({ delay: 3000 }), []);

  const slides = movies?.map((m) => (
    <Carousel.Slide key={m.id}>
      <a title={m.title} href={`movie/${m.id}`}>
        <Image
          src={toAssetUrl(m.wide_image)}
          className={classes.carouselImage}
        />
      </a>
    </Carousel.Slide>
  ));

  return (
    <div className={classes.myContainer}>
      <div className={classes.myCarouselWrapper}>
        <Carousel
          plugins={[autoplay]}
          onMouseEnter={autoplay.stop}
          onMouseLeave={autoplay.reset}
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
