import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Sparkles, UserPlus, LogIn } from 'lucide-react';
import { loginUser, registerUser } from '../../services/api';
import { useAuth, User } from '../../context/AuthContext';
import { useToast, Toast } from '../../components/feedback/Toast';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const response = await loginUser(email, password);
        const sessionUser: User = {
          id: response.id,
          email: response.email,
          role: response.role as User['role'],
          full_name: response.full_name,
        };
        login(sessionUser);
        onLogin();
        showToast('Login successful!', 'success');
      } else {
        // Register
        const response = await registerUser({ email, password, full_name: fullName, role });
        // After registration, log the user in automatically
        const sessionUser: User = {
          id: response.id,
          email: response.email,
          role: response.role as User['role'],
          full_name: response.full_name,
        };
        login(sessionUser);
        onLogin();
        showToast(`Account created! Welcome, ${fullName || email}!`, 'success');
      }
    } catch (error: any) {
      showToast(
        error.message ||
          (mode === 'login' ? 'Login failed. Check your credentials.' : 'Registration failed. Email may already be taken.'),
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => (m === 'login' ? 'register' : 'login'));
    setEmail('');
    setPassword('');
    setFullName('');
  };

  const inputCls = `
    w-full px-4 py-3 rounded-xl
    bg-white/[0.04] border border-white/15
    backdrop-blur-xl
    text-white text-sm placeholder:text-white/30
    focus:bg-white/[0.08] focus:border-[#9B7CFF]/50 focus:ring-2 focus:ring-[#9B7CFF]/20
    hover:bg-white/[0.06] hover:border-white/25
    shadow-[0_4px_24px_rgba(0,0,0,0.3)]
    transition-all duration-300
    outline-none
  `;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <iframe
          src="https://my.spline.design/animatedlightdesktop-q3VkMLsfCZi7SQXbWNIgqvIe/"
          className="w-full h-full border-0"
          title="STUDIFY 3D Animation"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="eager"
          style={{ pointerEvents: 'auto', willChange: 'transform', transform: 'translateZ(0)' }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 pointer-events-none">
        <div className="w-full max-w-[420px] animate-in fade-in duration-1000 pointer-events-auto">

          {/* Logo */}
          <div className="text-center mb-8 animate-in slide-in-from-top-4 duration-700">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="text-[#9B7CFF] drop-shadow-[0_0_12px_rgba(155,124,255,0.8)]" size={28} />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#9B7CFF] to-[#FFABE1] bg-clip-text text-transparent">
                STUDIFY
              </h1>
            </div>
            <p className="text-white/80 text-sm">Smart study, simplified.</p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 p-1 mb-6 animate-in slide-in-from-top-4 duration-700" style={{ animationDelay: '80ms' }}>
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                ${mode === 'login'
                  ? 'bg-gradient-to-r from-[#9B7CFF] to-[#8B5CF6] text-white shadow-lg'
                  : 'text-white/50 hover:text-white/80'}`}
            >
              <LogIn size={16} /> Log In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                ${mode === 'register'
                  ? 'bg-gradient-to-r from-[#9B7CFF] to-[#8B5CF6] text-white shadow-lg'
                  : 'text-white/50 hover:text-white/80'}`}
            >
              <UserPlus size={16} /> Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '160ms' }}>

            {/* Full Name — only in register mode */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-white/90 mb-2 ml-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Your name"
                  required
                  className={inputCls}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2 ml-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className={inputCls}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-white/90 mb-2 ml-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={mode === 'register' ? 6 : undefined}
                  className={`${inputCls} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/90 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {mode === 'register' && (
                <p className="text-[10px] text-white/40 mt-1 ml-1">Minimum 6 characters</p>
              )}
            </div>

            {/* Role selector — only in register mode */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-white/90 mb-2 ml-1">I am a…</label>
                <div className="flex gap-3">
                  {(['student', 'teacher'] as const).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300
                        ${role === r
                          ? 'border-[#9B7CFF] bg-[#9B7CFF]/20 text-white'
                          : 'border-white/15 bg-white/5 text-white/50 hover:bg-white/10'}`}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full px-6 py-3.5 rounded-xl mt-2
                bg-gradient-to-r from-[#9B7CFF] via-[#8B5CF6] to-[#FFABE1]
                text-white font-bold text-sm
                flex items-center justify-center gap-2
                hover:shadow-[0_0_40px_rgba(155,124,255,0.8)]
                hover:scale-[1.02]
                active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                shadow-[0_8px_32px_rgba(155,124,255,0.4)]
                transition-all duration-300
                relative overflow-hidden group
              "
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{mode === 'login' ? 'Logging in…' : 'Creating account…'}</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Log In' : 'Create Account'}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
              {/* Shimmer */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </button>

            {/* Demo credentials hint */}
            {mode === 'login' && (
              <div className="mt-2 p-3 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 text-center">
                <p className="text-[11px] text-white/50 mb-1.5">Demo credentials:</p>
                <div className="flex justify-center gap-3 flex-wrap">
                  {[
                    { label: 'Admin', email: 'admin@studify.com', pwd: 'admin123' },
                    { label: 'Teacher', email: 'teacher@studify.com', pwd: 'teacher123' },
                    { label: 'Student', email: 'student@studify.com', pwd: 'student123' },
                  ].map(d => (
                    <button
                      key={d.label}
                      type="button"
                      onClick={() => { setEmail(d.email); setPassword(d.pwd); }}
                      className="text-[10px] px-2 py-1 rounded-lg bg-white/10 text-white/60 hover:bg-[#9B7CFF]/30 hover:text-white transition-all"
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="mt-8 pt-5 border-t border-white/10 animate-in fade-in duration-1000" style={{ animationDelay: '400ms' }}>
            <p className="text-xs text-white/40 text-center leading-relaxed">
              By continuing, you agree to our{' '}
              <span className="text-white/60 hover:text-white/90 cursor-pointer transition-colors">Terms of Service</span>{' '}
              and{' '}
              <span className="text-white/60 hover:text-white/90 cursor-pointer transition-colors">Privacy Policy</span>
            </p>
          </div>

        </div>
      </div>

      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
    </div>
  );
}