import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  Restaurant,
  TableBar,
  EventNote,
  People,
  TrendingUp
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PageHeader from '../../components/common/PageHeader';
import { getRestaurants } from '../../services/restaurant.service';
import { getReservationsByDate } from '../../services/reservation.service';

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4">{value}</Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const today = new Date();

  const { data: restaurantsData } = useQuery(['restaurants'], () =>
    getRestaurants()
  );

  const { data: reservationsData } = useQuery(['reservations', today], () =>
    getReservationsByDate({ date: format(today, 'yyyy-MM-dd') })
  );

  const stats = {
    restaurants: restaurantsData?.results || 0,
    tables: 0, // TODO: Implementar endpoint
    reservations: reservationsData?.results || 0,
    customers: 0 // TODO: Implementar endpoint
  };

  return (
    <>
      <PageHeader
        title={`Dashboard - ${format(today, "EEEE, d 'de' MMMM", {
          locale: es
        })}`}
      />

      <Grid container spacing={3}>
        {/* Estadísticas */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Restaurantes"
            value={stats.restaurants}
            icon={<Restaurant color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Mesas"
            value={stats.tables}
            icon={<TableBar color="secondary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Reservas Hoy"
            value={stats.reservations}
            icon={<EventNote color="success" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Clientes"
            value={stats.customers}
            icon={<People color="info" />}
          />
        </Grid>

        {/* Gráficos y Análisis */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tendencias de Reservas
              </Typography>
              {/* TODO: Implementar gráfico de tendencias */}
              <Box
                sx={{
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <TrendingUp sx={{ fontSize: 100, color: 'text.disabled' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Panel Lateral */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Próximas Reservas
              </Typography>
              {/* TODO: Implementar lista de próximas reservas */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
