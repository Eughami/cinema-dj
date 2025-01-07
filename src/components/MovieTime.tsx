import { Button } from '@mantine/core';
import classes from './MovieTime.module.css';
import { IconTicket } from '@tabler/icons-react';

const MovieTime = () => {
  return (
    <div className={classes.mtRoot}>
      <div className={classes.mtHour}>19:30</div>
      <div className={classes.mtHall}>Hall 2</div>
      <div className={classes.mtLang}>
        <span>Audio: EN</span>
        <span>Sub: FR</span>
      </div>
      <Button
        size="md"
        component="a"
        href={`/booking/1`}
        classNames={{
          root: classes.mtButton,
          label: classes.mtButtonLabel,
        }}
        leftSection={<IconTicket stroke={2} />}
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
