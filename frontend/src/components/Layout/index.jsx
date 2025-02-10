import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // No mostrar el layout en la página de login
  if (!isAuthenticated && location.pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {isAuthenticated && <Sidebar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${sidebarOpen ? 240 : 0}px)` },
          ml: { sm: sidebarOpen ? '240px' : 0 },
          transition: 'margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms'
        }}
      >
        {isAuthenticated && <Navbar />}
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
