import { Carousel } from '@mantine/carousel';
import classes from './HomeCaroussel.module.css';
import { Image } from '@mantine/core';
import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Movie } from '../type';

interface HomeCarousselProps {
  movies: Movie[] | undefined;
}
const HomeCaroussel = (props: HomeCarousselProps) => {
  const { movies } = props;

  const autoplay = useRef(Autoplay({ delay: 3000 }));

  const slides = movies?.map((m) => (
    <Carousel.Slide key={m.id}>
      <a title={m.title} href={`movie/${m.id}`}>
        <Image
          src={`https://cinema-api.eughami.com/${m.wide_image}`}
          className={classes.carouselImage}
        />
      </a>
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
