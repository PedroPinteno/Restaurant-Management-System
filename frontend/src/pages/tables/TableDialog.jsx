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
  MenuItem
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import LoadingButton from '../../components/common/LoadingButton';
import { createTable, updateTable } from '../../services/table.service';
import { getRestaurants } from '../../services/restaurant.service';

const validationSchema = Yup.object({
  restaurant: Yup.string().required('El restaurante es requerido'),
  number: Yup.number()
    .required('El número es requerido')
    .min(1, 'El número debe ser mayor a 0'),
  capacity: Yup.number()
    .required('La capacidad es requerida')
    .min(1, 'La capacidad debe ser mayor a 0'),
  type: Yup.string().required('El tipo es requerido'),
  status: Yup.string().required('El estado es requerido')
});

const TableDialog = ({ open, onClose, table }) => {
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = Boolean(table);

  const { data: restaurantsData } = useQuery(['restaurants'], () =>
    getRestaurants({ limit: 100 })
  );

  const formik = useFormik({
    initialValues: {
      restaurant: table?.restaurant?._id || '',
      number: table?.number || '',
      capacity: table?.capacity || '',
      type: table?.type || 'standard',
      status: table?.status || 'available'
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await updateTable(table._id, values);
          enqueueSnackbar('Mesa actualizada exitosamente', {
            variant: 'success'
          });
        } else {
          await createTable(values);
          enqueueSnackbar('Mesa creada exitosamente', {
            variant: 'success'
          });
        }
        onClose(true);
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.message || 'Error al guardar la mesa',
          { variant: 'error' }
        );
      }
    }
  });

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{isEdit ? 'Editar Mesa' : 'Nueva Mesa'}</DialogTitle>
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="number"
                label="Número"
                type="number"
                value={formik.values.number}
                onChange={formik.handleChange}
                error={formik.touched.number && Boolean(formik.errors.number)}
                helperText={formik.touched.number && formik.errors.number}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="capacity"
                label="Capacidad"
                type="number"
                value={formik.values.capacity}
                onChange={formik.handleChange}
                error={
                  formik.touched.capacity && Boolean(formik.errors.capacity)
                }
                helperText={formik.touched.capacity && formik.errors.capacity}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  error={formik.touched.type && Boolean(formik.errors.type)}
                  label="Tipo"
                >
                  <MenuItem value="standard">Estándar</MenuItem>
                  <MenuItem value="vip">VIP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  label="Estado"
                >
                  <MenuItem value="available">Disponible</MenuItem>
                  <MenuItem value="occupied">Ocupada</MenuItem>
                  <MenuItem value="reserved">Reservada</MenuItem>
                  <MenuItem value="maintenance">Mantenimiento</MenuItem>
                </Select>
              </FormControl>
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

export default TableDialog;
