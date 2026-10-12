// MangalSutra 2.0: Core Application Orchestrator

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { AuthModal } from './components/auth/AuthModal';
import { RecoveryModal } from './components/auth/RecoveryModal';

import { HomeView } from './components/home/HomeView';
import { DiscoverView } from './components/discover/DiscoverView';
import { MatchesView } from './components/matches/MatchesView';
import { ChatView } from './components/chat/ChatView';
import { TrustDashboard } from './components/trust/TrustDashboard';
import { ProfileView } from './components/profile/ProfileView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { MarriageIntelligenceHub } from './components/intelligence/MarriageIntelligenceHub';
import { SecondChapterHub } from './components/secondChapter/SecondChapterHub';
import { PrathaHub } from './components/pratha/PrathaHub';
import { MarketplaceHub } from './components/marketplace/MarketplaceHub';
import { VerificationGate } from './components/common/VerificationGate';

const MainRouter: React.FC = () => {
  const { activeTab, isUserVerified } = useApp();

  // Public views
  if (activeTab === 'home') return <main className="main-content"><HomeView /></main>;
  if (activeTab === 'roadmap') return <main className="main-content"><RoadmapView /></main>;
  if (activeTab === 'onboarding') return <main className="main-content"><OnboardingFlow /></main>;

  // Security & Trust Gate: feature access requires verified account
  if (!isUserVerified) {
    const featureLabels: Record<string, string> = {
      discover: 'Candidate Discovery',
      second_chapter: 'Second Chapter (Remarriage)',
      matches: 'Mutual Matches & Interests',
      messages: 'Private Messages & Chat',
      trust: 'ChaanBean Trust Vault',
      intelligence: 'Marriage Intelligence Hub',
      pratha: 'Pratha Ritual Traditions',
      marketplace: 'Curated Wedding Marketplace',
      profile: 'My 5-Layer Profile',
    };
    return (
      <main className="main-content">
        <VerificationGate 
          featureName={featureLabels[activeTab] || 'This Feature'} 
        />
      </main>
    );
  }

  // Verified Member Views
  return (
    <main className="main-content">
      {activeTab === 'discover' && <DiscoverView />}
      {activeTab === 'second_chapter' && <SecondChapterHub />}
      {activeTab === 'matches' && <MatchesView />}
      {activeTab === 'messages' && <ChatView />}
      {activeTab === 'trust' && <TrustDashboard />}
      {activeTab === 'intelligence' && <MarriageIntelligenceHub />}
      {activeTab === 'pratha' && <PrathaHub />}
      {activeTab === 'marketplace' && <MarketplaceHub />}
      {activeTab === 'profile' && <ProfileView />}
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="page-wrapper">
        <Navbar />
        <MainRouter />
        <Footer />
        <ToastContainer />
        <AuthModal />
        <RecoveryModal />
      </div>
    </AppProvider>
  );
};

export default App;
