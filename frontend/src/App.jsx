import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import AppRoutes from './routes';
import Layout from './components/Layout';

function App() {
  const { darkMode } = useSelector((state) => state.ui);

  return (
    <Box sx={{ bgcolor: darkMode ? 'background.default' : 'background.paper' }}>
      <Layout>
        <AppRoutes />
      </Layout>
    </Box>
  );
}

export default App;
