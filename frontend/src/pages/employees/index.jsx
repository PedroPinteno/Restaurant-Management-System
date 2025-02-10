import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Grid,
  Chip,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmployeeDialog from './EmployeeDialog';
import { getEmployees, deleteEmployee } from '../../services/employee.service';

const Employees = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery(
    ['employees', page, rowsPerPage],
    () =>
      getEmployees({
        page: page + 1,
        limit: rowsPerPage
      })
  );

  const getRoleChip = (role) => {
    const roleConfig = {
      manager: { label: 'Gerente', color: 'primary' },
      waiter: { label: 'Mesero', color: 'secondary' },
      chef: { label: 'Chef', color: 'success' },
      host: { label: 'Anfitrión', color: 'info' }
    };

    const config = roleConfig[role] || { label: role, color: 'default' };

    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const columns = [
    {
      id: 'avatar',
      label: '',
      minWidth: 50,
      format: (_, row) => (
        <Avatar
          src={row.avatar}
          alt={`${row.firstName} ${row.lastName}`}
          sx={{ width: 32, height: 32 }}
        />
      )
    },
    {
      id: 'name',
      label: 'Nombre',
      minWidth: 170,
      format: (_, row) => `${row.firstName} ${row.lastName}`
    },
    { id: 'email', label: 'Email', minWidth: 170 },
    {
      id: 'role',
      label: 'Rol',
      minWidth: 130,
      format: (value) => getRoleChip(value)
    },
    {
      id: 'restaurant',
      label: 'Restaurante',
      minWidth: 170,
      format: (value) => value?.name || 'Sin asignar'
    },
    {
      id: 'status',
      label: 'Estado',
      minWidth: 100,
      format: (value) => (
        <Chip
          label={value === 'active' ? 'Activo' : 'Inactivo'}
          color={value === 'active' ? 'success' : 'default'}
          size="small"
        />
      )
    },
    {
      id: 'actions',
      label: 'Acciones',
      minWidth: 200,
      align: 'right',
      format: (_, row) => (
        <Box>
          <Tooltip title="Ver horario">
            <IconButton
              onClick={() => navigate(`/employees/${row._id}/schedule`)}
              size="small"
            >
              <ScheduleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Ver rendimiento">
            <IconButton
              onClick={() => navigate(`/employees/${row._id}/performance`)}
              size="small"
              sx={{ ml: 1 }}
            >
              <AssessmentIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton
              onClick={() => handleEdit(row)}
              size="small"
              sx={{ ml: 1 }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              onClick={() => handleDeleteClick(row)}
              size="small"
              sx={{ ml: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAdd = () => {
    setSelectedEmployee(null);
    setDialogOpen(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteEmployee(selectedEmployee._id);
      enqueueSnackbar('Empleado eliminado exitosamente', {
        variant: 'success'
      });
      refetch();
    } catch (error) {
      enqueueSnackbar('Error al eliminar el empleado', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedEmployee(null);
    }
  };

  const handleDialogClose = (refresh = false) => {
    setDialogOpen(false);
    setSelectedEmployee(null);
    if (refresh) {
      refetch();
    }
  };

  return (
    <>
      <PageHeader
        title="Empleados"
        breadcrumbs={[{ text: 'Empleados', href: '/employees' }]}
      />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAdd}
                >
                  Nuevo Empleado
                </Button>
              </Box>

              <DataTable
                columns={columns}
                data={data?.data || []}
                loading={isLoading}
                page={page}
                rowsPerPage={rowsPerPage}
                totalRows={data?.total || 0}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <EmployeeDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        employee={selectedEmployee}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar Empleado"
        message={`¿Está seguro que desea eliminar al empleado ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmColor="error"
        confirmText="Eliminar"
      />
    </>
  );
};

export default Employees;
