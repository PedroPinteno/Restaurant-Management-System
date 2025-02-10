import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Grid,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CustomerDialog from './CustomerDialog';
import { getCustomers, deleteCustomer } from '../../services/customer.service';

const Customers = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery(
    ['customers', page, rowsPerPage],
    () =>
      getCustomers({
        page: page + 1,
        limit: rowsPerPage
      })
  );

  const getLoyaltyChip = (points) => {
    if (points >= 1000) {
      return (
        <Chip
          icon={<StarIcon />}
          label="VIP"
          color="secondary"
          size="small"
          variant="outlined"
        />
      );
    }
    if (points >= 500) {
      return (
        <Chip
          icon={<StarIcon />}
          label="Gold"
          color="primary"
          size="small"
          variant="outlined"
        />
      );
    }
    return (
      <Chip
        icon={<StarIcon />}
        label="Regular"
        color="default"
        size="small"
        variant="outlined"
      />
    );
  };

  const columns = [
    {
      id: 'name',
      label: 'Nombre',
      minWidth: 170,
      format: (_, row) => `${row.firstName} ${row.lastName}`
    },
    { id: 'email', label: 'Email', minWidth: 170 },
    { id: 'phone', label: 'Teléfono', minWidth: 130 },
    {
      id: 'loyaltyPoints',
      label: 'Nivel',
      minWidth: 100,
      format: (value) => getLoyaltyChip(value)
    },
    {
      id: 'lastVisit',
      label: 'Última Visita',
      minWidth: 130,
      format: (value) =>
        value ? new Date(value).toLocaleDateString() : 'Sin visitas'
    },
    {
      id: 'actions',
      label: 'Acciones',
      minWidth: 170,
      align: 'right',
      format: (_, row) => (
        <Box>
          <Tooltip title="Ver detalles">
            <IconButton
              onClick={() => navigate(`/customers/${row._id}`)}
              size="small"
            >
              <ViewIcon />
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
    setSelectedCustomer(null);
    setDialogOpen(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const handleDeleteClick = (customer) => {
    setSelectedCustomer(customer);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteCustomer(selectedCustomer._id);
      enqueueSnackbar('Cliente eliminado exitosamente', {
        variant: 'success'
      });
      refetch();
    } catch (error) {
      enqueueSnackbar('Error al eliminar el cliente', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedCustomer(null);
    }
  };

  const handleDialogClose = (refresh = false) => {
    setDialogOpen(false);
    setSelectedCustomer(null);
    if (refresh) {
      refetch();
    }
  };

  return (
    <>
      <PageHeader
        title="Clientes"
        breadcrumbs={[{ text: 'Clientes', href: '/customers' }]}
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
                  Nuevo Cliente
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

      <CustomerDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        customer={selectedCustomer}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar Cliente"
        message={`¿Está seguro que desea eliminar al cliente ${selectedCustomer?.firstName} ${selectedCustomer?.lastName}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmColor="error"
        confirmText="Eliminar"
      />
    </>
  );
};

export default Customers;
