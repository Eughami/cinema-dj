import { Button } from '@mantine/core';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import { clearAdminToken } from './adminAuth';

interface AdminLogoutButtonProps {
  label?: string;
}

const AdminLogoutButton = ({
  label = 'Logout',
}: AdminLogoutButtonProps): JSX.Element => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminToken();
    navigate('/admin/login', { replace: true });
  };

  return (
    <Button
      variant="white"
      color="dark"
      radius="xl"
      leftSection={<FiLogOut size={14} />}
      onClick={handleLogout}
    >
      {label}
    </Button>
  );
};

export default AdminLogoutButton;
