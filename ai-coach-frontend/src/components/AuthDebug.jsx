import { useAuth } from '../contexts/AuthContext';

export default function AuthDebug() {
  const { user, isAuthenticated, loading, token } = useAuth();
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h4 className="font-bold mb-2">Auth Debug Info:</h4>
      <div>Loading: {loading ? 'Yes' : 'No'}</div>
      <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>Token: {token ? 'Exists' : 'None'}</div>
      {user && (
        <>
          <div>User ID: {user.id}</div>
          <div>Email: {user.email}</div>
          <div>Name: {user.name}</div>
        </>
      )}
    </div>
  );
}
