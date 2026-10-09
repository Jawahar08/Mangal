// Module D & Phase 1: Private Messaging & Guided Conversation Prompts

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage, UserProfile } from '../../types';
import { StorageService } from '../../services/storageService';
import { TALK_BEFORE_YOU_MARRY_PROMPTS } from '../../data/questions';
import { 
  Send, 
  Sparkles, 
  ShieldAlert, 
  UserX, 
  CheckCheck, 
  Lock, 
  MessageCircle, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';
import { StatusBadge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const ChatView: React.FC = () => {
  const { 
    currentUser, 
    discoveryProfiles, 
    mutualConnections, 
    activeChatPartnerId, 
    setActiveChatPartnerId, 
    showToast 
  } = useApp();

  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('inappropriate_behavior');
  const [reportDetails, setReportDetails] = useState('');
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter mutual partners available for chat
  const chatPartners = discoveryProfiles.filter((p) => mutualConnections.includes(p.id));

  // Active partner
  const activePartner: UserProfile | undefined = chatPartners.find((p) => p.id === activeChatPartnerId) || chatPartners[0];

  useEffect(() => {
    if (activePartner) {
      const msgs = StorageService.getChatMessages(activePartner.id);
      setMessages(msgs);
    }
  }, [activePartner]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (textToSend?: string, isPrompt: boolean = false) => {
    const content = textToSend || messageText;
    if (!content.trim() || !activePartner) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: activePartner.id,
      content,
      timestamp: 'Just now',
      isPromptStarter: isPrompt,
    };

    const updated = StorageService.saveChatMessage(activePartner.id, newMsg);
    setMessages(updated);
    setMessageText('');

    // Simulated responsive reply if it is a prompt
    if (isPrompt) {
      setTimeout(() => {
        const reply: ChatMessage = {
          id: `msg_reply_${Date.now()}`,
          senderId: activePartner.id,
          receiverId: currentUser.id,
          content: `Thank you for asking this thoughtful question about ${content.slice(0, 35)}... I really appreciate open discussions like this. Let me share my perspective!`,
          timestamp: 'Just now',
        };
        const withReply = StorageService.saveChatMessage(activePartner.id, reply);
        setMessages(withReply);
      }, 1500);
    }
  };

  const handleBlockUser = () => {
    setIsBlockModalOpen(false);
    showToast('User Blocked', `${activePartner?.name} has been blocked and removed from your conversation list.`, 'info');
  };

  const handleReportUser = () => {
    setIsReportModalOpen(false);
    showToast(
      'Report Submitted with Grievance Officer',
      'Thank you for alerting our trust team. Our safety desk reviews all reports within 2 hours under our ethical charter.',
      'success'
    );
  };

  if (chatPartners.length === 0) {
    return (
      <div className="container" style={{ padding: '3rem 1.25rem', textAlign: 'center' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px dashed var(--color-gold)', borderRadius: 'var(--radius-lg)', padding: '3.5rem 2rem', maxWidth: '520px', margin: '0 auto' }}>
          <MessageCircle size={36} color="var(--color-gold-dark)" style={{ margin: '0 auto 1rem' }} />
          <h2 className="heading-card" style={{ marginBottom: '0.5rem', color: 'var(--color-burgundy-dark)' }}>
            No Active Conversations
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Direct messaging unlocks as soon as you have a mutual match! Explore profiles in Discover and express interest to get connected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '1.5rem 1.25rem 4rem', animation: 'fadeIn 250ms ease-out' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 320px) 1fr', gap: '1.5rem', minHeight: '620px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: 'var(--border-delicate)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
        
        {/* Left Column: Conversation List */}
        <div style={{ borderRight: 'var(--border-light)', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.25rem', borderBottom: 'var(--border-light)' }}>
            <h2 className="heading-card" style={{ fontSize: '1.3rem', color: 'var(--color-burgundy-dark)' }}>
              Messages
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Mutual encrypted communication channel
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {chatPartners.map((partner) => {
              const isActive = activePartner?.id === partner.id;
              return (
                <div
                  key={partner.id}
                  onClick={() => setActiveChatPartnerId(partner.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '1rem 1.25rem',
                    borderBottom: '1px solid rgba(197, 160, 89, 0.15)',
                    background: isActive ? '#FFFFFF' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    borderLeft: isActive ? '4px solid var(--color-burgundy)' : '4px solid transparent',
                  }}
                >
                  <img
                    src={partner.photoUrl}
                    alt={partner.name}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-gold)' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-burgundy-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {partner.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {partner.profession}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Conversation */}
        {activePartner ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Chat Header */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: 'var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <img
                  src={activePartner.photoUrl}
                  alt={activePartner.name}
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-burgundy-dark)' }}>
                      {activePartner.name}
                    </span>
                    <StatusBadge status="verified" size="sm" customLabel="ChaanBean Verified" />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Mutual Match • {activePartner.currentCity}
                  </div>
                </div>
              </div>

              {/* Safety & Action Controls */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn-outline"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                  onClick={() => setIsReportModalOpen(true)}
                  title="Report Profile"
                >
                  <ShieldAlert size={14} color="var(--color-burgundy)" />
                  <span>Report</span>
                </button>
                <button
                  className="btn-outline"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                  onClick={() => setIsBlockModalOpen(true)}
                  title="Block Profile"
                >
                  <UserX size={14} />
                  <span>Block</span>
                </button>
              </div>
            </div>

            {/* Guided Conversation Icebreakers: Talk Before You Marry */}
            <div style={{ background: 'var(--bg-secondary)', padding: '0.65rem 1.25rem', borderBottom: '1px solid rgba(197, 160, 89, 0.25)', display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-burgundy)', whiteSpace: 'nowrap' }}>
                <Sparkles size={13} color="var(--color-gold-dark)" />
                <span>Talk Before You Marry:</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {TALK_BEFORE_YOU_MARRY_PROMPTS.slice(0, 4).map((p, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSendMessage(p.prompt, true)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(197, 160, 89, 0.4)',
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      color: 'var(--color-burgundy-dark)',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                    }}
                    title={p.context}
                  >
                    💬 {p.category}
                  </button>
                ))}
              </div>
            </div>

            {/* Message History */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Privacy Notice */}
              <div style={{ textAlign: 'center', margin: '0 auto 0.5rem', background: 'rgba(197, 160, 89, 0.15)', border: '1px solid rgba(197, 160, 89, 0.3)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Lock size={12} color="var(--color-burgundy)" />
                <span>End-to-end encrypted • Do not share passwords or financial OTPs</span>
              </div>

              {messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '75%',
                      background: isMe ? 'var(--color-burgundy)' : '#FFFFFF',
                      color: isMe ? '#FFFFFF' : 'var(--text-primary)',
                      padding: '0.85rem 1.15rem',
                      borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      boxShadow: 'var(--shadow-sm)',
                      border: isMe ? 'none' : '1px solid rgba(197, 160, 89, 0.25)',
                    }}
                  >
                    {msg.isPromptStarter && (
                      <div style={{ fontSize: '0.72rem', color: isMe ? '#FCD34D' : 'var(--color-gold-dark)', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Sparkles size={12} />
                        <span>Curated Discussion Prompt</span>
                      </div>
                    )}
                    <div style={{ fontSize: '0.88rem', lineHeight: 1.55 }}>
                      {msg.content}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: isMe ? '#F3E8E2' : 'var(--text-muted)', textAlign: 'right', marginTop: '0.35rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.25rem' }}>
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck size={12} />}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div style={{ padding: '1rem 1.25rem', background: '#FFFFFF', borderTop: 'var(--border-light)', display: 'flex', gap: '0.75rem' }}>
              <input
                className="form-input"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder={`Type a respectful message to ${activePartner.name}...`}
              />
              <button
                className="btn-primary"
                onClick={() => handleSendMessage()}
                style={{ padding: '0.75rem 1.25rem' }}
                disabled={!messageText.trim()}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report Profile to Trust & Safety"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            We take safety and integrity extremely seriously. Please select why you are reporting {activePartner?.name}:
          </p>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={reportReason} onChange={(e) => setReportReason(e.target.value)}>
              <option value="inappropriate_behavior">Inappropriate or Harassing Messages</option>
              <option value="fake_identity">Suspected Impersonation or False Credentials</option>
              <option value="financial_demands">Pressure Regarding Money or Dowry</option>
              <option value="commercial_spam">Commercial Solicitation or Scam</option>
              <option value="other">Other Violation of Community Guidelines</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Additional Details</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="Provide specific context to assist our investigation..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button className="btn-outline" onClick={() => setIsReportModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-primary" style={{ background: 'var(--color-danger)' }} onClick={handleReportUser}>
              Submit Formal Report
            </button>
          </div>
        </div>
      </Modal>

      {/* Block Modal */}
      <Modal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        title={`Block ${activePartner?.name}?`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Blocking will immediately disconnect you from {activePartner?.name}. They will not be able to message you, view your profile layers, or discover you in search results.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button className="btn-outline" onClick={() => setIsBlockModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-primary" style={{ background: 'var(--color-danger)' }} onClick={handleBlockUser}>
              Confirm Block
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
