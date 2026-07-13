import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthCard from '../components/AuthCard';
import FormInput from '../components/FormInput';

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
    <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

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

export default function Register({ onAuthSuccess }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.password !== form.password_confirmation) {
      setError('Password confirmation does not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      onAuthSuccess(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard footerText="Already have an account?" footerLinkText="Login" footerLinkTo="/login" title="Register">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 mb-5">
            {error}
          </div>
        )}

        <FormInput
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Full name"
          icon={<UserIcon />}
        />

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
          minLength={8}
          placeholder="Password"
          icon={<LockIcon />}
        />

        <FormInput
          type="password"
          name="password_confirmation"
          value={form.password_confirmation}
          onChange={handleChange}
          required
          placeholder="Confirm password"
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
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </AuthCard>
  );
}