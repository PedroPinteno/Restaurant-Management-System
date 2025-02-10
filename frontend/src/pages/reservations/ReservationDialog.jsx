import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import LoadingButton from '../../components/common/LoadingButton';
import {
  createReservation,
  updateReservation,
  getAvailableTables
} from '../../services/reservation.service';
import { getRestaurants } from '../../services/restaurant.service';
import { getCustomers } from '../../services/customer.service';

const validationSchema = Yup.object({
  restaurant: Yup.string().required('El restaurante es requerido'),
  customer: Yup.string().required('El cliente es requerido'),
  date: Yup.string().required('La fecha es requerida'),
  time: Yup.string().required('La hora es requerida'),
  guests: Yup.number()
    .required('El número de personas es requerido')
    .min(1, 'Debe ser al menos 1 persona')
    .max(20, 'Máximo 20 personas'),
  table: Yup.string().required('La mesa es requerida'),
  specialRequests: Yup.string()
});

const ReservationDialog = ({ open, onClose, reservation }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [availableTables, setAvailableTables] = useState([]);
  const isEdit = Boolean(reservation);

  const { data: restaurantsData } = useQuery(['restaurants'], () =>
    getRestaurants({ limit: 100 })
  );

  const { data: customersData } = useQuery(['customers'], () =>
    getCustomers({ limit: 100 })
  );

  const formik = useFormik({
    initialValues: {
      restaurant: reservation?.restaurant?._id || '',
      customer: reservation?.customer?._id || '',
      date: reservation?.date
        ? format(new Date(reservation.date), 'yyyy-MM-dd')
        : '',
      time: reservation?.time || '',
      guests: reservation?.guests || '',
      table: reservation?.table?._id || '',
      specialRequests: reservation?.specialRequests || ''
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await updateReservation(reservation._id, values);
          enqueueSnackbar('Reserva actualizada exitosamente', {
            variant: 'success'
          });
        } else {
          await createReservation(values);
          enqueueSnackbar('Reserva creada exitosamente', {
            variant: 'success'
          });
        }
        onClose(true);
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.message || 'Error al guardar la reserva',
          { variant: 'error' }
        );
      }
    }
  });

  useEffect(() => {
    const fetchAvailableTables = async () => {
      if (
        formik.values.restaurant &&
        formik.values.date &&
        formik.values.time &&
        formik.values.guests
      ) {
        try {
          const response = await getAvailableTables({
            restaurant: formik.values.restaurant,
            date: formik.values.date,
            time: formik.values.time,
            guests: formik.values.guests
          });
          setAvailableTables(response.data);
        } catch (error) {
          console.error('Error fetching available tables:', error);
          setAvailableTables([]);
        }
      }
    };

    fetchAvailableTables();
  }, [
    formik.values.restaurant,
    formik.values.date,
    formik.values.time,
    formik.values.guests
  ]);

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {isEdit ? 'Editar Reserva' : 'Nueva Reserva'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Restaurante</InputLabel>
                <Select
                  name="restaurant"
                  value={formik.values.restaurant}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.restaurant &&
                    Boolean(formik.errors.restaurant)
                  }
                  label="Restaurante"
                >
                  {restaurantsData?.data?.map((restaurant) => (
                    <MenuItem key={restaurant._id} value={restaurant._id}>
                      {restaurant.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Cliente</InputLabel>
                <Select
                  name="customer"
                  value={formik.values.customer}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.customer && Boolean(formik.errors.customer)
                  }
                  label="Cliente"
                >
                  {customersData?.data?.map((customer) => (
                    <MenuItem key={customer._id} value={customer._id}>
                      {`${customer.firstName} ${customer.lastName}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="date"
                label="Fecha"
                value={formik.values.date}
                onChange={formik.handleChange}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                name="time"
                label="Hora"
                value={formik.values.time}
                onChange={formik.handleChange}
                error={formik.touched.time && Boolean(formik.errors.time)}
                helperText={formik.touched.time && formik.errors.time}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                name="guests"
                label="Personas"
                value={formik.values.guests}
                onChange={formik.handleChange}
                error={formik.touched.guests && Boolean(formik.errors.guests)}
                helperText={formik.touched.guests && formik.errors.guests}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Mesa</InputLabel>
                <Select
                  name="table"
                  value={formik.values.table}
                  onChange={formik.handleChange}
                  error={formik.touched.table && Boolean(formik.errors.table)}
                  label="Mesa"
                >
                  {availableTables.map((table) => (
                    <MenuItem key={table._id} value={table._id}>
                      {`Mesa ${table.number} (${table.capacity} personas)`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="specialRequests"
                label="Peticiones Especiales"
                value={formik.values.specialRequests}
                onChange={formik.handleChange}
                error={
                  formik.touched.specialRequests &&
                  Boolean(formik.errors.specialRequests)
                }
                helperText={
                  formik.touched.specialRequests &&
                  formik.errors.specialRequests
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()}>Cancelar</Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={formik.isSubmitting}
          >
            {isEdit ? 'Actualizar' : 'Crear'}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ReservationDialog;
