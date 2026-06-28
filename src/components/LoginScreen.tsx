/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  ShieldCheck, 
  Loader2, 
  CheckCircle,
  UserCheck
} from 'lucide-react';
import { User } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (user: Partial<User>) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'FACULTY' | 'ADMIN'>('STUDENT');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (val: string) => {
    return val.endsWith('@bbdu.edu') || (val.includes('@') && (val.split('@')[1]?.length ?? 0) > 2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset auth state for fresh attempt
    setIsLoading(false);
    setAuthStatus('idle');
    if (!email) {
      setErrorMessage('Please enter your university email.');
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage('Please use a valid university email address (e.g., name@bbdu.edu).');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    setAuthStatus('loading');

    // Simulate authentication timing
    setTimeout(() => {
      setAuthStatus('success');
      setTimeout(() => {
        onLoginSuccess({
          name: isLogin ? 'Alex Rivera' : fullName || 'New Scholar',
          email: email,
          role: role === 'FACULTY' ? 'FACULTY' : role === 'ADMIN' ? 'ADMIN' : 'STUDENT',
          department: isLogin ? 'Computer Science' : 'Engineering & Tech',
          availability: 'Active'
        });
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 md:p-8 radial-gradient-mesh">
      <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 overflow-hidden rounded-2xl shadow-xl bg-surface border border-outline-variant/30">
        {/* Left Section: Hero/Illustration */}
        <div className="hidden md:flex md:col-span-6 lg:col-span-7 bg-primary-container relative flex-col justify-between p-8 text-on-primary">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-8">
              <GraduationCap className="text-primary-fixed w-8 h-8" />
              <h1 className="text-2xl font-bold tracking-tight text-primary-fixed">BbduConnect</h1>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
              Elevate Your Academic Journey.
            </h2>
            <p className="text-base text-on-primary-container max-w-md leading-relaxed">
              Join a dedicated community of scholars, researchers, and students. BbduConnect bridges the gap between structured learning and social collaboration.
            </p>
          </div>

          {/* Illustration Area */}
          <div className="relative w-full h-80 my-4 z-10 flex items-center justify-center">
            <img 
              className="w-full h-full object-contain rounded-xl drop-shadow-2xl transform transition-transform duration-500 hover:scale-[1.02]" 
              alt="University students collaborating in lounge" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9YQWoDWbKKhEsSIINabU2Il__mIkkNYBLCUYxtCJJ18X4DO0rItQi_p7fiFHmeAePh9zcHAIR3kITc07FzetCwHxLnDR2pUnj3g7XiDHH8Bqer0bEiBEnqc2PSphJ_MsIsIIeGsLUxnSkHW6N6vQSCkX-QDOoFAy8WAAKancpWDIjLRazyl1aQaooP1LeQb7b9wjOzOx5XWtOgMVUn7aoDPUdY7A6GiXeFW77OFwDpscyiKizFi58Ruj08byZ36qbm_BYF9BsTZg"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="z-10 mt-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                <img 
                  className="w-10 h-10 rounded-full border-2 border-primary-container object-cover" 
                  alt="Researcher" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfbXtwsJ2_x1GPdDS1Coc1ku7912d_WWZDi1tmxj1MgIO2eLJ6IkPG5kYLSuSbCULvhmhNbpRYIRudmO1LZZYQbaRy04XBhUHZJ4nzHE2W7YxGPOUTnyQZ9w2p5gjjfN7PCzO07iw-zkrGrOYurWv2Ik3nUF30lEdIIY0PGqtMYYgPlvJnLMpERhCwzAlaE134-95gymnKg7W0E0Rc2We0uk5gd7_UBGP-OxxvN-MV9gLNyZoc2U1HRMpIsNv6qPxpGJ7NJcYqVEM"
                  referrerPolicy="no-referrer"
                />
                <img 
                  className="w-10 h-10 rounded-full border-2 border-primary-container object-cover" 
                  alt="Student" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8J5pxq79Ycp4rTWHSyb3FlX2p4eYDyHRBWf1084ViPJ68qcYT3opaOXyU1QSuCiSg31EXmlxVIcZqYi3N1PyYdz7q3WdRmd2zt9PiQUO1_44u0pXM_LkdQCFRtUjeu6m5wcTCuv3nfgtBIimAWZxZ-mVbJZDgvudLWVXe9ADKhjCKQRzV0o1RdASWeuzV_21K_fEn0rW1piSb_Sm5ErwRVm_021b4vIdJTbkT8hUaD-mgWvPAsYoWnFsf0PRldplWqY0XZs2LlaU"
                  referrerPolicy="no-referrer"
                />
                <img 
                  className="w-10 h-10 rounded-full border-2 border-primary-container object-cover" 
                  alt="Faculty Member" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKRR-9vMX6DvOdETtbladAda_gkVpZW_yMbsOV2P6ENAV1wsQKNGEiSLUZ7gTmPYjAcy7Z_P3xGjUaKKWRPBTJHNQf5CuWVzhl7VWMSjrafobNctrn7Ke9p4KZLFZPMqSM7-EpNqGSgMrAPcElLZC75u4c0ZsDZSzoiTWJTxTjNpQ35M2qxpabZC9k9MPvs81NCeF_j-AE7tKhxdJaXAFaZqlvwU6dc1n2OOqMZtGytPncz8aweFcyvK5mGgS_YM5dnDluD6lmLQw"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-xs text-on-primary-container font-medium">
                <span className="font-bold text-primary-fixed">2,400+</span> students joined this week
              </p>
            </div>
          </div>
          {/* Background Gradient Layer */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent pointer-events-none" />
        </div>

        {/* Right Section: Auth Form */}
        <div className="col-span-1 md:col-span-6 lg:col-span-5 p-6 md:p-10 flex flex-col justify-center bg-surface-container-lowest">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center gap-2 mb-6">
            <GraduationCap className="text-primary w-8 h-8" />
            <span className="text-xl font-bold tracking-tight text-primary">BbduConnect</span>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-on-background mb-1">
              {isLogin ? 'Welcome Back' : 'Create Scholar Account'}
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {isLogin 
                ? 'Log in to access your academic hub and messages.' 
                : 'Join the academic network and connect with peers and faculty.'
              }
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-error-container text-on-error-container text-xs rounded-lg flex items-center gap-2 border border-error/20">
              <span className="font-bold">Error:</span> {errorMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant block" htmlFor="fullName">
                  Full Name
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                  <input 
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm text-on-background focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 outline-none" 
                    id="fullName" 
                    placeholder="Alex Rivera" 
                    required={!isLogin} 
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant block" htmlFor="email">
                University Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input 
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm text-on-background focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 outline-none" 
                  id="email" 
                  placeholder="name@bbdu.edu" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (isLogin && e.target.value.toLowerCase().startsWith('sarah')) {
                      setRole('FACULTY');
                    } else if (isLogin && e.target.value.toLowerCase().startsWith('admin')) {
                      setRole('ADMIN');
                    } else {
                      setRole('STUDENT');
                    }
                  }}
                />
              </div>
              <p className="text-[10px] text-on-surface-variant mt-0.5">
                Tip: Enter your student or faculty email (e.g. name@bbdu.edu)
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant block" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input 
                  className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm text-on-background focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 outline-none" 
                  id="password" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant block">
                  Select Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['STUDENT', 'FACULTY', 'ADMIN'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                        role === r
                          ? 'bg-primary-container text-on-primary-container border-primary'
                          : 'bg-surface-container border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                      onClick={() => setRole(r)}
                    >
                      {r === 'STUDENT' ? 'Student' : r === 'FACULTY' ? 'Faculty' : 'Admin'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-xs text-on-surface-variant group-hover:text-on-surface">Remember me</span>
              </label>
              <button 
                type="button" 
                className="text-xs text-primary font-semibold hover:underline bg-transparent border-none cursor-pointer focus:outline-none"
                onClick={() => alert('Instruction: A password reset link has been dispatched to your email address (Simulated).')}
              >
                Forgot password?
              </button>
            </div>

            <button 
              className={`w-full py-3 px-6 text-sm font-semibold rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                authStatus === 'success' 
                  ? 'bg-secondary text-on-secondary hover:bg-secondary/90' 
                  : 'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container'
              }`}
              disabled={isLoading}
              type="submit"
            >
              {authStatus === 'loading' && (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              )}
              {authStatus === 'success' && (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Access Granted
                </>
              )}
              {authStatus === 'idle' && (isLogin ? 'Secure Log In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-surface-container-lowest text-xs text-on-surface-variant">
                  {isLogin ? 'Join your college community' : 'Already have an account?'}
                </span>
              </div>
            </div>

            <button 
              className="w-full py-2.5 px-4 border border-outline text-on-surface rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-surface-container transition-all duration-200 focus:outline-none"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMessage('');
                setIsLoading(false);
                setAuthStatus('idle');
              }}
            >
              <UserPlus className="w-5 h-5" />
              {isLogin ? 'Create Student Account' : 'Back to Login'}
            </button>

            <div className="flex items-center justify-center gap-1.5 pt-4 border-t border-outline-variant/30">
              <ShieldCheck className="text-secondary w-5 h-5" />
              <span className="text-[10px] text-on-surface-variant tracking-wider uppercase font-semibold">
                JWT Secure Authentication
              </span>
            </div>
          </div>

          <footer className="mt-6 text-center text-[11px] text-on-surface-variant leading-relaxed">
            <p>
              © 2026 BbduConnect. All rights reserved. <br className="md:hidden" />
              <a className="hover:text-primary underline underline-offset-4" href="#">Privacy Policy</a> •{' '}
              <a className="hover:text-primary underline underline-offset-4" href="#">Terms of Service</a>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
