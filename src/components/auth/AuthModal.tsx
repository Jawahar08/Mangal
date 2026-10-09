// Auth Modal: Sign In & Sign Up

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { LogIn, UserPlus, Lock, Mail, Phone, KeyRound, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    openRecoveryModal, 
    loginUser, 
    startOnboarding, 
    showToast 
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  const [email, setEmail] = useState('arjun.sharma@example.com');
  const [password, setPassword] = useState('••••••••••');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'signup') {
      closeAuthModal();
      startOnboarding();
      return;
    }

    if (authMethod === 'email') {
      if (!email.includes('@')) {
        showToast('Invalid Email', 'Please enter a valid email address.', 'warning');
        return;
      }
      loginUser(email);
    } else {
      if (!otpSent) {
        setOtpSent(true);
        showToast('OTP Dispatched', 'A 6-digit verification code has been dispatched to your phone.', 'info');
      } else {
        loginUser(`${phone}@phone.mangalsutra`);
      }
    }
  };

  return (
    <Modal isOpen={isAuthModalOpen} onClose={closeAuthModal} title={mode === 'signin' ? 'Sign In to MangalSutra' : 'Create Your Account'}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Method Toggle */}
        <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
          <button
            type="button"
            className="btn-outline"
            style={{
              flex: 1,
              border: 'none',
              background: authMethod === 'email' ? '#FFFFFF' : 'transparent',
              color: authMethod === 'email' ? 'var(--color-burgundy-dark)' : 'var(--text-muted)',
              boxShadow: authMethod === 'email' ? 'var(--shadow-sm)' : 'none',
              fontSize: '0.82rem',
              padding: '0.5rem',
            }}
            onClick={() => setAuthMethod('email')}
          >
            <Mail size={14} />
            <span>Email</span>
          </button>
          <button
            type="button"
            className="btn-outline"
            style={{
              flex: 1,
              border: 'none',
              background: authMethod === 'phone' ? '#FFFFFF' : 'transparent',
              color: authMethod === 'phone' ? 'var(--color-burgundy-dark)' : 'var(--text-muted)',
              boxShadow: authMethod === 'phone' ? 'var(--shadow-sm)' : 'none',
              fontSize: '0.82rem',
              padding: '0.5rem',
            }}
            onClick={() => setAuthMethod('phone')}
          >
            <Phone size={14} />
            <span>Phone OTP</span>
          </button>
        </div>

        {authMethod === 'email' ? (
          <>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      closeAuthModal();
                      openRecoveryModal();
                    }}
                    style={{ fontSize: '0.78rem', color: 'var(--color-gold-dark)', fontWeight: 600 }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </>
        ) : (
          <>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
              />
            </div>
            {otpSent && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  className="form-input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="e.g. 582419"
                  required
                />
              </div>
            )}
          </>
        )}

        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
          {mode === 'signin' ? (
            <>
              <LogIn size={16} />
              <span>{authMethod === 'phone' && !otpSent ? 'Request OTP' : 'Sign In Securely'}</span>
            </>
          ) : (
            <>
              <UserPlus size={16} />
              <span>Begin Conversational Onboarding</span>
            </>
          )}
        </button>

        {/* Switch Mode */}
        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {mode === 'signin' ? (
            <>
              Don’t have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                style={{ color: 'var(--color-burgundy)', fontWeight: 700 }}
              >
                Create Account
              </button>
            </>
          ) : (
            <>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                style={{ color: 'var(--color-burgundy)', fontWeight: 700 }}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </form>
    </Modal>
  );
};
