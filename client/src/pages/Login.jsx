import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthCard from '../components/AuthCard';
import FormInput from '../components/FormInput';

// Icons - reference design ke SVG jaise hi
const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
    <path d="M2 8l10 6 10-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="16" r="1.5" fill="currentColor" />
  </svg>
);

export default function Login({ onAuthSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      onAuthSuccess(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard footerText="Don't have an account?" footerLinkText="Register" footerLinkTo="/register" title="Login">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 mb-5">
            {error}
          </div>
        )}

        <FormInput
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Email"
          icon={<MailIcon />}
        />

        <FormInput
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="Password"
          icon={<LockIcon />}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 mt-2 rounded-full text-white font-semibold text-sm uppercase tracking-wider transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 5px 20px rgba(102, 126, 234, 0.4)',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </AuthCard>
  );
}