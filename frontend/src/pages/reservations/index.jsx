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
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ReservationDialog from './ReservationDialog';
import {
  getReservations,
  deleteReservation,
  checkInReservation,
  cancelReservation
} from '../../services/reservation.service';

const Reservations = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery(
    ['reservations', page, rowsPerPage],
    () =>
      getReservations({
        page: page + 1,
        limit: rowsPerPage
      })
  );

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { label: 'Pendiente', color: 'warning' },
      confirmed: { label: 'Confirmada', color: 'success' },
      cancelled: { label: 'Cancelada', color: 'error' },
      completed: { label: 'Completada', color: 'default' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const columns = [
    {
      id: 'customer',
      label: 'Cliente',
      minWidth: 170,
      format: (value) => `${value.firstName} ${value.lastName}`
    },
    {
      id: 'restaurant',
      label: 'Restaurante',
      minWidth: 170,
      format: (value) => value.name
    },
    {
      id: 'date',
      label: 'Fecha',
      minWidth: 130,
      format: (value) => new Date(value).toLocaleDateString()
    },
    {
      id: 'time',
      label: 'Hora',
      minWidth: 100,
      format: (value) => value
    },
    {
      id: 'guests',
      label: 'Personas',
      minWidth: 100,
      align: 'center'
    },
    {
      id: 'status',
      label: 'Estado',
      minWidth: 130,
      format: (value) => getStatusChip(value)
    },
    {
      id: 'actions',
      label: 'Acciones',
      minWidth: 200,
      align: 'right',
      format: (_, row) => (
        <Box>
          {row.status === 'pending' && (
            <>
              <Tooltip title="Confirmar llegada">
                <IconButton
                  onClick={() => handleCheckIn(row)}
                  size="small"
                  color="success"
                >
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cancelar">
                <IconButton
                  onClick={() => handleCancelClick(row)}
                  size="small"
                  color="error"
                  sx={{ ml: 1 }}
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          <Tooltip title="Editar">
            <IconButton
              onClick={() => handleEdit(row)}
              size="small"
              sx={{ ml: 1 }}
              disabled={['cancelled', 'completed'].includes(row.status)}
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
    setSelectedReservation(null);
    setDialogOpen(true);
  };

  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setDialogOpen(true);
  };

  const handleDeleteClick = (reservation) => {
    setSelectedReservation(reservation);
    setDeleteDialogOpen(true);
  };

  const handleCancelClick = (reservation) => {
    setSelectedReservation(reservation);
    setCancelDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteReservation(selectedReservation._id);
      enqueueSnackbar('Reserva eliminada exitosamente', {
        variant: 'success'
      });
      refetch();
    } catch (error) {
      enqueueSnackbar('Error al eliminar la reserva', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedReservation(null);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelReservation(selectedReservation._id);
      enqueueSnackbar('Reserva cancelada exitosamente', {
        variant: 'success'
      });
      refetch();
    } catch (error) {
      enqueueSnackbar('Error al cancelar la reserva', { variant: 'error' });
    } finally {
      setCancelDialogOpen(false);
      setSelectedReservation(null);
    }
  };

  const handleCheckIn = async (reservation) => {
    try {
      await checkInReservation(reservation._id);
      enqueueSnackbar('Check-in realizado exitosamente', {
        variant: 'success'
      });
      refetch();
    } catch (error) {
      enqueueSnackbar('Error al realizar el check-in', { variant: 'error' });
    }
  };

  const handleDialogClose = (refresh = false) => {
    setDialogOpen(false);
    setSelectedReservation(null);
    if (refresh) {
      refetch();
    }
  };

  return (
    <>
      <PageHeader
        title="Reservas"
        breadcrumbs={[{ text: 'Reservas', href: '/reservations' }]}
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
                  Nueva Reserva
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

      <ReservationDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        reservation={selectedReservation}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar Reserva"
        message="¿Está seguro que desea eliminar esta reserva?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmColor="error"
        confirmText="Eliminar"
      />

      <ConfirmDialog
        open={cancelDialogOpen}
        title="Cancelar Reserva"
        message="¿Está seguro que desea cancelar esta reserva?"
        onConfirm={handleCancel}
        onCancel={() => setCancelDialogOpen(false)}
        confirmColor="error"
        confirmText="Cancelar Reserva"
      />
    </>
  );
};

export default Reservations;
