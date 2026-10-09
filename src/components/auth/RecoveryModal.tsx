// Account Recovery Modal: Password & Access Recovery

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { KeyRound, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export const RecoveryModal: React.FC = () => {
  const { isRecoveryModalOpen, closeRecoveryModal, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Valid Email Required', 'Please enter your registered account email.', 'warning');
      return;
    }

    setIsSent(true);
    showToast(
      'Recovery Instructions Dispatched',
      `A secure reset link has been dispatched to ${email}.`,
      'success'
    );
  };

  const handleClose = () => {
    setIsSent(false);
    setEmail('');
    closeRecoveryModal();
  };

  return (
    <Modal isOpen={isRecoveryModalOpen} onClose={handleClose} title="Recover Your Account">
      {isSent ? (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <CheckCircle2 size={28} color="#15803D" />
          </div>
          <h3 className="heading-card" style={{ color: 'var(--color-burgundy-dark)', marginBottom: '0.5rem' }}>
            Recovery Link Sent
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            If an account exists for <strong>{email}</strong>, you will receive an encrypted reset link within a few minutes. Check your inbox and spam folder.
          </p>
          <button className="btn-primary" onClick={handleClose}>
            Back to Sign In
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Enter your registered email address. We will verify your account against the ChaanBean Trust Vault and email you a cryptographic password reset token.
          </p>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Registered Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. arjun.sharma@example.com"
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            <KeyRound size={16} />
            <span>Send Secure Reset Link</span>
          </button>
        </form>
      )}
    </Modal>
  );
};
