import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  Typography
} from '@mui/material';
import {
  Dashboard,
  Restaurant,
  TableBar,
  EventNote,
  People,
  Group,
  Analytics,
  Settings
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Restaurantes', icon: <Restaurant />, path: '/restaurants' },
  { text: 'Mesas', icon: <TableBar />, path: '/tables' },
  { text: 'Reservas', icon: <EventNote />, path: '/reservations' },
  { text: 'Clientes', icon: <People />, path: '/customers' },
  { text: 'Empleados', icon: <Group />, path: '/employees' },
  { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
  { text: 'Configuración', icon: <Settings />, path: '/settings' }
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={sidebarOpen}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap component="div">
          RCM
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.employment?.position}
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => {
          // Verificar permisos basados en el rol del usuario
          const hasPermission = true; // TODO: Implementar lógica de permisos

          if (!hasPermission) return null;

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
