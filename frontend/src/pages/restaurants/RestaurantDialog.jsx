import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import LoadingButton from '../../components/common/LoadingButton';
import {
  createRestaurant,
  updateRestaurant
} from '../../services/restaurant.service';

const validationSchema = Yup.object({
  name: Yup.string().required('El nombre es requerido'),
  address: Yup.string().required('La dirección es requerida'),
  phone: Yup.string().required('El teléfono es requerido'),
  email: Yup.string()
    .email('Email inválido')
    .required('El email es requerido'),
  capacity: Yup.number()
    .min(1, 'La capacidad debe ser mayor a 0')
    .required('La capacidad es requerida'),
  status: Yup.string().required('El estado es requerido')
});

const RestaurantDialog = ({ open, onClose, restaurant }) => {
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = Boolean(restaurant);

  const formik = useFormik({
    initialValues: {
      name: restaurant?.name || '',
      address: restaurant?.address || '',
      phone: restaurant?.phone || '',
      email: restaurant?.email || '',
      capacity: restaurant?.capacity || '',
      status: restaurant?.status || 'active'
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await updateRestaurant(restaurant._id, values);
          enqueueSnackbar('Restaurante actualizado exitosamente', {
            variant: 'success'
          });
        } else {
          await createRestaurant(values);
          enqueueSnackbar('Restaurante creado exitosamente', {
            variant: 'success'
          });
        }
        onClose(true);
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.message ||
            'Error al guardar el restaurante',
          { variant: 'error' }
        );
      }
    }
  });

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {isEdit ? 'Editar Restaurante' : 'Nuevo Restaurante'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Nombre"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="address"
                label="Dirección"
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="phone"
                label="Teléfono"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
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
                error={formik.touched.capacity && Boolean(formik.errors.capacity)}
                helperText={formik.touched.capacity && formik.errors.capacity}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.status === 'active'}
                    onChange={(e) =>
                      formik.setFieldValue(
                        'status',
                        e.target.checked ? 'active' : 'inactive'
                      )
                    }
                  />
                }
                label="Activo"
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

export default RestaurantDialog;
