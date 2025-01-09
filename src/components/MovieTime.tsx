import { Button } from '@mantine/core';
import classes from './MovieTime.module.css';
import { Session } from '../type';
import { FaTicket } from 'react-icons/fa6';

interface MovieTimeProps {
  s: Session;
}
const MovieTime = (props: MovieTimeProps) => {
  const { s } = props;
  return (
    <div className={classes.mtRoot}>
      <div className={classes.mtHour}>{s.time}</div>
      <div className={classes.mtHall}>Salle {s.hall_no}</div>
      <div className={classes.mtLang}>
        <span>Audio: {s.audio}</span>
        <span>{s.subtitle && `Sub: ${s.subtitle}`}</span>
      </div>
      <Button
        size="md"
        component="a"
        href={`/booking/${s.id}`}
        classNames={{
          root: classes.mtButton,
          label: classes.mtButtonLabel,
        }}
        leftSection={<FaTicket />}
        radius="md"
        variant="outline"
        color="#620D8A"
      >
        Buy ticket
      </Button>
    </div>
  );
};

export default MovieTime;
