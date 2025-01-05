import { useNavigate } from 'react-router';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
}

export default NotFound;
