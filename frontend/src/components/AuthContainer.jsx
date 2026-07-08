import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

export default function AuthContainer({ apiBase, onLoginSuccess, showToast }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form States
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ firstName: '', lastName: '', email: '', password: '' });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      
      if (res.ok && data.accessToken) {
        showToast('Login successful!');
        onLoginSuccess(data.accessToken);
      } else {
        showToast(data.message || 'Invalid username or password', 'error');
      }
    } catch (err) {
      showToast('Network error or CORS issue', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupForm)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        showToast('Registration successful! Please login.');
        setIsLogin(true);
        setSignupForm({ firstName: '', lastName: '', email: '', password: '' });
      } else {
        let errMsg = data.message || 'Registration failed';
        if (data.errors && Array.isArray(data.errors)) {
          errMsg = data.errors[0];
        } else if (data.message && typeof data.message === 'object') {
          errMsg = Object.values(data.message)[0];
        }
        showToast(errMsg, 'error');
      }
    } catch (err) {
      showToast('Network error or CORS issue', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '16px', 
            background: 'linear-gradient(135deg, var(--accent-color) 0%, #6a0dad 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <ShieldCheck size={32} color="white" />
          </div>
        </div>
        <h2>Zero Trust Auth</h2>
        <p>Secure, identity-first access.</p>
      </div>

      <div className="form-toggle">
        <button 
          className={`toggle-btn ${isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(true)}
          type="button"
        >
          Sign In
        </button>
        <button 
          className={`toggle-btn ${!isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(false)}
          type="button"
        >
          Sign Up
        </button>
        <div 
          className="toggle-slider" 
          style={{ transform: `translateX(${isLogin ? '0%' : '100%'})` }} 
        />
      </div>

      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {isLogin ? (
          <form className="fade-enter-active" onSubmit={handleLoginSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', top: '16px', left: '16px', color: 'var(--text-secondary)' }} />
                <input 
                  type="email" 
                  required 
                  placeholder="name@company.com" 
                  style={{ paddingLeft: '44px' }}
                  value={loginForm.email}
                  onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', top: '16px', left: '16px', color: 'var(--text-secondary)' }} />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  style={{ paddingLeft: '44px' }}
                  value={loginForm.password}
                  onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="btn primary-btn" disabled={loading} style={{ marginTop: '1rem' }}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        ) : (
          <form className="fade-enter-active" onSubmit={handleSignupSubmit}>
            <div className="input-row">
              <div className="input-group half">
                <label>First Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', top: '16px', left: '16px', color: 'var(--text-secondary)' }} />
                  <input 
                    type="text" 
                    required 
                    placeholder="John" 
                    style={{ paddingLeft: '44px' }}
                    value={signupForm.firstName}
                    onChange={e => setSignupForm({...signupForm, firstName: e.target.value})}
                  />
                </div>
              </div>
              <div className="input-group half">
                <label>Last Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', top: '16px', left: '16px', color: 'var(--text-secondary)' }} />
                  <input 
                    type="text" 
                    required 
                    placeholder="Doe" 
                    style={{ paddingLeft: '44px' }}
                    value={signupForm.lastName}
                    onChange={e => setSignupForm({...signupForm, lastName: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="input-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', top: '16px', left: '16px', color: 'var(--text-secondary)' }} />
                <input 
                  type="email" 
                  required 
                  placeholder="name@company.com" 
                  style={{ paddingLeft: '44px' }}
                  value={signupForm.email}
                  onChange={e => setSignupForm({...signupForm, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', top: '16px', left: '16px', color: 'var(--text-secondary)' }} />
                <input 
                  type="password" 
                  required 
                  minLength={8}
                  placeholder="••••••••" 
                  style={{ paddingLeft: '44px' }}
                  value={signupForm.password}
                  onChange={e => setSignupForm({...signupForm, password: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="btn primary-btn" disabled={loading} style={{ marginTop: '1rem' }}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
