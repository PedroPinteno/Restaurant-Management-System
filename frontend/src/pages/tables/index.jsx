import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Grid
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
import TableDialog from './TableDialog';
import { getTables, deleteTable, releaseTable } from '../../services/table.service';

const Tables = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery(
    ['tables', page, rowsPerPage],
    () =>
      getTables({
        page: page + 1,
        limit: rowsPerPage
      })
  );

  const getStatusChip = (status) => {
    const statusConfig = {
      available: { label: 'Disponible', color: 'success' },
      occupied: { label: 'Ocupada', color: 'error' },
      reserved: { label: 'Reservada', color: 'warning' },
      maintenance: { label: 'Mantenimiento', color: 'default' }
    };

    const config = statusConfig[status] || statusConfig.maintenance;

    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const columns = [
    { id: 'number', label: 'Número', minWidth: 100 },
    {
      id: 'restaurant',
      label: 'Restaurante',
      minWidth: 170,
      format: (value) => value.name
    },
    {
      id: 'capacity',
      label: 'Capacidad',
      minWidth: 100,
      format: (value) => `${value} personas`
    },
    {
      id: 'type',
      label: 'Tipo',
      minWidth: 130,
      format: (value) => (value === 'standard' ? 'Estándar' : 'VIP')
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
      minWidth: 170,
      align: 'right',
      format: (_, row) => (
        <Box>
          {row.status === 'occupied' && (
            <Tooltip title="Liberar mesa">
              <IconButton
                onClick={() => handleRelease(row)}
                size="small"
                color="success"
              >
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>
          )}
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
    setSelectedTable(null);
    setDialogOpen(true);
  };

  const handleEdit = (table) => {
    setSelectedTable(table);
    setDialogOpen(true);
  };

  const handleDeleteClick = (table) => {
    setSelectedTable(table);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteTable(selectedTable._id);
      enqueueSnackbar('Mesa eliminada exitosamente', {
        variant: 'success'
      });
      refetch();
    } catch (error) {
      enqueueSnackbar('Error al eliminar la mesa', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedTable(null);
    }
  };

  const handleRelease = async (table) => {
    try {
      await releaseTable(table._id);
      enqueueSnackbar('Mesa liberada exitosamente', {
        variant: 'success'
      });
      refetch();
    } catch (error) {
      enqueueSnackbar('Error al liberar la mesa', { variant: 'error' });
    }
  };

  const handleDialogClose = (refresh = false) => {
    setDialogOpen(false);
    setSelectedTable(null);
    if (refresh) {
      refetch();
    }
  };

  return (
    <>
      <PageHeader
        title="Mesas"
        breadcrumbs={[{ text: 'Mesas', href: '/tables' }]}
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
                  Nueva Mesa
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

      <TableDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        table={selectedTable}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar Mesa"
        message={`¿Está seguro que desea eliminar la mesa ${selectedTable?.number}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmColor="error"
        confirmText="Eliminar"
      />
    </>
  );
};

export default Tables;
