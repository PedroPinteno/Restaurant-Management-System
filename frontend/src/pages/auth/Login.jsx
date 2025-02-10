import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Container,
  Link,
  Alert
} from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import LoadingButton from '../../components/common/LoadingButton';
import { login as loginService } from '../../services/auth.service';
import {
  loginStart,
  loginSuccess,
  loginFailure
} from '../../store/slices/authSlice';

const validationSchema = Yup.object({
  username: Yup.string().required('Usuario es requerido'),
  password: Yup.string().required('Contraseña es requerida')
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        dispatch(loginStart());
        const response = await loginService(values);
        dispatch(loginSuccess(response.data));
        navigate('/');
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Error al iniciar sesión';
        setError(errorMessage);
        dispatch(loginFailure(errorMessage));
      }
    }
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)'
      }}
    >
      <Container maxWidth="sm">
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                gutterBottom
                sx={{ color: 'primary.main', fontWeight: 'bold' }}
              >
                Restaurant Chain Manager
              </Typography>
              <Typography variant="h6" gutterBottom>
                Iniciar Sesión
              </Typography>

              {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={formik.handleSubmit}
                sx={{ width: '100%', mt: 1 }}
              >
                <TextField
                  margin="normal"
                  fullWidth
                  id="username"
                  name="username"
                  label="Usuario"
                  autoComplete="username"
                  autoFocus
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                  helperText={formik.touched.username && formik.errors.username}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
                <LoadingButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  loading={formik.isSubmitting}
                >
                  Iniciar Sesión
                </LoadingButton>
                <Box sx={{ textAlign: 'center' }}>
                  <Link href="#" variant="body2">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
