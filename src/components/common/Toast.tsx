// Toast Container Component

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((t) => {
        const Icon =
          t.type === 'success'
            ? CheckCircle2
            : t.type === 'warning'
            ? AlertTriangle
            : t.type === 'error'
            ? AlertCircle
            : Info;

        const iconColor =
          t.type === 'success'
            ? 'var(--status-verified-text)'
            : t.type === 'warning'
            ? 'var(--status-pending-text)'
            : t.type === 'error'
            ? 'var(--color-danger)'
            : 'var(--color-gold-dark)';

        return (
          <div key={t.id} className={`toast-item ${t.type || 'info'}`} role="alert">
            <Icon size={20} color={iconColor} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{t.title}</div>
              {t.desc && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{t.desc}</div>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              style={{ color: 'var(--text-muted)', padding: '2px' }}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
