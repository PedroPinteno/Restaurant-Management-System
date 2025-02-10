import { Typography, Box, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const PageHeader = ({ title, breadcrumbs }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      {breadcrumbs && (
        <Breadcrumbs aria-label="breadcrumb">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return isLast ? (
              <Typography key={crumb.text} color="text.primary">
                {crumb.text}
              </Typography>
            ) : (
              <Link
                key={crumb.text}
                component={RouterLink}
                to={crumb.href}
                underline="hover"
                color="inherit"
              >
                {crumb.text}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}
    </Box>
  );
};

export default PageHeader;
