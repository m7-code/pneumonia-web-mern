import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import api from './api/axios';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Results from './pages/Results';
import FullReport from './pages/FullReport';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Theme ab yahan (top-level) manage hota hai, taake page navigate karne pe reset na ho
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
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

  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home user={user} onLogout={handleLogout} dark={dark} setDark={setDark} />} />
        <Route path="/login" element={<Login onAuthSuccess={setUser} dark={dark} setDark={setDark} />} />
        <Route path="/register" element={<Register onAuthSuccess={setUser} dark={dark} setDark={setDark} />} />
        <Route path="/about" element={<About user={user} onLogout={handleLogout} dark={dark} setDark={setDark} />} />
        <Route path="/results" element={<Results user={user} onLogout={handleLogout} dark={dark} setDark={setDark} />} />
        <Route path="/results/report" element={<FullReport user={user} onLogout={handleLogout} dark={dark} setDark={setDark} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;