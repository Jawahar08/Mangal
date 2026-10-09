// App Context for Global State Management

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { StorageService } from '../services/storageService';
import { MOCK_DISCOVERY_PROFILES } from '../data/mockProfiles';

export type ActiveTab = 'home' | 'discover' | 'second_chapter' | 'matches' | 'messages' | 'trust' | 'intelligence' | 'profile' | 'roadmap' | 'onboarding';

interface ToastInfo {
  id: string;
  title: string;
  desc?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentUser: UserProfile;
  updateCurrentUser: (profile: UserProfile) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  discoveryProfiles: UserProfile[];
  savedProfileIds: string[];
  toggleSaveProfile: (id: string) => void;
  interestsSent: string[];
  mutualConnections: string[];
  photoUnlockedIds: string[];
  sendInterest: (id: string) => void;
  requestPhotoAccess: (id: string) => void;
  activePartnerForDetail: UserProfile | null;
  openPartnerDetail: (partner: UserProfile) => void;
  closePartnerDetail: () => void;
  activeChatPartnerId: string | null;
  setActiveChatPartnerId: (id: string | null) => void;
  startChatWith: (partnerId: string) => void;
  toasts: ToastInfo[];
  showToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isRecoveryModalOpen: boolean;
  openRecoveryModal: () => void;
  closeRecoveryModal: () => void;
  isLoggedIn: boolean;
  loginUser: (email: string) => void;
  logoutUser: () => void;
  startOnboarding: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => StorageService.getUserProfile());
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [discoveryProfiles] = useState<UserProfile[]>(MOCK_DISCOVERY_PROFILES);
  const [savedProfileIds, setSavedProfileIds] = useState<string[]>(() => StorageService.getSavedProfileIds());
  const [interestsSent, setInterestsSent] = useState<string[]>(() => StorageService.getInterestsSent());
  const [mutualConnections, setMutualConnections] = useState<string[]>(() => StorageService.getMutualConnections());
  const [photoUnlockedIds, setPhotoUnlockedIds] = useState<string[]>(() => StorageService.getPhotoUnlockedIds());
  const [activePartnerForDetail, setActivePartnerForDetail] = useState<UserProfile | null>(null);
  const [activeChatPartnerId, setActiveChatPartnerId] = useState<string | null>('p_radhika_02');
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => StorageService.getAuthSession().isAuthenticated);

  const showToast = (title: string, desc?: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, title, desc, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateCurrentUser = (profile: UserProfile) => {
    setCurrentUser(profile);
    StorageService.saveUserProfile(profile);
  };

  const toggleSaveProfile = (id: string) => {
    const updated = StorageService.toggleSaveProfile(id);
    setSavedProfileIds(updated);
    const isSaved = updated.includes(id);
    showToast(
      isSaved ? 'Profile Saved' : 'Profile Removed',
      isSaved ? 'You can review this match anytime in your Saved tab.' : 'Removed from your saved list.',
      'info'
    );
  };

  const sendInterest = (id: string) => {
    const { interests, isMutual } = StorageService.sendInterest(id);
    setInterestsSent(interests);
    if (isMutual) {
      setMutualConnections(StorageService.getMutualConnections());
      showToast(
        '✨ It’s a Mutual Match!',
        'You both have expressed interest! Private messaging and compatibility discussions are now unlocked.',
        'success'
      );
    } else {
      showToast('Interest Expressed', 'Your expression of interest has been sent respectfully.', 'info');
    }
  };

  const requestPhotoAccess = (id: string) => {
    const updated = StorageService.requestPhotoAccess(id);
    setPhotoUnlockedIds(updated);
    showToast(
      'Photo Access Granted',
      'The member’s privacy settings have unlocked their gallery for your verified profile.',
      'success'
    );
  };

  const openPartnerDetail = (partner: UserProfile) => {
    setActivePartnerForDetail(partner);
  };

  const closePartnerDetail = () => {
    setActivePartnerForDetail(null);
  };

  const startChatWith = (partnerId: string) => {
    setActiveChatPartnerId(partnerId);
    setActiveTab('messages');
  };

  const loginUser = (email: string) => {
    setIsLoggedIn(true);
    StorageService.setAuthSession({ isAuthenticated: true, email });
    setIsAuthModalOpen(false);
    showToast('Welcome Back', `Logged in as ${email}`, 'success');
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    StorageService.setAuthSession({ isAuthenticated: false });
    setActiveTab('home');
    showToast('Logged Out', 'You have been safely signed out.', 'info');
  };

  const startOnboarding = () => {
    setActiveTab('onboarding');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        updateCurrentUser,
        activeTab,
        setActiveTab,
        discoveryProfiles,
        savedProfileIds,
        toggleSaveProfile,
        interestsSent,
        mutualConnections,
        photoUnlockedIds,
        sendInterest,
        requestPhotoAccess,
        activePartnerForDetail,
        openPartnerDetail,
        closePartnerDetail,
        activeChatPartnerId,
        setActiveChatPartnerId,
        startChatWith,
        toasts,
        showToast,
        removeToast,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        isRecoveryModalOpen,
        openRecoveryModal: () => setIsRecoveryModalOpen(true),
        closeRecoveryModal: () => setIsRecoveryModalOpen(false),
        isLoggedIn,
        loginUser,
        logoutUser,
        startOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
