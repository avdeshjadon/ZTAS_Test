import { LogOut } from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  // Get initials for avatar
  const initials = `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`.toUpperCase() || 'U';

  return (
    <div className="glass-panel dashboard-card">
      <div className="user-avatar">
        {initials}
      </div>
      <h2>Welcome Back!</h2>
      <p style={{ marginBottom: '2rem' }}>You have successfully authenticated.</p>

      <div className="user-info">
        <div className="info-row">
          <span className="info-label">Full Name</span>
          <span className="info-value">{user.firstName} {user.lastName}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Email Address</span>
          <span className="info-value">{user.email}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Status</span>
          <span className="info-value" style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)', display: 'inline-block' }}></span>
            Active Session
          </span>
        </div>
      </div>

      <button onClick={onLogout} className="btn secondary-btn">
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
}
