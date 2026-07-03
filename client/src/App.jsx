import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import api from './api/axios';
import Home from './pages/Home';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // App load hote hi check karo koi user already logged in to nahi (JWT cookie se)
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        // Cookie nahi hai ya expired hai - guest treat karo
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  async function handleLogout() {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err.message);
    }
  }

  // Jab tak auth check chal raha hai, kuch bhi render mat karo (flash of wrong state se bachne ke liye)
  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        {/* Login, Register, About, Results routes baad me add karenge */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;