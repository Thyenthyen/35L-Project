import {useState} from 'react';
import Calendar from './components/Calendar';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // 'login' or 'register'

  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  if (!user) {
    return (
      <div className="auth-wrapper">
        {view === 'login' ? (
          <>
            <Login onLogin={setUser} />
            <p>
              Don't have an account?{' '}
              <button onClick={() => setView('register')}>Register</button>
            </p>
          </>
        ) : (
          <>
            <Register onRegister={setUser} />
            <p>
              Already have an account?{' '}
              <button onClick={() => setView('login')}>Login</button>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <Calendar user={user} />
    </div>
  );
}

export default App;
