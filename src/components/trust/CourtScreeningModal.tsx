// Module F & Phase 2: Public Court Record Screening Modal
// Implements eCourts search with strict safe wording, coverage caveats, and identifier logging.

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChaanBeanService } from '../../services/chaanbeanVault';
import { CourtScreeningResult } from '../../types';
import { Modal } from '../common/Modal';
import { 
  Scale, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';

interface CourtScreeningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CourtScreeningModal: React.FC<CourtScreeningModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateCurrentUser, showToast } = useApp();

  const [partyName, setPartyName] = useState(currentUser.name);
  const [cnrNumber, setCnrNumber] = useState('');
  const [state, setState] = useState('Delhi');
  const [district, setDistrict] = useState('New Delhi');
  const [year, setYear] = useState('2026');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<CourtScreeningResult | null>(
    currentUser.trustProfile.courtScreening || null
  );

  const handleExecuteScreening = () => {
    setIsSearching(true);

    setTimeout(() => {
      const result = ChaanBeanService.performCourtScreening(
        partyName,
        state,
        district,
        year,
        cnrNumber.trim() || undefined
      );

      setSearchResult(result);

      // Audit log entry
      const audit = ChaanBeanService.createAuditEntry(
        'status_changed',
        'Public Court Record Screening',
        `Public litigation index queried. Result: ${result.resultSummary}`,
        'pending',
        'verified'
      );

      // Update in user profile
      const updatedChecks = currentUser.trustProfile.checks.map((c) => {
        if (c.id === 'chk_crt_1') {
          return {
            ...c,
            status: 'verified' as const,
            verifiedAt: result.searchDate,
            sourceNote: result.resultSummary,
          };
        }
        return c;
      });

      updateCurrentUser({
        ...currentUser,
        trustProfile: {
          ...currentUser.trustProfile,
          courtScreening: result,
          checks: updatedChecks,
          auditLogs: [audit, ...currentUser.trustProfile.auditLogs],
        },
      });

      setIsSearching(false);
      showToast('Court Index Query Completed', 'Screening outcome saved with lawful caveat notes.', 'success');
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Public Court Record Screening (eCourts Integration)" maxWidth="720px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Ethical Notice & Safe Wording Caveat */}
        <div style={{ background: '#FFFBEB', border: '1.5px solid #FCD34D', padding: '1.25rem', borderRadius: 'var(--radius-md)', color: '#92400E' }}>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertTriangle size={18} color="#D97706" />
            <span>Ethical Legal Screening & Uncertainty Caveat</span>
          </div>
          <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: '#78350F' }}>
            <strong>CRITICAL LEGAL LIMITATION</strong>: A finding of <em>“No matching public court record identified”</em> is <strong>never</strong> authoritative proof that no dispute or litigation exists. 
            Name-only queries can generate false collisions with persons sharing the same name. Where available, a 16-digit CNR number provides exact case verification. ChaanBean does not issue verdicts on legal guilt, personal safety, or moral character.
          </p>
        </div>

        {/* Screening Search Parameters */}
        <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 160, 89, 0.3)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '1rem' }}>
            Screening Identifiers
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name of Individual</label>
              <input
                className="form-input"
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">CNR Number (Case Record Number)</label>
              <input
                className="form-input"
                value={cnrNumber}
                onChange={(e) => setCnrNumber(e.target.value)}
                placeholder="e.g. DLND010049212024"
              />
              <span className="form-hint">16-character unique court identifier</span>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">State Jurisdiction</label>
              <select className="form-select" value={state} onChange={(e) => setState(e.target.value)}>
                <option value="Delhi">Delhi</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="West Bengal">West Bengal</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">District Court</label>
              <input
                className="form-input"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. New Delhi / Bangalore Urban"
              />
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
            <button
              className="btn-primary"
              disabled={isSearching || !partyName.trim()}
              onClick={handleExecuteScreening}
            >
              <Search size={16} />
              <span>{isSearching ? 'Querying Public eCourts Index...' : 'Conduct Public Index Search'}</span>
            </button>
          </div>
        </div>

        {/* Search Results Display */}
        {searchResult && (
          <div style={{ background: '#FFFFFF', border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-burgundy-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="#15803D" />
                <span>eCourts Query Result Summary</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Audited on: {searchResult.searchDate}
              </span>
            </div>

            <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
              <strong>Status</strong>: {searchResult.resultSummary}
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, borderLeft: '4px solid var(--color-gold)' }}>
              <strong>Provenance Note</strong>: {searchResult.caveatNote}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <div><strong>Queried Name:</strong> {searchResult.queryName}</div>
              <div><strong>CNR Searched:</strong> {searchResult.cnrNumber}</div>
              <div><strong>Jurisdiction:</strong> {searchResult.district}, {searchResult.state}</div>
              <div><strong>Active Records:</strong> {searchResult.matchingRecordsCount}</div>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'right' }}>
          <button className="btn-outline" onClick={onClose}>
            Close Window
          </button>
        </div>
      </div>
    </Modal>
  );
};
