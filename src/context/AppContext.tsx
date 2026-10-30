// App Context for Global State Management & Backend Integration
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { StorageService } from '../services/storageService';
import { MOCK_DISCOVERY_PROFILES, GUEST_USER } from '../data/mockProfiles';
import { AuthService, ProfileService, DiscoveryService } from '../services/backend';

export type ActiveTab = 
  | 'home' 
  | 'discover' 
  | 'second_chapter' 
  | 'matches' 
  | 'messages' 
  | 'trust' 
  | 'intelligence' 
  | 'pratha' 
  | 'marketplace' 
  | 'profile' 
  | 'roadmap' 
  | 'onboarding'
  | 'login';

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
  isUserVerified: boolean;
  loginUser: (email: string) => void;
  logoutUser: () => void;
  deleteAccount: () => Promise<void>;
  startOnboarding: () => void;
  activeTrustProfileUser: UserProfile | null;
  openTrustProfileModal: (user: UserProfile) => void;
  closeTrustProfileModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => StorageService.getUserProfile());
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [discoveryProfiles, setDiscoveryProfiles] = useState<UserProfile[]>(MOCK_DISCOVERY_PROFILES);
  const [savedProfileIds, setSavedProfileIds] = useState<string[]>(() => StorageService.getSavedProfileIds());
  const [interestsSent, setInterestsSent] = useState<string[]>(() => StorageService.getInterestsSent());
  const [mutualConnections, setMutualConnections] = useState<string[]>(() => StorageService.getMutualConnections());
  const [photoUnlockedIds, setPhotoUnlockedIds] = useState<string[]>(() => StorageService.getPhotoUnlockedIds());
  const [activePartnerForDetail, setActivePartnerForDetail] = useState<UserProfile | null>(null);
  const [activeChatPartnerId, setActiveChatPartnerId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const [activeTrustProfileUser, setActiveTrustProfileUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => AuthService.getSession().isAuthenticated);

  const isUserVerified = Boolean(isLoggedIn && currentUser?.isRegisteredUser && currentUser.id !== 'usr_guest_unregistered');

  // Sync profile on mount
  useEffect(() => {
    ProfileService.getProfile(currentUser.id).then((p) => {
      if (p) setCurrentUser(p);
    });
  }, []);

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
    ProfileService.updateProfile(profile);
    if (profile.isRegisteredUser) {
      setIsLoggedIn(true);
      StorageService.setAuthSession({ isAuthenticated: true, email: profile.name });
    }
  };

  const toggleSaveProfile = async (targetId: string) => {
    const res = await DiscoveryService.toggleSaveProfile(currentUser.id, targetId);
    setSavedProfileIds(res.savedIds);
    showToast(
      res.isSaved ? 'Profile Saved' : 'Profile Removed',
      res.isSaved ? 'You can review this match anytime in your Saved tab.' : 'Removed from your saved list.',
      'info'
    );
  };

  const sendInterest = async (targetId: string) => {
    const res = await DiscoveryService.sendInterest(currentUser.id, targetId);
    setInterestsSent(res.interests);
    if (res.isMutual) {
      setMutualConnections(StorageService.getMutualConnections());
      showToast(
        '✨ It’s a Mutual Match!',
        'You both have expressed interest! Private messaging and compatibility discussions are now unlocked.',
        'success'
      );
    } else {
      showToast('Interest Expressed', res.message, 'info');
    }
  };

  const requestPhotoAccess = async (targetId: string) => {
    const res = await DiscoveryService.requestPhotoAccess(currentUser.id, targetId);
    setPhotoUnlockedIds(res.unlockedIds);
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
    AuthService.signInWithEmail(email);
    if (email.toLowerCase().includes('arjun') || email.toLowerCase().includes('demo')) {
      StorageService.loginAsDemoUser();
      const demo = StorageService.getUserProfile();
      setCurrentUser(demo);
      setInterestsSent(StorageService.getInterestsSent());
      setMutualConnections(StorageService.getMutualConnections());
      setSavedProfileIds(StorageService.getSavedProfileIds());
    } else {
      const existing = StorageService.getUserProfile();
      if (existing && existing.isRegisteredUser) {
        setCurrentUser(existing);
        setInterestsSent(StorageService.getInterestsSent());
        setMutualConnections(StorageService.getMutualConnections());
      }
    }
    setIsAuthModalOpen(false);
    showToast('Welcome Back', `Logged in as ${email}`, 'success');
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    AuthService.signOut();
    setCurrentUser(GUEST_USER);
    setInterestsSent([]);
    setMutualConnections([]);
    setSavedProfileIds([]);
    setActiveChatPartnerId(null);
    setActiveTab('home');
    showToast('Logged Out', 'You have been safely signed out.', 'info');
  };

  const deleteAccount = async () => {
    await AuthService.deleteAccount(currentUser.id);
    setIsLoggedIn(false);
    setActiveTab('home');
    showToast('Account Deleted', 'Your profile and data have been permanently purged.', 'info');
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
        isUserVerified,
        loginUser,
        logoutUser,
        deleteAccount,
        startOnboarding,
        activeTrustProfileUser,
        openTrustProfileModal: (user: UserProfile) => setActiveTrustProfileUser(user),
        closeTrustProfileModal: () => setActiveTrustProfileUser(null),
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
