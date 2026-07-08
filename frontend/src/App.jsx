import { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, LogOut, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import AuthContainer from './components/AuthContainer';
import Dashboard from './components/Dashboard';
import './index.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [token, setToken] = useState(localStorage.getItem('accessToken') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  }, []);

  const fetchCurrentUser = useCallback(async (currentToken) => {
    try {
      const res = await fetch(`${API_BASE}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });
      
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        handleLogout(false);
      }
    } catch (err) {
      showToast('Failed to fetch user data', 'error');
      handleLogout(false);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, [token, fetchCurrentUser]);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    localStorage.setItem('accessToken', newToken);
    setLoading(true);
    fetchCurrentUser(newToken);
  };

  const handleLogout = async (showToastMsg = true) => {
    if (token) {
      try {
        await fetch(`${API_BASE}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    if (showToastMsg) {
      showToast('Logged out successfully');
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Loader2 className="animate-spin text-accent-color" size={48} />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Toast Notification */}
      <div className="toast-container">
        <div className={`toast ${toast.type} ${toast.show ? 'show' : ''}`}>
          <div className="toast-icon">
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          </div>
          <span className="toast-message">{toast.message}</span>
        </div>
      </div>

      {user ? (
        <Dashboard user={user} onLogout={() => handleLogout(true)} />
      ) : (
        <AuthContainer apiBase={API_BASE} onLoginSuccess={handleLoginSuccess} showToast={showToast} />
      )}
    </div>
  );
}

export default App;
