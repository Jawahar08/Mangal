// Phase 2: Production Gateway Architecture & DPDP Act 2023 Compliance Panel
// Interactive controls for live/sandbox gateway switching, gateway ping diagnostics, DLT templates, and DPDP audits

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GatewayConfigService, GatewayConnectorInfo, GatewayMode } from '../../services/backend/config/gatewayConfig';
import { 
  ShieldCheck, 
  Settings, 
  Radio, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  ExternalLink, 
  FileText, 
  HelpCircle, 
  Scale, 
  Sparkles, 
  Building2, 
  Smartphone, 
  Mail, 
  Lock,
  RefreshCw,
  Send
} from 'lucide-react';

export const GatewayCompliancePanel: React.FC = () => {
  const { currentUser, showToast } = useApp();

  const [gatewayMode, setGatewayMode] = useState<GatewayMode>(() => GatewayConfigService.getGatewayMode());
  const [connectors, setConnectors] = useState<GatewayConnectorInfo[]>(() => GatewayConfigService.getAllConnectors());
  const [pingResults, setPingResults] = useState<Record<string, { latencyMs: number; message: string; running: boolean }>>({});

  // Grievance form modal/state
  const [showGrievanceForm, setShowGrievanceForm] = useState(false);
  const [grievanceCategory, setGrievanceCategory] = useState('Data Correction & Rectification (Section 12)');
  const [grievanceDescription, setGrievanceDescription] = useState('');
  const [isSubmittingGrievance, setIsSubmittingGrievance] = useState(false);
  const [activeTicketNotice, setActiveTicketNotice] = useState<string | null>(null);

  const dltTemplates = GatewayConfigService.getDLTTemplates();
  const dpdpProfile = GatewayConfigService.getDPDPComplianceProfile();

  // Mode Switcher
  const handleModeChange = (mode: GatewayMode) => {
    GatewayConfigService.setGatewayMode(mode);
    setGatewayMode(mode);
    setConnectors(GatewayConfigService.getAllConnectors());
    showToast(
      'Gateway Execution Mode Changed',
      `Switched to ${mode === 'production' ? 'Live Production Gateways' : 'Sandbox Simulation Mode'}.`,
      'info'
    );
  };

  // Ping test
  const handlePingConnector = async (connectorId: string) => {
    setPingResults((prev) => ({
      ...prev,
      [connectorId]: { latencyMs: 0, message: 'Initiating handshake...', running: true },
    }));

    const res = await GatewayConfigService.pingConnector(connectorId);

    setPingResults((prev) => ({
      ...prev,
      [connectorId]: { latencyMs: res.latencyMs, message: res.message, running: false },
    }));

    showToast('Gateway Ping Complete', `${res.message} (${res.latencyMs}ms)`, 'success');
  };

  // Export DPDP JSON Ledger
  const handleExportDPDPDossier = () => {
    const jsonStr = GatewayConfigService.exportDataPrincipalPackage(currentUser);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mangalsutra_dpdp_export_${currentUser.id}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('DPDP Dossier Exported', 'Downloaded complete cryptographic Personal Data & Consent Ledger.', 'success');
  };

  // Submit Grievance
  const handleSubmitGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceDescription.trim()) return;

    setIsSubmittingGrievance(true);
    const res = await GatewayConfigService.submitGrievanceTicket({
      userId: currentUser.id,
      userName: currentUser.name,
      category: grievanceCategory,
      description: grievanceDescription,
    });

    setIsSubmittingGrievance(false);
    setActiveTicketNotice(res.acknowledgementNotice);
    setGrievanceDescription('');
    showToast('Grievance Registered', `Ticket #${res.ticketId} created. Statutory 48-hr SLA active.`, 'success');
  };

  return (
    <div style={{ animation: 'fadeIn 250ms ease-out' }}>
      
      {/* Mode Selector Card */}
      <div
        className="card-heritage"
        style={{
          padding: '1.75rem',
          marginBottom: '2rem',
          background: 'linear-gradient(to right, var(--bg-surface), #FAF5F0)',
          borderLeft: '4px solid var(--color-burgundy)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold-dark)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <Radio size={15} />
              <span>Gateway Orchestration Engine (Phase 2)</span>
            </div>
            <h2 className="heading-card" style={{ fontSize: '1.4rem', color: 'var(--color-burgundy-dark)', marginTop: '0.2rem' }}>
              Production Gateways & Regulatory Infrastructure
            </h2>
          </div>

          {/* Toggle Switch */}
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(197, 160, 89, 0.3)' }}>
            <button
              type="button"
              onClick={() => handleModeChange('sandbox')}
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 700,
                background: gatewayMode === 'sandbox' ? '#15803D' : 'transparent',
                color: gatewayMode === 'sandbox' ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              🟡 Sandbox Simulation
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('production')}
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 700,
                background: gatewayMode === 'production' ? 'var(--color-burgundy)' : 'transparent',
                color: gatewayMode === 'production' ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              🟢 Live Production Gateways
            </button>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {gatewayMode === 'sandbox' ? (
            <span>
              <strong>Sandbox Simulation Active:</strong> Verification requests use authentic government API mock challenges (e.g. DigiLocker OTP <code>482910</code>, DLT test OTPs). Ideal for end-to-end user testing without incurring vendor charges.
            </span>
          ) : (
            <span>
              <strong>Live Production Active:</strong> Verification queries connect to live MeitY DigiLocker endpoints, TRAI DLT telecom headers, and CCA-approved Aadhaar eSign infrastructure via configured environment secrets.
            </span>
          )}
        </p>
      </div>

      {/* Gateway Connectors Status Grid */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 className="heading-card" style={{ fontSize: '1.2rem', color: 'var(--color-burgundy-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings size={18} color="var(--color-gold-dark)" />
          <span>Active Gateway Connectors & Diagnostic Health</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {connectors.map((c) => {
            const ping = pingResults[c.id];
            return (
              <div
                key={c.id}
                className="card-heritage"
                style={{ padding: '1.25rem', border: '1px solid rgba(197, 160, 89, 0.25)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--color-burgundy-dark)' }}>
                        {c.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          background: c.status === 'operational' ? '#DCFCE7' : c.status === 'sandbox_active' ? '#FEF3C7' : '#FEE2E2',
                          color: c.status === 'operational' ? '#166534' : c.status === 'sandbox_active' ? '#92400E' : '#991B1B',
                        }}
                      >
                        {c.status === 'operational' ? '● Operational' : c.status === 'sandbox_active' ? '● Sandbox Active' : '○ Awaiting Keys'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Authority: <strong>{c.authority}</strong> • Protocol: <code>{c.protocol}</code>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePingConnector(c.id)}
                    disabled={ping?.running}
                    className="btn-outline"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <RefreshCw size={13} className={ping?.running ? 'spin' : ''} />
                    <span>{ping?.running ? 'Testing...' : 'Ping Gateway'}</span>
                  </button>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {c.notes}
                </div>

                {ping && (
                  <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>✓ {ping.message}</span>
                    <span style={{ fontWeight: 700 }}>⏱️ {ping.latencyMs} ms</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* TRAI DLT Approved SMS Templates */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 className="heading-card" style={{ fontSize: '1.2rem', color: 'var(--color-burgundy-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Smartphone size={18} color="var(--color-gold-dark)" />
          <span>TRAI DLT Approved Telecom Registration & Templates</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {dltTemplates.map((t) => (
            <div key={t.templateId} className="card-heritage" style={{ padding: '1.25rem', borderLeft: '3px solid #15803D' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-burgundy-dark)' }}>{t.templateName}</span>
                <span style={{ background: '#E0E7FF', color: '#3730A3', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                  Header: {t.header}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                Template ID: <code>{t.templateId}</code> • Category: {t.type}
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>
                "{t.sampleText}"
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DPDP Act 2023 Compliance & Data Principal Rights */}
      <div
        className="card-heritage"
        style={{
          padding: '2rem',
          background: '#FAFAF9',
          border: '1px solid #E7E5E4',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#15803D', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <ShieldCheck size={16} />
              <span>Statutory Compliance Architecture</span>
            </div>
            <h3 className="heading-card" style={{ fontSize: '1.35rem', color: 'var(--color-burgundy-dark)', marginTop: '0.2rem' }}>
              Digital Personal Data Protection Act, 2023 (DPDP Act)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '640px', marginTop: '0.4rem', lineHeight: 1.6 }}>
              MangalSutra complies fully with DPDP Act 2023 provisions. As a Data Principal, you maintain total ownership over your data, revocable consent, and statutory right to grievance redressal.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportDPDPDossier}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Download size={15} />
            <span>Download DPDP Compliance Dossier</span>
          </button>
        </div>

        {/* Data Protection Officer Card */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E7E5E4' }}>
          <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #E5E7EB' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1E3A8A', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Building2 size={15} />
              <span>Designated Data Protection Officer (DPO)</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-burgundy-dark)' }}>
              {dpdpProfile.dataProtectionOfficer.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {dpdpProfile.dataProtectionOfficer.designation}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#2563EB', marginTop: '0.4rem' }}>
              ✉️ {dpdpProfile.dataProtectionOfficer.email}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Statutory Response SLA: <strong>Within {dpdpProfile.dataProtectionOfficer.statutorySlaHours} hours</strong>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #E5E7EB' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#15803D', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Scale size={15} />
              <span>Recognized Data Principal Rights</span>
            </div>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {dpdpProfile.rightsSupported.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setShowGrievanceForm(!showGrievanceForm)}
              style={{ marginTop: '0.75rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-burgundy)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              {showGrievanceForm ? '▲ Close Grievance Form' : '▼ Lodge Statutory DPDP Grievance'}
            </button>
          </div>
        </div>

        {/* Grievance Submission Form */}
        {showGrievanceForm && (
          <form onSubmit={handleSubmitGrievance} style={{ marginTop: '1.5rem', background: '#FFFFFF', border: '1px solid var(--border-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)', animation: 'fadeIn 200ms ease-out' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.5rem' }}>
              Lodge a Statutory Grievance under Section 13 (DPDP Act)
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Directly routed to the designated Data Protection Officer. Statutory written response within 48 hours.
            </p>

            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Grievance Nature / Right Invocation</label>
              <select
                className="form-select"
                value={grievanceCategory}
                onChange={(e) => setGrievanceCategory(e.target.value)}
                style={{ fontSize: '0.82rem', padding: '0.45rem 0.75rem' }}
              >
                <option value="Data Correction & Rectification (Section 12)">Data Correction & Rectification (Section 12)</option>
                <option value="Data Erasure / Right to be Forgotten (Section 12)">Data Erasure / Right to be Forgotten (Section 12)</option>
                <option value="Right to Nominate Representative (Section 14)">Right to Nominate Representative (Section 14)</option>
                <option value="Dispute over Verification Badge Accuracy">Dispute over Verification Badge Accuracy</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Details of Your Request</label>
              <textarea
                className="form-input"
                rows={3}
                value={grievanceDescription}
                onChange={(e) => setGrievanceDescription(e.target.value)}
                placeholder="Describe your data correction or grievance request..."
                style={{ fontSize: '0.82rem' }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingGrievance || !grievanceDescription.trim()}
              className="btn-primary"
              style={{ padding: '0.45rem 1.1rem', fontSize: '0.82rem' }}
            >
              <Send size={14} />
              <span>{isSubmittingGrievance ? 'Transmitting Ticket...' : 'Submit Grievance to DPO'}</span>
            </button>

            {activeTicketNotice && (
              <div style={{ marginTop: '1rem', background: '#DCFCE7', border: '1px solid #86EFAC', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: '#166534', lineHeight: 1.5 }}>
                {activeTicketNotice}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
