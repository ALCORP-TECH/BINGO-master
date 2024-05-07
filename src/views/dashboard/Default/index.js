import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import EventCard from './Main/EventCard';
import { getGamesList } from 'config/firebaseEvents';

const Dashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getGamesList().then((data) => {
      setEvents(data);
    });
  }, []);
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          {events.map((item, key) => (
            <Grid key={key} item lg={4} md={6} sm={6} xs={12}>
              <EventCard name={item.name} date={item.startDate} bg={'#00adef'} id={item.ide} transmition={item.transmition} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
