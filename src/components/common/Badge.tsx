// Status Badge Component: Explicit text labels accompanying status indicators

import React from 'react';
import { VerificationState } from '../../types';
import { CheckCircle2, Clock, AlertCircle, FileText, HelpCircle } from 'lucide-react';

interface BadgeProps {
  status: VerificationState;
  showIcon?: boolean;
  size?: 'sm' | 'md';
  customLabel?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, showIcon = true, size = 'sm', customLabel }) => {
  let badgeClass = 'badge-status';
  let label = customLabel;
  let Icon = HelpCircle;

  switch (status) {
    case 'verified':
      badgeClass += ' badge-verified';
      label = label || 'Verified by ChaanBean';
      Icon = CheckCircle2;
      break;
    case 'pending':
      badgeClass += ' badge-pending';
      label = label || 'Pending Review';
      Icon = Clock;
      break;
    case 'user_supplied':
      badgeClass += ' badge-user-supplied';
      label = label || 'User Supplied (Unverified)';
      Icon = FileText;
      break;
    case 'further_review_required':
      badgeClass += ' badge-pending';
      label = label || 'Review Required';
      Icon = AlertCircle;
      break;
    case 'unavailable':
    default:
      badgeClass += ' badge-unavailable';
      label = label || 'Verification Unavailable';
      Icon = HelpCircle;
      break;
  }

  return (
    <span
      className={badgeClass}
      style={{
        fontSize: size === 'sm' ? '0.72rem' : '0.85rem',
        padding: size === 'sm' ? '0.2rem 0.55rem' : '0.35rem 0.75rem',
      }}
      role="status"
      aria-label={`Verification Status: ${label}`}
    >
      {showIcon && <Icon size={size === 'sm' ? 12 : 14} aria-hidden="true" />}
      <span>{label}</span>
    </span>
  );
};
