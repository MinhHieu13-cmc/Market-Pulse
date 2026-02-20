import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const RegisterForm: React.FC = () => {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await signup(email, password);
      setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-fintech-bg px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6">Đăng ký</h1>
        {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}
        {success && <div className="mb-4 text-green-400 text-sm">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-fintech-accent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm mb-1">Mật khẩu</label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-fintech-accent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-fintech-accent hover:bg-fintech-up text-slate-900 font-semibold rounded-md transition"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>
        <p className="text-slate-400 text-sm mt-4">Đã có tài khoản? <Link className="text-fintech-accent hover:underline" href="/login">Đăng nhập</Link></p>
      </div>
    </div>
  )
}

export default RegisterForm;
