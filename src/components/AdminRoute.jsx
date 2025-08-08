import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute() {
  const { user, role } = useAuth();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    if (!user) {
      setAllowed(false);
      return;
    }
    setAllowed(role === 'admin');
  }, [user, role]);

  if (allowed === null) return <p>Verificando permissão...</p>;
  if (!allowed) return <Navigate to="/no-access" replace />;
  return <Outlet />;
}
