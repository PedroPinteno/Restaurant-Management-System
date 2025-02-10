import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Restaurant as RestaurantIcon,
  TableBar as TableIcon,
  People as PeopleIcon,
  EventAvailable as ReservationIcon,
  Badge as EmployeeIcon,
  Settings as SettingsIcon,
  Person as ProfileIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Restaurantes', icon: <RestaurantIcon />, path: '/restaurants' },
  { text: 'Mesas', icon: <TableIcon />, path: '/tables' },
  { text: 'Clientes', icon: <PeopleIcon />, path: '/customers' },
  { text: 'Reservas', icon: <ReservationIcon />, path: '/reservations' },
  { text: 'Empleados', icon: <EmployeeIcon />, path: '/employees' }
];

const bottomMenuItems = [
  { text: 'Mi Perfil', icon: <ProfileIcon />, path: '/profile' },
  { text: 'Configuración', icon: <SettingsIcon />, path: '/settings' }
];

const SideNav = ({ open, onClose, width = 240 }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  const content = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List>
        {bottomMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: width }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true // Mejor rendimiento en dispositivos móviles
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: width
          }
        }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: width
          }
        }}
        open
      >
        {content}
      </Drawer>
    </Box>
  );
};

export default SideNav;
