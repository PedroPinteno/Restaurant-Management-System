import { Button, CircularProgress } from '@mui/material';

const LoadingButton = ({
  loading,
  children,
  startIcon,
  disabled,
  ...props
}) => {
  return (
    <Button
      disabled={loading || disabled}
      startIcon={
        loading ? <CircularProgress size={20} color="inherit" /> : startIcon
      }
      {...props}
    >
      {children}
    </Button>
  );
};

export default LoadingButton;
