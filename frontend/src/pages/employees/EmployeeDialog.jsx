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
  Avatar,
  Box
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import LoadingButton from '../../components/common/LoadingButton';
import { createEmployee, updateEmployee } from '../../services/employee.service';
import { getRestaurants } from '../../services/restaurant.service';

const validationSchema = Yup.object({
  firstName: Yup.string().required('El nombre es requerido'),
  lastName: Yup.string().required('El apellido es requerido'),
  email: Yup.string()
    .email('Email inválido')
    .required('El email es requerido'),
  phone: Yup.string().required('El teléfono es requerido'),
  role: Yup.string().required('El rol es requerido'),
  restaurant: Yup.string().required('El restaurante es requerido'),
  status: Yup.string().required('El estado es requerido'),
  avatar: Yup.string().url('URL inválida'),
  address: Yup.string().required('La dirección es requerida'),
  emergencyContact: Yup.object({
    name: Yup.string().required('El nombre de contacto es requerido'),
    phone: Yup.string().required('El teléfono de contacto es requerido'),
    relationship: Yup.string().required('La relación es requerida')
  })
});

const EmployeeDialog = ({ open, onClose, employee }) => {
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = Boolean(employee);

  const { data: restaurantsData } = useQuery(['restaurants'], () =>
    getRestaurants({ limit: 100 })
  );

  const formik = useFormik({
    initialValues: {
      firstName: employee?.firstName || '',
      lastName: employee?.lastName || '',
      email: employee?.email || '',
      phone: employee?.phone || '',
      role: employee?.role || '',
      restaurant: employee?.restaurant?._id || '',
      status: employee?.status || 'active',
      avatar: employee?.avatar || '',
      address: employee?.address || '',
      emergencyContact: {
        name: employee?.emergencyContact?.name || '',
        phone: employee?.emergencyContact?.phone || '',
        relationship: employee?.emergencyContact?.relationship || ''
      }
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await updateEmployee(employee._id, values);
          enqueueSnackbar('Empleado actualizado exitosamente', {
            variant: 'success'
          });
        } else {
          await createEmployee(values);
          enqueueSnackbar('Empleado creado exitosamente', {
            variant: 'success'
          });
        }
        onClose(true);
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.message || 'Error al guardar el empleado',
          { variant: 'error' }
        );
      }
    }
  });

  const roles = [
    { value: 'manager', label: 'Gerente' },
    { value: 'waiter', label: 'Mesero' },
    { value: 'chef', label: 'Chef' },
    { value: 'host', label: 'Anfitrión' }
  ];

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="md" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {isEdit ? 'Editar Empleado' : 'Nuevo Empleado'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {formik.values.avatar && (
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Avatar
                  src={formik.values.avatar}
                  sx={{ width: 100, height: 100, margin: '0 auto' }}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="avatar"
                label="URL del Avatar"
                value={formik.values.avatar}
                onChange={formik.handleChange}
                error={formik.touched.avatar && Boolean(formik.errors.avatar)}
                helperText={formik.touched.avatar && formik.errors.avatar}
              />
            </Grid>
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  error={formik.touched.role && Boolean(formik.errors.role)}
                  label="Rol"
                >
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
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
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  label="Estado"
                >
                  <MenuItem value="active">Activo</MenuItem>
                  <MenuItem value="inactive">Inactivo</MenuItem>
                </Select>
              </FormControl>
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
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Contacto de Emergencia</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="emergencyContact.name"
                    label="Nombre"
                    value={formik.values.emergencyContact.name}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.emergencyContact?.name &&
                      Boolean(formik.errors.emergencyContact?.name)
                    }
                    helperText={
                      formik.touched.emergencyContact?.name &&
                      formik.errors.emergencyContact?.name
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="emergencyContact.phone"
                    label="Teléfono"
                    value={formik.values.emergencyContact.phone}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.emergencyContact?.phone &&
                      Boolean(formik.errors.emergencyContact?.phone)
                    }
                    helperText={
                      formik.touched.emergencyContact?.phone &&
                      formik.errors.emergencyContact?.phone
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="emergencyContact.relationship"
                    label="Relación"
                    value={formik.values.emergencyContact.relationship}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.emergencyContact?.relationship &&
                      Boolean(formik.errors.emergencyContact?.relationship)
                    }
                    helperText={
                      formik.touched.emergencyContact?.relationship &&
                      formik.errors.emergencyContact?.relationship
                    }
                  />
                </Grid>
              </Grid>
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

export default EmployeeDialog;
