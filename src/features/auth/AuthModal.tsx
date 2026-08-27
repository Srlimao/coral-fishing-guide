import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useUserProfile } from '../user-profiles/UserProfileContext';
import { X, Lock, User, Eye, EyeOff, CheckCircle2, AlertTriangle, ArrowRight, UserPlus, LogIn } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    openLoginModal,
    openRegisterModal,
    login,
    register
  } = useAuth();

  const { profiles, activeProfileId, restoreAccountProfiles } = useUserProfile();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    if (isAuthModalOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanUser = username.trim().toLowerCase();
    if (!cleanUser || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    if (isLogin) {
      const result = await login({ username: cleanUser, password });
      setIsLoading(false);
      if (result.ok && result.profiles && result.profiles.length > 0) {
        restoreAccountProfiles(result.profiles, result.activeId || result.profiles[0].id);
      } else if (!result.ok) {
        setError(result.error || 'Login failed');
      }
    } else {
      const result = await register({ username: cleanUser, password }, profiles, activeProfileId);
      setIsLoading(false);
      if (!result.ok) {
        setError(result.error || 'Registration failed');
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={closeAuthModal}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="bg-[#182228] border border-white/15 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl text-[#f3f4f6] flex flex-col my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            <h3 id="auth-modal-title" className="text-base font-bold text-white">
              {isLogin ? 'Sign In to Your Account' : 'Create Cloud Account'}
            </h3>
          </div>
          <button
            onClick={closeAuthModal}
            aria-label="Close"
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-white/10 bg-black/20 px-5 pt-2 gap-2 flex-shrink-0">
          <button
            onClick={openLoginModal}
            className={`py-2 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              isLogin ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Sign In
          </button>
          <button
            onClick={openRegisterModal}
            className={`py-2 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              !isLogin ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Register
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <p className="text-neutral-300 text-xs leading-relaxed">
            {isLogin
              ? 'Access your private cloud saves across any phone, tablet, or desktop.'
              : 'Protect your fishing progress in your private password-protected cloud vault.'}
          </p>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-neutral-300 text-xs font-semibold block">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="e.g. willow"
                required
                className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/20 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-neutral-300 text-xs font-semibold block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-9 pr-10 py-2 bg-black/40 border border-white/20 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cg-pill cg-pill-active py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span>Connecting...</span>
            ) : isLogin ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Cloud</span>
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                <span>Create Private Account</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
