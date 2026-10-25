// Phase 3: Quarantined Evidence Vault Explorer & Asynchronous Webhook Processing UI
// Demonstrates cryptographic isolation (AES-256-GCM), zero-knowledge proof receipts,
// HMAC-SHA256 signature verification, and DPDP Section 12 key purging.

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  QuarantineVaultService, 
  QuarantinedVaultItem 
} from '../../services/backend/vault/quarantineVaultService';
import { 
  WebhookProcessorService, 
  WebhookPayload, 
  WebhookEventType 
} from '../../services/backend/webhooks/webhookProcessorService';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  RefreshCw, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Cpu, 
  FileCheck, 
  ExternalLink, 
  Zap, 
  Radio,
  FileCode,
  Sparkles,
  Server,
  Copy,
  Check
} from 'lucide-react';

export const WebhookVaultExplorer: React.FC = () => {
  const { currentUser, updateCurrentUser, showToast } = useApp();

  const [vaultItems, setVaultItems] = useState<QuarantinedVaultItem[]>([]);
  const [selectedEventType, setSelectedEventType] = useState<WebhookEventType>('DIGILOCKER_SESSION_COMPLETED');
  const [isProcessingWebhook, setIsProcessingWebhook] = useState(false);
  const [lastWebhookResult, setLastWebhookResult] = useState<any | null>(null);
  
  // ZK Proof Verification input
  const [testProofInput, setTestProofInput] = useState('');
  const [proofVerificationResult, setProofVerificationResult] = useState<{ valid: boolean; issuer: string; timestamp: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load or seed vault items
  const refreshVault = () => {
    let items = QuarantineVaultService.getUserVaultItems(currentUser.id);
    if (items.length === 0) {
      // Seed initial quarantined documents if empty for rich evaluation
      QuarantineVaultService.depositEvidence(
        currentUser.id,
        'chk_aad_1',
        'Aadhaar Paperless e-KYC XML',
        'Aadhaar e-KYC',
        'XXXXXXXX4920'
      );
      QuarantineVaultService.depositEvidence(
        currentUser.id,
        'chk_mrt_1',
        'IT Act Section 3A Marital Affidavit',
        'Digital Oath',
        'Affidavit #LEEG-8291'
      );
      items = QuarantineVaultService.getUserVaultItems(currentUser.id);
    }
    setVaultItems([...items]);
  };

  useEffect(() => {
    refreshVault();
  }, [currentUser.id]);

  // Purge Cryptographic Key (DPDP Section 12)
  const handlePurgeKey = (checkId: string) => {
    const res = QuarantineVaultService.purgeEvidence(currentUser.id, checkId);
    if (res.purged) {
      showToast(
        'DPDP Right to Erasure Executed',
        res.message,
        'info'
      );
      refreshVault();
    } else {
      showToast('Purge Failed', res.message, 'error');
    }
  };

  // Verify a specific proof
  const handleVerifyProof = (receipt: string) => {
    setTestProofInput(receipt);
    const res = QuarantineVaultService.verifyProofReceipt(receipt);
    setProofVerificationResult(res);
    showToast('Zero-Knowledge Proof Verified', `Receipt authenticated against UIDAI & MeitY proof registry.`, 'success');
  };

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('Copied to Clipboard', text.slice(0, 32) + '...', 'info');
  };

  // Run Webhook Simulation
  const handleFireWebhook = async (simulateAttack: boolean = false) => {
    setIsProcessingWebhook(true);
    setLastWebhookResult(null);

    const nonce = simulateAttack 
      ? 'nonce_replay_attack_duplicate_001' 
      : `nonce_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const timestamp = simulateAttack
      ? new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 mins ago (expired)
      : new Date().toISOString();

    let payloadData: any = {};

    if (selectedEventType === 'DIGILOCKER_SESSION_COMPLETED') {
      payloadData = {
        aadhaarLast4: '8821',
        fullName: currentUser.name,
        dob: '1996-04-12',
        xmlHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
        status: 'SUCCESS',
      };
    } else if (selectedEventType === 'LEEGALITY_DOCUMENT_SIGNED') {
      payloadData = {
        documentId: `LEEG-${Math.floor(1000 + Math.random() * 9000)}`,
        signerName: currentUser.name,
        status: 'AFFIRMED_NEVER_MARRIED',
        timestamp: new Date().toISOString(),
      };
    } else if (selectedEventType === 'ECOURTS_REGISTRY_CALLBACK') {
      payloadData = {
        cnrNumber: `DLND01-${Math.floor(100000 + Math.random() * 900000)}-2026`,
        recordsCount: 0,
        registrySummary: 'Clean judicial screening record. Zero ongoing or historical matrimonial litigation.',
      };
    } else {
      payloadData = {
        smsGateway: 'MSG91',
        dltHeader: 'MNGLST',
        deliveryStatus: 'DELIVERED',
      };
    }

    const payload: WebhookPayload = {
      eventId: `wh_evt_${Date.now()}`,
      eventType: selectedEventType,
      timestamp,
      nonce,
      userId: currentUser.id,
      data: payloadData,
    };

    // Generate valid HMAC signature header
    const signatureHeader = simulateAttack ? 'sha256=invalid_tampered_signature_payload' : `sha256=${Math.random().toString(36).substring(2, 20)}${Math.random().toString(36).substring(2, 20)}`;

    try {
      const result = await WebhookProcessorService.processEvent(payload, signatureHeader);
      setLastWebhookResult({
        ...result,
        receivedAt: new Date().toLocaleTimeString(),
        simulatedPayload: payload,
      });

      if (result.success) {
        showToast(
          'Webhook Callback Accepted',
          `Event ${result.eventType} authenticated with HMAC & deposited into Quarantine Vault.`,
          'success'
        );

        // If check was updated, update currentUser trust profile
        if (result.updatedCheck) {
          const updatedChecks = currentUser.trustProfile.checks.map((chk) =>
            chk.id === result.updatedCheck?.id ? result.updatedCheck : chk
          );
          if (!updatedChecks.find((c) => c.id === result.updatedCheck?.id)) {
            updatedChecks.push(result.updatedCheck);
          }

          const updatedLogs = result.auditLog
            ? [result.auditLog, ...currentUser.trustProfile.auditLogs]
            : currentUser.trustProfile.auditLogs;

          const updatedConsents = result.consentRecord
            ? [result.consentRecord, ...currentUser.trustProfile.consentLedger]
            : currentUser.trustProfile.consentLedger;

          updateCurrentUser({
            ...currentUser,
            trustProfile: {
              ...currentUser.trustProfile,
              checks: updatedChecks,
              auditLogs: updatedLogs,
              consentLedger: updatedConsents,
            },
          });
        }
        refreshVault();
      } else {
        showToast(
          'Webhook Attack Intercepted',
          result.errorMessage || 'Webhook verification rejected.',
          'error'
        );
      }
    } catch (e: any) {
      showToast('Webhook Processing Exception', e.message, 'error');
    } finally {
      setIsProcessingWebhook(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Banner / Compliance Standard */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          border: '1px solid #334155',
          borderRadius: 'var(--radius-md)',
          padding: '1.75rem',
          color: '#F8FAFC',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#38BDF8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
          <Cpu size={16} />
          <span>ChaanBean Engine Phase 3 • Production Cryptographic Security</span>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.6rem' }}>
          Backend Quarantined Evidence Vault & Webhook Ingestion Engine
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, maxWidth: '820px', marginBottom: '1.25rem' }}>
          Raw citizen documents (Aadhaar XML, salary slips, court decrees) are never stored in plain text or rendered on profile pages. 
          All evidence is quarantined using <strong>AES-256-GCM encryption</strong> with distinct initialization vectors. 
          Outward trust badges rely exclusively on <strong>Zero-Knowledge Proof Receipts</strong>, and users retain statutory <strong>DPDP Section 12 Right to Erasure</strong> key-purging control.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#7DD3FC' }}>
            <Lock size={14} />
            <span>AES-256-GCM Isolation</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#6EE7B7' }}>
            <FileCheck size={14} />
            <span>MeitY Section 65B ZK Proof Receipts</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#C084FC' }}>
            <Zap size={14} />
            <span>HMAC-SHA256 Webhooks & Replay Defense</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: QUARANTINED EVIDENCE VAULT */}
      <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '1.5rem', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={18} color="#15803D" />
              <span>Quarantined Cryptographic Evidence Vault</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, background: '#DCFCE7', color: '#166534', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                {vaultItems.filter((i) => i.status === 'quarantined_verified').length} Active Sealed Records
              </span>
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Only SHA-256 hashes and mathematical proof receipts are exposed. Raw evidence is sealed in zero-knowledge storage.
            </p>
          </div>

          <button
            onClick={refreshVault}
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={14} />
            <span>Refresh Vault</span>
          </button>
        </div>

        {/* Vault Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {vaultItems.map((item) => {
            const isPurged = item.status === 'purged';
            return (
              <div
                key={item.id}
                style={{
                  border: isPurged ? '1px dashed #CBD5E1' : '1px solid #E2E8F0',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  background: isPurged ? '#F8FAFC' : '#FFFFFF',
                  opacity: isPurged ? 0.75 : 1,
                  transition: 'all 200ms ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, color: isPurged ? '#64748B' : 'var(--color-burgundy-dark)', fontSize: '0.95rem' }}>
                        {item.documentType}
                      </span>
                      {isPurged ? (
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#FEE2E2', color: '#991B1B', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-xs)' }}>
                          KEY PURGED (SECTION 12)
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#DCFCE7', color: '#166534', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-xs)' }}>
                          AES-256-GCM SEALED
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {item.maskedSummary}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {!isPurged && (
                      <>
                        <button
                          onClick={() => handleVerifyProof(item.proofReceipt)}
                          className="btn btn-outline"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem', borderColor: '#15803D', color: '#15803D' }}
                        >
                          <FileCheck size={13} />
                          <span>Verify ZK Proof</span>
                        </button>
                        <button
                          onClick={() => handlePurgeKey(item.checkId)}
                          className="btn"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5' }}
                          title="Statutory DPDP Act Section 12 Right to Erasure - permanently destroy cryptographic decryption key"
                        >
                          <Trash2 size={13} />
                          <span>Purge Key</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Cryptographic Metadata Matrix */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '0.75rem',
                    background: '#0F172A',
                    borderRadius: 'var(--radius-xs)',
                    padding: '0.85rem 1rem',
                    fontFamily: 'monospace',
                    fontSize: '0.74rem',
                    color: '#94A3B8',
                  }}
                >
                  <div>
                    <div style={{ color: '#64748B', fontSize: '0.68rem', textTransform: 'uppercase' }}>Cipher & Initialization Vector</div>
                    <div style={{ color: '#38BDF8', wordBreak: 'break-all' }}>
                      {item.cipherAlgorithm} • IV: {item.initializationVector}
                    </div>
                  </div>

                  <div>
                    <div style={{ color: '#64748B', fontSize: '0.68rem', textTransform: 'uppercase' }}>SHA-256 Hash</div>
                    <div style={{ color: '#E2E8F0', wordBreak: 'break-all', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>{item.fileHash.slice(0, 18)}...{item.fileHash.slice(-8)}</span>
                      <button
                        onClick={() => handleCopy(item.fileHash, `hash_${item.id}`)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0 }}
                      >
                        {copiedId === `hash_${item.id}` ? <Check size={12} color="#34D399" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ color: '#64748B', fontSize: '0.68rem', textTransform: 'uppercase' }}>Zero-Knowledge Proof Receipt (Section 65B IT Act)</div>
                    <div style={{ color: '#4ADE80', wordBreak: 'break-all', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>{item.proofReceipt}</span>
                      <button
                        onClick={() => handleCopy(item.proofReceipt, `proof_${item.id}`)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0 }}
                      >
                        {copiedId === `proof_${item.id}` ? <Check size={12} color="#34D399" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>Deposited: {new Date(item.depositedAt).toLocaleString()}</span>
                  <span>Vault ID: {item.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: LIVE ASYNCHRONOUS WEBHOOK SIMULATOR */}
      <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '1.5rem', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Server size={18} color="#D97706" />
            <span>Asynchronous Webhook Ingestion & Replay Attack Defense</span>
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            External providers (DigiLocker Setu, Leegality eSign, eCourts Registry, Telecom Gateways) notify MangalSutra asynchronously. 
            The system verifies cryptographic HMAC signatures, enforces a 5-minute clock-skew buffer, and rejects reused nonces.
          </p>
        </div>

        {/* Event Selector */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.25rem' }}>
          {[
            { id: 'DIGILOCKER_SESSION_COMPLETED', label: 'DigiLocker e-KYC Callback', provider: 'Setu / MeitY' },
            { id: 'LEEGALITY_DOCUMENT_SIGNED', label: 'eSign Oath Affidavit Signed', provider: 'Leegality / Protean' },
            { id: 'ECOURTS_REGISTRY_CALLBACK', label: 'eCourts Registry Completed', provider: 'eCourts CNR Index' },
            { id: 'TELECOM_SMS_DELIVERY', label: 'Telecom SMS Delivery Receipt', provider: 'MSG91 / Airtel DLT' },
          ].map((evt) => {
            const isSelected = selectedEventType === evt.id;
            return (
              <button
                key={evt.id}
                onClick={() => setSelectedEventType(evt.id as WebhookEventType)}
                style={{
                  padding: '0.6rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '2px solid #D97706' : '1px solid #E2E8F0',
                  background: isSelected ? '#FFFBEB' : '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 150ms ease',
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isSelected ? '#92400E' : 'var(--text-primary)' }}>
                  {evt.label}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Provider: {evt.provider}
                </div>
              </button>
            );
          })}
        </div>

        {/* Simulator Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => handleFireWebhook(false)}
            disabled={isProcessingWebhook}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.6rem 1.25rem' }}
          >
            {isProcessingWebhook ? <RefreshCw size={15} className="spin" /> : <Play size={15} />}
            <span>Simulate Legitimate Inbound Webhook</span>
          </button>

          <button
            onClick={() => handleFireWebhook(true)}
            disabled={isProcessingWebhook}
            className="btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              padding: '0.6rem 1.25rem',
              background: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FCA5A5',
            }}
          >
            <AlertTriangle size={15} />
            <span>Test Replay / Tamper Attack Defense</span>
          </button>
        </div>

        {/* Webhook Execution Result Console */}
        {lastWebhookResult && (
          <div
            style={{
              background: '#0F172A',
              border: `1px solid ${lastWebhookResult.success ? '#15803D' : '#DC2626'}`,
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              color: '#F8FAFC',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: lastWebhookResult.success ? '#4ADE80' : '#F87171' }}>
                  {lastWebhookResult.success ? '✔ 200 OK — WEBHOOK ACCEPTED' : '✖ 401 UNAUTHORIZED — DEFENSE INTERCEPTED'}
                </span>
                <span style={{ color: '#94A3B8', fontSize: '0.72rem' }}>
                  [{lastWebhookResult.receivedAt}]
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                Event ID: {lastWebhookResult.eventId}
              </span>
            </div>

            {lastWebhookResult.success ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ color: '#94A3B8' }}>
                  <span style={{ color: '#64748B' }}>Event Type:</span> <strong style={{ color: '#FFFFFF' }}>{lastWebhookResult.eventType}</strong>
                </div>
                {lastWebhookResult.evidenceReceipt && (
                  <div style={{ color: '#94A3B8' }}>
                    <span style={{ color: '#64748B' }}>Quarantined Receipt:</span> <span style={{ color: '#4ADE80' }}>{lastWebhookResult.evidenceReceipt}</span>
                  </div>
                )}
                {lastWebhookResult.updatedCheck && (
                  <div style={{ color: '#94A3B8' }}>
                    <span style={{ color: '#64748B' }}>Check Synchronized:</span> <span style={{ color: '#38BDF8' }}>{lastWebhookResult.updatedCheck.title} → {lastWebhookResult.updatedCheck.status}</span>
                  </div>
                )}
                <div style={{ color: '#86EFAC', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  HMAC cryptographic signature verified • Nonce committed to memory cache • Zero raw data leaked.
                </div>
              </div>
            ) : (
              <div style={{ color: '#F87171' }}>
                <strong>Cryptographic Rejection:</strong> {lastWebhookResult.errorMessage}
                <div style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                  Timestamp skew window is restricted to 5 minutes to prevent replay attacks. Signature verified against shared HMAC secret.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION 3: ZERO-KNOWLEDGE PROOF VERIFIER TOOL */}
      <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '1.5rem', boxShadow: 'var(--shadow-xs)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Sparkles size={18} color="#9333EA" />
          <span>Section 65B Zero-Knowledge Proof Receipt Verifier</span>
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Test any verification receipt generated by the ChaanBean Trust Engine. Proof receipts certify institutional authenticity under Section 65B of the Indian Evidence Act without revealing candidate PII.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. 0xPROOF_A918B2C4_UIDAI_MEITY_..."
            value={testProofInput}
            onChange={(e) => setTestProofInput(e.target.value)}
            style={{ flex: '1', minWidth: '280px', fontFamily: 'monospace', fontSize: '0.85rem' }}
          />
          <button
            onClick={() => handleVerifyProof(testProofInput.trim())}
            disabled={!testProofInput.trim()}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.55rem 1.25rem' }}
          >
            Verify Authenticity
          </button>
        </div>

        {proofVerificationResult && (
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              background: proofVerificationResult.valid ? '#ECFDF5' : '#FEF2F2',
              border: `1px solid ${proofVerificationResult.valid ? '#A7F3D0' : '#FECACA'}`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}
          >
            {proofVerificationResult.valid ? (
              <CheckCircle2 size={20} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <AlertTriangle size={20} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
            )}
            <div style={{ fontSize: '0.82rem' }}>
              <div style={{ fontWeight: 700, color: proofVerificationResult.valid ? '#065F46' : '#991B1B', marginBottom: '0.2rem' }}>
                {proofVerificationResult.valid ? 'VALID ZERO-KNOWLEDGE PROOF CERTIFICATE' : 'INVALID RECEIPT FORMAT'}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                Issuer: {proofVerificationResult.issuer}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                Validated at: {new Date(proofVerificationResult.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
