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
import { useSnackbar } from 'notistack';
import LoadingButton from '../../components/common/LoadingButton';
import { createCustomer, updateCustomer } from '../../services/customer.service';

const validationSchema = Yup.object({
  firstName: Yup.string().required('El nombre es requerido'),
  lastName: Yup.string().required('El apellido es requerido'),
  email: Yup.string()
    .email('Email inválido')
    .required('El email es requerido'),
  phone: Yup.string().required('El teléfono es requerido'),
  preferences: Yup.object({
    dietaryRestrictions: Yup.array(),
    seatingPreference: Yup.string(),
    specialRequests: Yup.string()
  })
});

const CustomerDialog = ({ open, onClose, customer }) => {
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = Boolean(customer);

  const formik = useFormik({
    initialValues: {
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      preferences: {
        dietaryRestrictions: customer?.preferences?.dietaryRestrictions || [],
        seatingPreference:
          customer?.preferences?.seatingPreference || 'no_preference',
        specialRequests: customer?.preferences?.specialRequests || ''
      }
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await updateCustomer(customer._id, values);
          enqueueSnackbar('Cliente actualizado exitosamente', {
            variant: 'success'
          });
        } else {
          await createCustomer(values);
          enqueueSnackbar('Cliente creado exitosamente', {
            variant: 'success'
          });
        }
        onClose(true);
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.message || 'Error al guardar el cliente',
          { variant: 'error' }
        );
      }
    }
  });

  const dietaryOptions = [
    { value: 'vegetarian', label: 'Vegetariano' },
    { value: 'vegan', label: 'Vegano' },
    { value: 'gluten_free', label: 'Sin Gluten' },
    { value: 'lactose_free', label: 'Sin Lactosa' },
    { value: 'nut_allergy', label: 'Alergia a Frutos Secos' }
  ];

  const seatingOptions = [
    { value: 'no_preference', label: 'Sin Preferencia' },
    { value: 'window', label: 'Junto a la Ventana' },
    { value: 'quiet', label: 'Zona Tranquila' },
    { value: 'outdoor', label: 'Terraza' }
  ];

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="firstName"
                label="Nombre"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="lastName"
                label="Apellido"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
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
                name="phone"
                label="Teléfono"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Restricciones Alimentarias</InputLabel>
                <Select
                  multiple
                  name="preferences.dietaryRestrictions"
                  value={formik.values.preferences.dietaryRestrictions}
                  onChange={formik.handleChange}
                  label="Restricciones Alimentarias"
                >
                  {dietaryOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Preferencia de Mesa</InputLabel>
                <Select
                  name="preferences.seatingPreference"
                  value={formik.values.preferences.seatingPreference}
                  onChange={formik.handleChange}
                  label="Preferencia de Mesa"
                >
                  {seatingOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
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
                name="preferences.specialRequests"
                label="Peticiones Especiales"
                value={formik.values.preferences.specialRequests}
                onChange={formik.handleChange}
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

export default CustomerDialog;
