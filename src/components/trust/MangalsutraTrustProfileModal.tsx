// Page 6 Blueprint: Standalone MANGALSUTRA TRUST PROFILE Modal
// Enables any prospective match's or user's separate Trust Profile to be opened in 1 click.

import React from 'react';
import { UserProfile } from '../../types';
import { Modal } from '../common/Modal';
import { MangalsutraTrustProfile } from './MangalsutraTrustProfile';

interface MangalsutraTrustProfileModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenVault?: () => void;
  onOpenCourtScreening?: () => void;
  onOpenMaritalAudit?: () => void;
}

export const MangalsutraTrustProfileModal: React.FC<MangalsutraTrustProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onOpenVault,
  onOpenCourtScreening,
  onOpenMaritalAudit,
}) => {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="880px">
      <div style={{ margin: '-0.5rem -0.5rem 0' }}>
        <MangalsutraTrustProfile
          user={user}
          isCompact={false}
          showActions={true}
          onOpenVault={onOpenVault}
          onOpenCourtScreening={onOpenCourtScreening}
          onOpenMaritalAudit={onOpenMaritalAudit}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem', paddingRight: '0.5rem' }}>
          <button className="btn-primary" onClick={onClose} style={{ padding: '0.5rem 1.25rem' }}>
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
