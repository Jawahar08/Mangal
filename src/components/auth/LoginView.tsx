// Dedicated Member Authentication & Login Page
// Provides full-screen access to Sign In, Phone OTP, and Registration

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  EyeOff 
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { 
    loginUser, 
    startOnboarding, 
    openRecoveryModal, 
    showToast, 
    setActiveTab 
  } = useApp();

  const [activeMode, setActiveMode] = useState<'signin' | 'signup'>('signin');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  // Form states
  const [email, setEmail] = useState('arjun.sharma@example.com');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('+91 98765 43210');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (activeMode === 'signup') {
      startOnboarding();
      setIsSubmitting(false);
      return;
    }

    if (authMethod === 'email') {
      if (!email.includes('@')) {
        showToast('Invalid Email', 'Please enter a valid email address.', 'warning');
        setIsSubmitting(false);
        return;
      }
      loginUser(email);
      setActiveTab('discover');
    } else {
      if (!otpSent) {
        const { AuthService } = await import('../../services/backend');
        const res = await AuthService.requestPhoneOtp(phone);
        if (res.success) {
          setOtpSent(true);
          showToast('OTP Dispatched', res.message || 'OTP sent to your phone.', 'info');
        } else {
          showToast('OTP Error', res.error, 'warning');
        }
      } else {
        const { AuthService } = await import('../../services/backend');
        const res = await AuthService.verifyPhoneOtp(phone, otp);
        if (res.success) {
          loginUser(`${phone}@phone.mangalsutra`);
          setActiveTab('discover');
        } else {
          showToast('Invalid OTP', res.error, 'error');
        }
      }
    }
    setIsSubmitting(false);
  };

  const handleDemoLogin = () => {
    loginUser('arjun.sharma@example.com');
    setActiveTab('discover');
  };

  return (
    <div className="container" style={{ maxWidth: '620px', padding: '2.5rem 1.25rem 5rem', animation: 'fadeIn 250ms ease-out' }}>
      {/* Heritage Header Card */}
      <div className="card-heritage" style={{ padding: '2.5rem 2rem', position: 'relative' }}>
        
        {/* Brand Emblem */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div 
            style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '50%', 
              background: 'var(--color-burgundy-dark)', 
              border: '2px solid var(--color-gold)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 0.75rem',
              boxShadow: '0 4px 14px rgba(197, 160, 89, 0.3)'
            }}
          >
            <Sparkles size={26} color="#D4AF37" />
          </div>
          <h1 className="heading-section" style={{ fontSize: '1.85rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.25rem' }}>
            MangalSutra 2.0
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            Marriage, With Trust • Member Authentication Portal
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Create Account */}
        <div 
          style={{ 
            display: 'flex', 
            background: 'var(--bg-secondary)', 
            padding: '4px', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '1.75rem',
            border: '1px solid var(--border-light)'
          }}
        >
          <button
            type="button"
            className="btn-outline"
            style={{
              flex: 1,
              border: 'none',
              background: activeMode === 'signin' ? '#FFFFFF' : 'transparent',
              color: activeMode === 'signin' ? 'var(--color-burgundy-dark)' : 'var(--text-muted)',
              fontWeight: activeMode === 'signin' ? 700 : 500,
              boxShadow: activeMode === 'signin' ? 'var(--shadow-sm)' : 'none',
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              transition: 'all 200ms ease'
            }}
            onClick={() => setActiveMode('signin')}
          >
            <LogIn size={16} />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            className="btn-outline"
            style={{
              flex: 1,
              border: 'none',
              background: activeMode === 'signup' ? '#FFFFFF' : 'transparent',
              color: activeMode === 'signup' ? 'var(--color-burgundy-dark)' : 'var(--text-muted)',
              fontWeight: activeMode === 'signup' ? 700 : 500,
              boxShadow: activeMode === 'signup' ? 'var(--shadow-sm)' : 'none',
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              transition: 'all 200ms ease'
            }}
            onClick={() => setActiveMode('signup')}
          >
            <UserPlus size={16} />
            <span>Create Account</span>
          </button>
        </div>

        {activeMode === 'signin' ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email vs Phone Method Selector */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <button
                type="button"
                className={`btn-outline ${authMethod === 'email' ? 'active' : ''}`}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  borderColor: authMethod === 'email' ? 'var(--color-burgundy)' : 'var(--border-light)',
                  background: authMethod === 'email' ? 'rgba(107, 23, 40, 0.05)' : '#FFF',
                  fontWeight: authMethod === 'email' ? 700 : 500
                }}
                onClick={() => setAuthMethod('email')}
              >
                <Mail size={15} />
                <span>Email Password</span>
              </button>
              <button
                type="button"
                className={`btn-outline ${authMethod === 'phone' ? 'active' : ''}`}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  borderColor: authMethod === 'phone' ? 'var(--color-burgundy)' : 'var(--border-light)',
                  background: authMethod === 'phone' ? 'rgba(107, 23, 40, 0.05)' : '#FFF',
                  fontWeight: authMethod === 'phone' ? 700 : 500
                }}
                onClick={() => setAuthMethod('phone')}
              >
                <Phone size={15} />
                <span>Mobile OTP</span>
              </button>
            </div>

            {authMethod === 'email' ? (
              <>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. arjun.sharma@example.com"
                      required
                      style={{ paddingLeft: '2.5rem' }}
                    />
                    <Mail 
                      size={16} 
                      color="var(--text-muted)" 
                      style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} 
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label className="form-label" style={{ fontWeight: 600, marginBottom: 0 }}>Password</label>
                    <button
                      type="button"
                      onClick={openRecoveryModal}
                      style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark)', fontWeight: 600, background: 'none' }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                    />
                    <Lock 
                      size={16} 
                      color="var(--text-muted)" 
                      style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ 
                        position: 'absolute', 
                        right: '0.85rem', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        background: 'none', 
                        color: 'var(--text-muted)' 
                      }}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>Mobile Number (with Country Code)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      style={{ paddingLeft: '2.5rem' }}
                    />
                    <Phone 
                      size={16} 
                      color="var(--text-muted)" 
                      style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} 
                    />
                  </div>
                </div>

                {otpSent && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>Enter 6-Digit OTP</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="form-input"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="e.g. 582419"
                        required
                        style={{ paddingLeft: '2.5rem', letterSpacing: '2px', fontSize: '1.1rem', fontWeight: 700 }}
                      />
                      <KeyRound 
                        size={16} 
                        color="var(--text-muted)" 
                        style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} 
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
              disabled={isSubmitting}
            >
              <LogIn size={18} />
              <span>
                {authMethod === 'phone' && !otpSent ? 'Send Secure OTP' : 'Sign In Securely'}
              </span>
            </button>

            {/* Quick Demo Login Option */}
            <div 
              style={{ 
                marginTop: '0.75rem', 
                padding: '1rem', 
                background: 'rgba(197, 160, 89, 0.08)', 
                borderRadius: 'var(--radius-md)', 
                border: '1px dashed rgba(197, 160, 89, 0.4)',
                textAlign: 'center' 
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--color-burgundy)', fontWeight: 700, marginBottom: '0.35rem' }}>
                Instant Testing & Evaluation
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="btn-outline"
                style={{ 
                  width: '100%', 
                  background: '#FFFFFF', 
                  fontSize: '0.85rem', 
                  padding: '0.55rem',
                  borderColor: 'var(--color-gold)'
                }}
              >
                <Sparkles size={15} color="var(--color-gold-dark)" />
                <span>1-Click Sign In as Verified Member (Arjun Sharma)</span>
              </button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div 
              style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: 'var(--color-gold-subtle)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 1.25rem',
                border: '1px solid var(--color-gold)'
              }}
            >
              <UserPlus size={26} color="var(--color-gold-dark)" />
            </div>

            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-burgundy-dark)', marginBottom: '0.6rem' }}>
              Create Your Verified Marital Profile
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Experience safe, dignified matchmaking with genuine candidates, verified educational & family credentials, and multi-layer privacy control.
            </p>

            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
              onClick={startOnboarding}
            >
              <UserPlus size={18} />
              <span>Begin Conversational Onboarding</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Security & Trust Footer */}
        <div 
          style={{ 
            marginTop: '2rem', 
            paddingTop: '1.25rem', 
            borderTop: '1px solid var(--border-light)', 
            display: 'flex', 
            justifyContent: 'space-around', 
            fontSize: '0.75rem', 
            color: 'var(--text-muted)' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={14} color="var(--color-gold-dark)" />
            <span>ChaanBean™ Verified</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Lock size={14} color="var(--color-gold-dark)" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={14} color="var(--color-gold-dark)" />
            <span>DPDP Act 2023 Compliant</span>
          </div>
        </div>

      </div>
    </div>
  );
};
