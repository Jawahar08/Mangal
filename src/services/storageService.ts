// Local Storage Persistence Service for MangalSutra 2.0

import { UserProfile, ChatMessage, ConnectionRequest } from '../types';
import { INITIAL_USER, MOCK_DISCOVERY_PROFILES } from '../data/mockProfiles';

const KEYS = {
  USER_PROFILE: 'ms_user_profile_v2',
  SAVED_PROFILES: 'ms_saved_profile_ids_v2',
  INTERESTS_SENT: 'ms_interests_sent_v2',
  MUTUAL_CONNECTIONS: 'ms_mutual_connections_v2',
  PHOTO_REQUESTS: 'ms_photo_requests_v2',
  CHAT_MESSAGES: 'ms_chat_messages_v2',
  ONBOARDING_DRAFT: 'ms_onboarding_draft_v2',
  AUTH_SESSION: 'ms_auth_session_v2',
};

export const StorageService = {
  // User Profile
  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.USER_PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    return INITIAL_USER;
  },

  saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Storage write failed', e);
    }
  },

  // Saved Profiles
  getSavedProfileIds(): string[] {
    try {
      const data = localStorage.getItem(KEYS.SAVED_PROFILES);
      return data ? JSON.parse(data) : ['p_ananya_01'];
    } catch {
      return ['p_ananya_01'];
    }
  },

  toggleSaveProfile(id: string): string[] {
    const list = this.getSavedProfileIds();
    const index = list.indexOf(id);
    const updated = index >= 0 ? list.filter((item) => item !== id) : [...list, id];
    localStorage.setItem(KEYS.SAVED_PROFILES, JSON.stringify(updated));
    return updated;
  },

  // Interests & Mutual Connections
  getInterestsSent(): string[] {
    try {
      const data = localStorage.getItem(KEYS.INTERESTS_SENT);
      return data ? JSON.parse(data) : ['p_radhika_02'];
    } catch {
      return ['p_radhika_02'];
    }
  },

  sendInterest(id: string): { interests: string[]; isMutual: boolean } {
    const list = this.getInterestsSent();
    const updated = Array.from(new Set([...list, id]));
    localStorage.setItem(KEYS.INTERESTS_SENT, JSON.stringify(updated));

    // Simulation: Radhika automatically accepts mutual connection for demo
    let mutuals = this.getMutualConnections();
    let isMutual = false;
    if (id === 'p_radhika_02' || id === 'p_ananya_01') {
      mutuals = Array.from(new Set([...mutuals, id]));
      localStorage.setItem(KEYS.MUTUAL_CONNECTIONS, JSON.stringify(mutuals));
      isMutual = true;
    }
    return { interests: updated, isMutual };
  },

  getMutualConnections(): string[] {
    try {
      const data = localStorage.getItem(KEYS.MUTUAL_CONNECTIONS);
      return data ? JSON.parse(data) : ['p_radhika_02'];
    } catch {
      return ['p_radhika_02'];
    }
  },

  // Photo Requests
  getPhotoUnlockedIds(): string[] {
    try {
      const data = localStorage.getItem(KEYS.PHOTO_REQUESTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  requestPhotoAccess(id: string): string[] {
    const list = this.getPhotoUnlockedIds();
    const updated = Array.from(new Set([...list, id]));
    localStorage.setItem(KEYS.PHOTO_REQUESTS, JSON.stringify(updated));
    return updated;
  },

  // Chat Messages
  getChatMessages(partnerId: string): ChatMessage[] {
    try {
      const allChats = localStorage.getItem(KEYS.CHAT_MESSAGES);
      const parsed = allChats ? JSON.parse(allChats) : {};
      if (parsed[partnerId]) return parsed[partnerId];
    } catch {
      // fallback
    }

    // Default sample messages for mutual match (Radhika)
    if (partnerId === 'p_radhika_02') {
      return [
        {
          id: 'msg_1',
          senderId: 'p_radhika_02',
          receiverId: 'usr_arjun_99',
          content: 'Namaste Arjun! It is wonderful to connect with you. I noticed your interest in classical music and architecture — that resonated with me right away!',
          timestamp: 'Yesterday, 07:15 PM',
        },
        {
          id: 'msg_2',
          senderId: 'usr_arjun_99',
          receiverId: 'p_radhika_02',
          content: 'Namaste Radhika! Delighted to connect. I read through your design philosophy and saw your verified ChaanBean trust profile. I also love that you enjoy Hindustani classical vocals!',
          timestamp: 'Yesterday, 07:42 PM',
        },
        {
          id: 'msg_3',
          senderId: 'p_radhika_02',
          receiverId: 'usr_arjun_99',
          content: 'Yes! I have been learning Gwalior gharana vocals for a few years. How did you start learning sitar?',
          timestamp: 'Yesterday, 08:05 PM',
        },
      ];
    }

    return [];
  },

  saveChatMessage(partnerId: string, message: ChatMessage): ChatMessage[] {
    const allChats = (() => {
      try {
        const stored = localStorage.getItem(KEYS.CHAT_MESSAGES);
        return stored ? JSON.parse(stored) : {};
      } catch {
        return {};
      }
    })();

    const current = allChats[partnerId] || this.getChatMessages(partnerId);
    const updated = [...current, message];
    allChats[partnerId] = updated;
    localStorage.setItem(KEYS.CHAT_MESSAGES, JSON.stringify(allChats));
    return updated;
  },

  // Onboarding draft save / resume
  getOnboardingDraft(): any {
    try {
      const data = localStorage.getItem(KEYS.ONBOARDING_DRAFT);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveOnboardingDraft(draft: any): void {
    try {
      localStorage.setItem(KEYS.ONBOARDING_DRAFT, JSON.stringify(draft));
    } catch (e) {
      console.warn('Draft save failed', e);
    }
  },

  clearOnboardingDraft(): void {
    localStorage.removeItem(KEYS.ONBOARDING_DRAFT);
  },

  // Auth session
  getAuthSession(): { isAuthenticated: boolean; email?: string } {
    try {
      const data = localStorage.getItem(KEYS.AUTH_SESSION);
      return data ? JSON.parse(data) : { isAuthenticated: true, email: 'arjun.sharma@example.com' };
    } catch {
      return { isAuthenticated: true, email: 'arjun.sharma@example.com' };
    }
  },

  setAuthSession(session: { isAuthenticated: boolean; email?: string }): void {
    localStorage.setItem(KEYS.AUTH_SESSION, JSON.stringify(session));
  },
};
