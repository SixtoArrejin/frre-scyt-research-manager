import { Button } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';

export default function BackButton({ to, variant = 'ghost', size = 'md', ...props }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      // If a specific route is provided, use it
      return;
    }
    // Otherwise, go back in history
    navigate(-1);
  };

  if (to) {
    return (
      <Button
        as={Link}
        to={to}
        variant={variant}
        size={size}
        aria-label="Volver"
        {...props}
      >
        <ArrowBackIcon />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      aria-label="Volver"
      {...props}
    >
      <ArrowBackIcon />
    </Button>
  );
}
