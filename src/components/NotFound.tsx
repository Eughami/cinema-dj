import { useNavigate } from 'react-router';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>404 - Page non trouvée</h1>
      <p>La page que vous recherchez n'existe pas.</p>
      <button onClick={() => navigate('/')}>Retour à l'accueil</button>
    </div>
  );
}

export default NotFound;
