import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import {
  getRestaurants,
  deleteRestaurant
} from '../../services/restaurant.service';
import RestaurantDialog from './RestaurantDialog';

const Restaurants = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery(
    ['restaurants', page, rowsPerPage],
    () =>
      getRestaurants({
        page: page + 1,
        limit: rowsPerPage
      })
  );

  const columns = [
    { id: 'name', label: 'Nombre', minWidth: 170 },
    { id: 'address', label: 'Dirección', minWidth: 200 },
    {
      id: 'status',
      label: 'Estado',
      minWidth: 100,
      format: (value) => (value === 'active' ? 'Activo' : 'Inactivo')
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
              onClick={() => navigate(`/restaurants/${row._id}`)}
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
    setSelectedRestaurant(null);
    setDialogOpen(true);
  };

  const handleEdit = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setDialogOpen(true);
  };

  const handleDeleteClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteRestaurant(selectedRestaurant._id);
      enqueueSnackbar('Restaurante eliminado exitosamente', {
        variant: 'success'
      });
      refetch();
    } catch (error) {
      enqueueSnackbar('Error al eliminar el restaurante', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedRestaurant(null);
    }
  };

  const handleDialogClose = (refresh = false) => {
    setDialogOpen(false);
    setSelectedRestaurant(null);
    if (refresh) {
      refetch();
    }
  };

  return (
    <>
      <PageHeader
        title="Restaurantes"
        breadcrumbs={[{ text: 'Restaurantes', href: '/restaurants' }]}
      />

      <Card>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
            >
              Nuevo Restaurante
            </Button>
          </Box>

          <DataTable
            columns={columns}
            data={data?.data?.restaurants || []}
            loading={isLoading}
            page={page}
            rowsPerPage={rowsPerPage}
            totalRows={data?.total || 0}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      <RestaurantDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        restaurant={selectedRestaurant}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar Restaurante"
        message={`¿Está seguro que desea eliminar el restaurante "${selectedRestaurant?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmColor="error"
        confirmText="Eliminar"
      />
    </>
  );
};

export default Restaurants;
